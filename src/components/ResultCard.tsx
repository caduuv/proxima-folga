import React from 'react';
import type { DayOffEntry } from '../types';
import { formatDateLong, formatDateShort } from '../utils/dateUtils';

interface Props {
  entries: DayOffEntry[];
}

const ResultCard: React.FC<Props> = ({ entries }) => {
  if (entries.length === 0) return null;

  const next = entries[0];
  const isDouble = entries[1]?.isBonus && entries[1]?.date.getDate() === next.date.getDate() + 1;
  const upcoming = entries.slice(0, 6);

  return (
    <div className="result-card">
      <div className="result-next">
        <div className="result-next-label">Próxima folga</div>
        <div className="result-next-date">{formatDateLong(next.date)}</div>
        {isDouble && (
          <div className="badge badge-double">
            🎉 Dobradinha!
          </div>
        )}
      </div>

      <div className="result-list-title">Próximas folgas</div>
      <ul className="result-list">
        {upcoming.map((e, i) => (
          <li key={i} className={`result-list-item ${e.isBonus ? 'bonus' : ''}`}>
            <span className="result-list-dot" />
            <span className="result-list-date">{formatDateShort(e.date)}</span>
            <span className="result-list-weekday">
              {e.date.toLocaleDateString('pt-BR', { weekday: 'long' })}
            </span>
            {e.isBonus && <span className="result-list-badge">{e.bonusLabel}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultCard;
