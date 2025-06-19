import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
    <select {...props} style={{ padding: 8, border: error ? '1px solid red' : '1px solid #ccc', borderRadius: 4, width: '100%' }}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
  </div>
);

export default Select; 