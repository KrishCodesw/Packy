import { useId, type ChangeEvent, type ReactNode } from "react";

type TextareaProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  textareaClassName?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  helperText?: ReactNode;
  maxLength?: number;
};

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  className = "",
  textareaClassName = "",
  disabled = false,
  required = false,
  rows = 4,
  helperText,
  maxLength,
}: TextareaProps) {
  const textareaId = useId();

  return (
    <div className={("field " + className).trim()}>
      <label className="field-label" htmlFor={textareaId}>
        <span>{label}</span>
        {required && <span className="required-mark" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={("text-textarea " + textareaClassName).trim()}
        rows={rows}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
      />
      {helperText && <p className="field-helper">{helperText}</p>}
    </div>
  );
}
