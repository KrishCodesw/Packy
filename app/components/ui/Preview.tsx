import type { ReactNode } from "react";

type PreviewProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export default function Preview({
  children,
  className = "",
  label,
}: PreviewProps) {
  return (
    <div className={("code-preview " + className).trim()}>
      {label && <div className="code-preview-label">{label}</div>}
      <pre>{children}</pre>
    </div>
  );
}
