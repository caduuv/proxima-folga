import React from 'react';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
}

const DateInput: React.FC<Props> = ({ id, label, value, onChange, helpText }) => (
  <div className="field-group">
    <label className="field-label" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type="date"
      className="styled-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {helpText && <span className="field-help">{helpText}</span>}
  </div>
);

export default DateInput;
