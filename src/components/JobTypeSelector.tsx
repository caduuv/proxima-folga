import React from 'react';
import { SCHEDULE_CONFIGS } from '../config/scheduleConfigs';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

const JobTypeSelector: React.FC<Props> = ({ value, onChange }) => (
  <div className="field-group">
    <label className="field-label" htmlFor="job-type-select">
      Tipo de Cargo
    </label>
    <div className="select-wrapper">
      <select
        id="job-type-select"
        className="styled-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SCHEDULE_CONFIGS.map((cfg) => (
          <option key={cfg.id} value={cfg.id}>
            {cfg.label}
          </option>
        ))}
      </select>
      <span className="select-arrow">▾</span>
    </div>
  </div>
);

export default JobTypeSelector;
