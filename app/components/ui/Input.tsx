import { ReactNode } from 'react';

interface InputProps {
  type?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: ReactNode;
}

export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  helperText,
}: InputProps) {
  return (
    <div className={className}>
      <label className="input-label">
        {label}
        {required && <span className="text-accent">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input"
        disabled={disabled}
      />
      {helperText && <p className="text-xs text-muted mt-1">{helperText}</p>}
    </div>
  );
}