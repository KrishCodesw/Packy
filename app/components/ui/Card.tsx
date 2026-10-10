import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
};

export default function Card({
  children,
  className = "",
  header,
  footer,
}: CardProps) {
  return (
    <section className={("surface-card " + className).trim()}>
      {header && <div className="surface-card-header">{header}</div>}
      <div className="surface-card-body">{children}</div>
      {footer && <div className="surface-card-footer">{footer}</div>}
    </section>
  );
}
