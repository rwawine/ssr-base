import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  options: Option[];
  onSelect: (value: string) => void;
  value?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect, value }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <div
        style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: '#fff' }}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? selected.label : 'Выберите...'}
      </div>
      {open && (
        <div style={{ position: 'absolute', zIndex: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 4, width: '100%' }}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{ padding: 8, cursor: 'pointer', background: value === option.value ? '#f6f6f6' : '#fff' }}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown; 