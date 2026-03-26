export interface SpecialRule {
  /** Day of week that triggers the rule (0=Sun, 1=Mon, ..., 5=Fri, 6=Sat) */
  triggerDayOfWeek: number;
  /** Extra consecutive days off to append after the trigger day */
  extraDaysOff: number;
  label: string;
}

export interface ScheduleConfig {
  id: string;
  label: string;
  /** Total cycle length in days (work + off) */
  cycleLength: number;
  /** Number of off days in each cycle (starting from 0 position of off block) */
  offDaysInCycle: number;
  specialRules?: SpecialRule[];
}

export interface DayOffEntry {
  date: Date;
  /** true when a special rule expanded this block */
  isBonus: boolean;
  bonusLabel?: string;
}

export type DayStatus = 'off' | 'bonus' | 'work';
