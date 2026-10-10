import { useId, type ChangeEvent, type ReactNode } from "react";
import Icon from "./Icon";

type SelectOption = { value: string; label: string; disabled?: boolean };

type SelectProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: ReactNode;
};

export default function Select({
  label,
  value,
  onChange,
  options,
  className = "",
  disabled = false,
  required = false,
  helperText,
}: SelectProps) {
  const selectId = useId();

  return (
    <div className={("field " + className).trim()}>
      <label className="field-label" htmlFor={selectId}>
        <span>{label}</span>
        {required && <span className="required-mark" aria-hidden="true">*</span>}
      </label>
      <span className="select-wrap">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className="text-select"
          disabled={disabled}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={15} />
      </span>
      {helperText && <p className="field-helper">{helperText}</p>}
    </div>
  );
}
