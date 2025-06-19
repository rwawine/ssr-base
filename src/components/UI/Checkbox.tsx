import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <input type="checkbox" {...props} />
    {label}
  </label>
);

export default Checkbox; 