import React from 'react';
import type { ScheduleConfig } from '../types';
import { isDayOff } from '../utils/scheduleCalculator';
import { parseInputDate, formatDateLong } from '../utils/dateUtils';
import DateInput from './DateInput';

interface Props {
  lastDayOff: Date;
  config: ScheduleConfig;
}

const FutureChecker: React.FC<Props> = ({ lastDayOff, config }) => {
  const [checkValue, setCheckValue] = React.useState('');

  const checkDate = parseInputDate(checkValue);
  const result = checkDate ? isDayOff(checkDate, lastDayOff, config) : null;

  return (
    <div className="future-checker card">
      <h2 className="section-title">Verificar data futura</h2>
      <p className="section-subtitle">
        Selecione uma data para ver se haverá folga nesse dia.
      </p>

      <DateInput
        id="future-date"
        label="Data a verificar"
        value={checkValue}
        onChange={setCheckValue}
      />

      {result && checkDate && (
        <div className={`checker-result ${result.isOff ? 'is-off' : 'is-work'}`}>
          <span className="checker-icon">{result.isOff ? '✅' : '❌'}</span>
          <div className="checker-text">
            <strong>{formatDateLong(checkDate)}</strong>
            <span>
              {result.isOff
                ? result.isBonus
                  ? `Folga! (${result.bonusLabel ?? 'dia adicional'})`
                  : 'Dia de folga'
                : 'Dia de trabalho'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FutureChecker;
