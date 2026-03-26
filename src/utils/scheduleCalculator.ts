import type { ScheduleConfig, DayOffEntry, DayStatus } from '../types';
import { addDays, isSameDay, toDateOnly } from './dateUtils';

/**
 * Returns how many days to advance to the start of the NEXT cycle.
 * When a special rule fires on `offDate` (e.g. Friday → dobradinha),
 * the bonus days are consumed before the next cycle begins,
 * so the advance is cycleLength + extraDaysOff instead of just cycleLength.
 */
function effectiveCycleAdvance(offDate: Date, config: ScheduleConfig): number {
  if (!config.specialRules) return config.cycleLength;
  const fired = config.specialRules.find(
    (r) => offDate.getDay() === r.triggerDayOfWeek
  );
  return config.cycleLength + (fired?.extraDaysOff ?? 0);
}

/**
 * Core schedule calculation engine.
 *
 * The algorithm works in pure calendar arithmetic:
 *   1. Calculate how many full cycles have elapsed since `lastDayOff`.
 *   2. Walk forward cycle by cycle, collecting off-day blocks.
 *   3. Apply any SpecialRules (e.g. the Friday double-off rule).
 */

/**
 * Given a known `lastDayOff`, generate the next `count` day-off "events".
 * Each event may span multiple DayOffEntry objects when a SpecialRule fires.
 */
export function getUpcomingDaysOff(
  lastDayOff: Date,
  config: ScheduleConfig,
  count: number
): DayOffEntry[] {
  const results: DayOffEntry[] = [];
  const base = toDateOnly(lastDayOff);

  // Start from the cycle AFTER the reference day off
  let cycleStart = addDays(base, config.cycleLength);

  while (results.length < count) {
    // The off block starts at cycleStart
    for (let i = 0; i < config.offDaysInCycle && results.length < count; i++) {
      const offDate = addDays(cycleStart, i);

      const bonusRule = config.specialRules?.find((rule) => rule.triggerDayOfWeek === offDate.getDay());
      results.push({ date: offDate, isBonus: !!bonusRule, bonusLabel: bonusRule?.label });

      // Apply special rules to the first day of the off block
      if (i === 0 && config.specialRules) {
        for (const rule of config.specialRules) {
          if (offDate.getDay() === rule.triggerDayOfWeek) {
            for (let e = 1; e <= rule.extraDaysOff; e++) {
              results.push({
                date: addDays(offDate, e),
                isBonus: true,
                bonusLabel: rule.label,
              });
            }
          }
        }
      }
    }

    // When a special rule fired (e.g. dobradinha), advance past the bonus days
    // so the next cycle starts the day after the last bonus day (e.g. Sunday).
    const firstOffDate = cycleStart; // i === 0 is always the trigger day
    cycleStart = addDays(cycleStart, effectiveCycleAdvance(firstOffDate, config));
  }

  return results.slice(0, count);
}

/**
 * Returns all day-off entries (including bonus days) that fall within the
 * given calendar month. Looks back and forward up to 6 months to be safe.
 */
export function getDaysOffInMonth(
  lastDayOff: Date,
  config: ScheduleConfig,
  year: number,
  month: number // 0-indexed
): DayOffEntry[] {
  // Generate enough cycles to cover the month comfortably
  const entries = getUpcomingDaysOff(lastDayOff, config, 100);
  return entries.filter(
    (e) => e.date.getFullYear() === year && e.date.getMonth() === month
  );
}

/**
 * Returns all day-off entries that fall before the target month too,
 * needed to populate a calendar that might start before the lastDayOff + 1 cycle.
 */
export function getDayStatusForMonth(
  lastDayOff: Date,
  config: ScheduleConfig,
  year: number,
  month: number // 0-indexed
): Map<string, DayStatus> {
  const map = new Map<string, DayStatus>();

  // We need entries stretching back in time too — so walk backward
  const allEntries = getAllDaysOff(lastDayOff, config, year, month);

  for (const e of allEntries) {
    const key = toKey(e.date);
    map.set(key, e.isBonus ? 'bonus' : 'off');
  }

  return map;
}

function getAllDaysOff(
  lastDayOff: Date,
  config: ScheduleConfig,
  year: number,
  month: number
): DayOffEntry[] {
  const targetStart = new Date(year, month, 1);
  const targetEnd = new Date(year, month + 1, 0);

  const entries: DayOffEntry[] = [];

  // Walk backward from lastDayOff to find the start of all cycles covering this month
  // The earliest possible off-day we care about is the 1st of the month
  // Walk backward in cycles from lastDayOff
  let cycleBase = toDateOnly(lastDayOff);

  // Find the cycle that might touch the start of the target month
  while (addDays(cycleBase, config.cycleLength) > targetStart) {
    cycleBase = addDays(cycleBase, -config.cycleLength);
  }

  // Now walk forward from cycleBase, collecting off days within [targetStart, targetEnd]
  let cursor = cycleBase;
  // Advance until we're past the end of the month + a full cycle buffer
  const limit = addDays(targetEnd, config.cycleLength * 2);

  while (cursor <= limit) {
    const nextCycle = addDays(cursor, config.cycleLength);
    // The off block is at nextCycle
    for (let i = 0; i < config.offDaysInCycle; i++) {
      const offDate = addDays(nextCycle, i);
      if (offDate >= targetStart && offDate <= targetEnd) {
        entries.push({ date: offDate, isBonus: false });
      }
      if (i === 0 && config.specialRules) {
        for (const rule of config.specialRules) {
          if (offDate.getDay() === rule.triggerDayOfWeek) {
            for (let e = 1; e <= rule.extraDaysOff; e++) {
              const bonusDate = addDays(offDate, e);
              if (bonusDate >= targetStart && bonusDate <= targetEnd) {
                entries.push({ date: bonusDate, isBonus: true, bonusLabel: rule.label });
              }
            }
          }
        }
      }
    }
    // Advance past bonus days when a special rule fired on this cycle's off-day
    cursor = addDays(cursor, effectiveCycleAdvance(nextCycle, config));
    if (cursor > limit) break;
  }

  return entries;
}

/**
 * Check if a specific date is a day off for the given config.
 */
export function isDayOff(
  date: Date,
  lastDayOff: Date,
  config: ScheduleConfig
): { isOff: boolean; isBonus: boolean; bonusLabel?: string } {
  const entries = getUpcomingDaysOff(lastDayOff, config, 200);
  const match = entries.find((e) => isSameDay(e.date, date));
  if (!match) return { isOff: false, isBonus: false };
  return { isOff: true, isBonus: match.isBonus, bonusLabel: match.bonusLabel };
}

export const toKey = (d: Date): string =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
