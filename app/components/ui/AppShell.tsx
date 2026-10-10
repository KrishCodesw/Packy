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

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <Link
            href="/"
            className={"nav-link " + (activeSection === "builder" ? "active" : "")}
            aria-current={activeSection === "builder" ? "page" : undefined}
          >
            <span className="nav-icon"><Icon name="package" size={18} /></span>
            <span>Build an agent</span>
            {activeSection === "builder" && <span className="nav-current-dot" />}
          </Link>
          <Link
            href="/marketplace"
            className={"nav-link " + (activeSection === "marketplace" ? "active" : "")}
            aria-current={activeSection === "marketplace" ? "page" : undefined}
          >
            <span className="nav-icon"><Icon name="layers" size={18} /></span>
            <span>Resource library</span>
            <span className="nav-soon">PREVIEW</span>
          </Link>
        </nav>

        <div className="sidebar-spacer" />

        <div className="runtime-card">
          <div className="runtime-card-top">
            <span className="runtime-mark"><Icon name="cpu" size={15} /></span>
            <span className="runtime-card-label">RUNTIME</span>
            <span className="runtime-status-dot" />
          </div>
          <div className="runtime-card-title">Pi 1.0.4</div>
          <p>Windows x64 package generation is available.</p>
          <div className="runtime-card-foot">
            <span>Other platforms</span>
            <span>In progress</span>
          </div>
        </div>

        <a
          className="sidebar-docs-link"
          href="https://github.com/KrishCodesw/Packy"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="book-open" size={16} />
          <span>Documentation</span>
          <Icon name="arrow-up-right" size={14} />
        </a>

        <div className="sidebar-version">
          <span className="version-dot" />
          <span>Packy early access</span>
          <span className="version-number">v0.1</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-mobile-brand"><Brand /></div>
          <div className="breadcrumbs">
            <span className="breadcrumb-root">PACKY</span>
            <Icon name="chevron-right" size={13} />
            <span className="breadcrumb-current">{sectionLabel}</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-runtime"><span className="topbar-runtime-dot" /> Pi runtime · v1.0.4</span>
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
          <span>Packy <span className="footer-separator">/</span> Your agent. Packaged.</span>
          <span>Pi stays unchanged. Your environment travels with the package.</span>
        </footer>
      </div>
    </div>
  );
}
