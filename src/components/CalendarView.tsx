import React from 'react';
import type { ScheduleConfig } from '../types';
import { getDayStatusForMonth, toKey } from '../utils/scheduleCalculator';
import { formatMonthName, WEEKDAY_LABELS } from '../utils/dateUtils';

interface Props {
  lastDayOff: Date;
  config: ScheduleConfig;
}

const CalendarView: React.FC<Props> = ({ lastDayOff, config }) => {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());

  const statusMap = React.useMemo(
    () => getDayStatusForMonth(lastDayOff, config, year, month),
    [lastDayOff, config, year, month]
  );

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const getStatus = (day: number) => {
    const key = toKey(new Date(year, month, day));
    return statusMap.get(key) ?? 'work';
  };

  return (
    <div className="calendar-wrapper card">
      <div className="calendar-nav">
        <button className="nav-btn" onClick={prevMonth} aria-label="Mês anterior">‹</button>
        <span className="calendar-month-label">{formatMonthName(year, month)}</span>
        <button className="nav-btn" onClick={nextMonth} aria-label="Próximo mês">›</button>
      </div>

      <div className="calendar-legend">
        <span className="legend-item"><span className="legend-dot off" />Folga</span>
        <span className="legend-item"><span className="legend-dot bonus" />Dobradinha</span>
        <span className="legend-item"><span className="legend-dot today" />Hoje</span>
      </div>

      <div className="calendar-grid">
        {WEEKDAY_LABELS.map((wd) => (
          <div key={wd} className="calendar-weekday">{wd}</div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="calendar-cell empty" />;
          const status = getStatus(day);
          return (
            <div
              key={day}
              className={`calendar-cell ${status} ${isToday(day) ? 'today' : ''}`}
              title={status === 'off' ? 'Folga' : status === 'bonus' ? 'Dobradinha' : ''}
            >
              <span>{day}</span>
              {status !== 'work' && <span className="cell-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
