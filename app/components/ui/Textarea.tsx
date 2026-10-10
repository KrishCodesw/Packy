import { ReactNode } from 'react';

interface TextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  helperText?: ReactNode;
}

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  rows = 4,
  helperText,
}: TextareaProps) {
  return (
    <div className={className}>
      <label className="input-label">
        {label}
        {required && <span className="text-accent">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="textarea"
        rows={rows}
        disabled={disabled}
      />
      {helperText && <p className="text-xs text-muted mt-1">{helperText}</p>}
    </div>
  );
}