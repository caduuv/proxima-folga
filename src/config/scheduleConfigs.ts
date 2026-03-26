import type { ScheduleConfig } from '../types';

/**
 * Central registry of all job-type schedule configurations.
 * To add a new job type, simply append a new entry to this array.
 * No other files need to be modified.
 */
export const SCHEDULE_CONFIGS: ScheduleConfig[] = [
  {
    id: 'farmaceutico',
    label: 'Farmacêutico RD',
    cycleLength: 4,      // 3 days work + 1 day off
    offDaysInCycle: 1,
    specialRules: [
      {
        triggerDayOfWeek: 5, // Friday
        extraDaysOff: 1,     // also gives Saturday off
        label: 'Dobradinha (Sex + Sáb)',
      },
    ],
  },
  {
    id: 'super-rd',
    label: 'Supervisor RD',
    cycleLength: 4,      // 3 days work + 1 day off
    offDaysInCycle: 1,
    specialRules: [
      {
        triggerDayOfWeek: 0,
        extraDaysOff: 1,
        label: 'Dobradinha (Dom + Seg)',
      },
    ],
  },

];

export const getConfigById = (id: string): ScheduleConfig | undefined =>
  SCHEDULE_CONFIGS.find((c) => c.id === id);
