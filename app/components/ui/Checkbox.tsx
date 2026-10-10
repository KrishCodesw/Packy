import type { ReactNode } from "react";
import Icon from "./Icon";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function Checkbox({
  label,
  checked,
  onChange,
  description,
  badge,
  icon,
  className = "",
  disabled = false,
}: CheckboxProps) {
  return (
    <label className={[
      "option-card",
      checked ? "selected" : "",
      disabled ? "disabled" : "",
      className,
    ].filter(Boolean).join(" ")}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
      />
      {icon && <span className="option-icon">{icon}</span>}
      <span className="option-copy">
        <span className="option-title">{label}</span>
        {description && <span className="option-description">{description}</span>}
      </span>
      {badge && <span className="option-badge">{badge}</span>}
      <span className="option-check" aria-hidden="true">
        {checked && <Icon name="check" size={13} strokeWidth={2.2} />}
      </span>
    </label>
  );
}
