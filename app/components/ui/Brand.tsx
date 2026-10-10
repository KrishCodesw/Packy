import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="brand-link" aria-label="Packy home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M5.5 9.2 16 4.7l10.5 4.5L16 13.7 5.5 9.2Z" />
          <path d="M5.5 9.6v13.1L16 27.1l10.5-4.4V9.6" />
          <path d="M16 13.7v13.4M5.5 16.3 16 21l10.5-4.7" />
          <path className="brand-mark-accent" d="M24.7 4.9h3.6v3.6" />
        </svg>
      </span>
      <span className="brand-word">packy</span>
      <span className="brand-period">.</span>
    </Link>
  );
}
