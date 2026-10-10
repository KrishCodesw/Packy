import { ReactNode } from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  className = '',
  disabled = false,
}: CheckboxProps) {
  return (
    <label className={`check ${className}`} disabled={disabled}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
}