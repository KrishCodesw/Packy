import type { ReactNode } from "react";

export type IconName =
  | "package"
  | "layers"
  | "book-open"
  | "external-link"
  | "check"
  | "arrow-right"
  | "arrow-left"
  | "file-text"
  | "cpu"
  | "shield-check"
  | "wrench"
  | "terminal"
  | "search"
  | "plug"
  | "command"
  | "plus"
  | "trash"
  | "x"
  | "chevron-down"
  | "chevron-right"
  | "alert-circle"
  | "info"
  | "sparkles"
  | "monitor"
  | "apple"
  | "download"
  | "folder"
  | "circle-check"
  | "clock"
  | "arrow-up-right"
  | "globe"
  | "settings"
  | "file-check"
  | "lock"
  | "git-branch"
  | "box"
  | "sliders"
  | "users"
  | "copy"
  | "book"
  | "dots"
  | "zap";

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
  className = "",
}: IconProps) {
  let content: ReactNode;

  switch (name) {
    case "package":
      content = <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v9M8 5.2l8 4.5" /></>;
      break;
    case "layers":
      content = <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>;
      break;
    case "book-open":
      content = <><path d="M12 7v14" /><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23V5.5ZM21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5A2.5 2.5 0 0 1 21 23V5.5Z" /></>;
      break;
    case "external-link":
    case "arrow-up-right":
      content = <><path d="M13 5h6v6" /><path d="m19 5-9 9" /><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>;
      break;
    case "check":
    case "circle-check":
      content = <>{name === "circle-check" && <circle cx="12" cy="12" r="9" />}<path d="m7 12.5 3.2 3.2L17.5 8" /></>;
      break;
    case "arrow-right":
      content = <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>;
      break;
    case "arrow-left":
      content = <><path d="M20 12H5" /><path d="m11 6-6 6 6 6" /></>;
      break;
    case "file-text":
      content = <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>;
      break;
    case "cpu":
      content = <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" /></>;
      break;
    case "shield-check":
      content = <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>;
      break;
    case "wrench":
      content = <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 13l-3-3 3.7-3.7Z" /></>;
      break;
    case "terminal":
      content = <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></>;
      break;
    case "search":
      content = <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>;
      break;
    case "plug":
      content = <><path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-5 5v5M5 7h14" /></>;
      break;
    case "command":
      content = <><path d="M9 7V5a2 2 0 1 0-2 2h10a2 2 0 1 0-2-2v14a2 2 0 1 0 2-2H7a2 2 0 1 0 2 2V7Z" /></>;
      break;
    case "plus":
      content = <><path d="M12 5v14M5 12h14" /></>;
      break;
    case "trash":
      content = <><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6" /></>;
      break;
    case "x":
      content = <><path d="m18 6-12 12M6 6l12 12" /></>;
      break;
    case "chevron-down":
      content = <path d="m6 9 6 6 6-6" />;
      break;
    case "chevron-right":
      content = <path d="m9 18 6-6-6-6" />;
      break;
    case "alert-circle":
      content = <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5h.01" /></>;
      break;
    case "info":
      content = <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>;
      break;
    case "sparkles":
      content = <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>;
      break;
    case "monitor":
      content = <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>;
      break;
    case "apple":
      content = <><path d="M16.7 12.4c0-2 1.6-3 1.7-3.1a4.1 4.1 0 0 0-3.2-1.7c-1.4-.1-2.7.8-3.4.8s-1.8-.8-3-.8a4.5 4.5 0 0 0-3.8 2.3c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 2.9 2.4 1.1 0 1.5-.8 2.9-.8s1.8.8 3 .8c1.2 0 2-.9 2.8-2.2a10 10 0 0 0 1.3-2.6 3.9 3.9 0 0 1-2.4-4.7ZM14.6 5.7a4 4 0 0 0 .9-3 4.3 4.3 0 0 0-2.8 1.5 3.8 3.8 0 0 0-.9 2.9 3.5 3.5 0 0 0 2.8-1.4Z" /></>;
      break;
    case "download":
      content = <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 17v3h14v-3" /></>;
      break;
    case "folder":
      content = <><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" /><path d="M3 9h18" /></>;
      break;
    case "clock":
      content = <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>;
      break;
    case "globe":
      content = <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>;
      break;
    case "settings":
    case "sliders":
      content = <><path d="M4 7h8M16 7h4M4 17h4M12 17h8" /><circle cx="14" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>;
      break;
    case "file-check":
      content = <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 15l2 2 5-5" /></>;
      break;
    case "lock":
      content = <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>;
      break;
    case "git-branch":
      content = <><circle cx="6" cy="4" r="2" /><circle cx="6" cy="20" r="2" /><circle cx="18" cy="16" r="2" /><path d="M6 6v12M18 14v-2a6 6 0 0 0-6-6H8" /></>;
      break;
    case "box":
      content = <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>;
      break;
    case "users":
      content = <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>;
      break;
    case "copy":
      content = <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>;
      break;
    case "book":
      content = <><path d="M5 4h12a2 2 0 0 1 2 2v15H7a2 2 0 0 1-2-2V4Z" /><path d="M5 4v15a2 2 0 0 1 2-2h12M9 8h6M9 12h6" /></>;
      break;
    case "dots":
      content = <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>;
      break;
    case "zap":
      content = <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" />;
      break;
    default:
      content = <><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" /><path d="m4 7 8 4 8-4M12 11v10" /></>;
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}
