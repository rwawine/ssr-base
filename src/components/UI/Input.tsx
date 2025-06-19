import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
    <input {...props} style={{ padding: 8, border: error ? '1px solid red' : '1px solid #ccc', borderRadius: 4, width: '100%' }} />
    {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
  </div>
);

export default Input; 