import { ReactNode } from 'react';

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: ReactNode;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  className = '',
  disabled = false,
  required = false,
  helperText,
}: SelectProps) {
  return (
    <div className={className}>
      <label className="input-label">
        {label}
        {required && <span className="text-accent">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="select"
        disabled={disabled}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && <p className="text-xs text-muted mt-1">{helperText}</p>}
    </div>
  );
}