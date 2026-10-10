import Link from "next/link";
import AppShell from "./components/ui/AppShell";
import Icon from "./components/ui/Icon";

export default function NotFound() {
  return (
    <AppShell activeSection="builder" sectionLabel="Not found">
      <section className="not-found-panel">
        <span className="not-found-mark"><Icon name="package" size={23} /></span>
        <p className="not-found-code">ERROR 404 · PACKAGE NOT FOUND</p>
        <h1>This route doesn’t exist.</h1>
        <p>The page may have moved, or the link may be incorrect. Head back to the builder to continue packaging your agent environment.</p>
        <div className="not-found-actions">
          <Link className="btn btn-primary btn-md" href="/">Back to builder <Icon name="arrow-right" size={15} /></Link>
          <Link className="btn btn-secondary btn-md" href="/marketplace">Browse examples</Link>
        </div>
      </section>
    </AppShell>
  );
}
