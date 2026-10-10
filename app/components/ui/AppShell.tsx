import type { ReactNode } from "react";
import Link from "next/link";
import Brand from "./Brand";
import Icon from "./Icon";

type AppSection = "builder" | "marketplace";

type AppShellProps = {
  activeSection: AppSection;
  sectionLabel: string;
  children: ReactNode;
};

export default function AppShell({
  activeSection,
  sectionLabel,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-brand"><Brand /></div>

                <nav className="sidebar-nav" aria-label="Main navigation">
          <Link
            href="/"
            className={"nav-link " + (activeSection === "builder" ? "active" : "")}
            aria-current={activeSection === "builder" ? "page" : undefined}
          >
            <span className="nav-icon"><Icon name="package" size={18} /></span>
            <span>Create</span>
            {activeSection === "builder" && <span className="nav-current-dot" />}
          </Link>
          <Link
            href="/marketplace"
            className={"nav-link " + (activeSection === "marketplace" ? "active" : "")}
            aria-current={activeSection === "marketplace" ? "page" : undefined}
          >
            <span className="nav-icon"><Icon name="layers" size={18} /></span>
            <span>Library</span>
          </Link>
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-bottom-note"><span className="sidebar-bottom-dot" /> Windows x64</div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-mobile-brand"><Brand /></div>
          <div className="breadcrumbs">
            <span className="breadcrumb-root">PACKY</span><span className="breadcrumb-slash">/</span><span className="breadcrumb-current">{sectionLabel}</span>
          </div>
          <div className="topbar-right">
            <a
              className="topbar-icon-link"
              href="https://github.com/KrishCodesw/Packy"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Packy on GitHub"
              title="Open GitHub repository"
            >
              <Icon name="arrow-up-right" size={17} />
            </a>
          </div>
        </header>

        <main className="page-content">{children}</main>

        <footer className="app-footer">
          <span>Packy <span className="footer-separator">/</span> Harness Studio</span>
          <span>Windows x64 packages</span>
        </footer>
      </div>
    </div>
  );
}
