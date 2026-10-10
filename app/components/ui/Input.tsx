import { useId, type ChangeEvent, type HTMLInputTypeAttribute, type ReactNode } from "react";

type InputProps = {
  type?: HTMLInputTypeAttribute;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: ReactNode;
  autoComplete?: string;
  maxLength?: number;
};

export default function Input({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  className = "",
  inputClassName = "",
  disabled = false,
  required = false,
  helperText,
  autoComplete,
  maxLength,
}: InputProps) {
  const inputId = useId();

  return (
    <div className={("field " + className).trim()}>
      <label className="field-label" htmlFor={inputId}>
        <span>{label}</span>
        {required && <span className="required-mark" aria-hidden="true">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={("text-input " + inputClassName).trim()}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
      />
      {helperText && <p className="field-helper">{helperText}</p>}
    </div>
  );
}
