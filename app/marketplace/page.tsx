"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "../components/ui/AppShell";
import Button from "../components/ui/Button";
import Icon, { type IconName } from "../components/ui/Icon";
import Input from "../components/ui/Input";

type ResourceCategory = "Skill" | "MCP server" | "Prompt";
type FilterCategory = "All resources" | ResourceCategory;

type Resource = {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  detail: string;
  icon: IconName;
  version: string;
  example: string;
  tags: string[];
};

const resources: Resource[] = [
  {
    id: "code-review",
    name: "Code review",
    category: "Skill",
    description: "A repeatable checklist for correctness, maintainability, and risky changes.",
    detail: "A lightweight skill scaffold for reviewing a diff. It asks the agent to explain important findings, distinguish bugs from suggestions, and mention missing tests.",
    icon: "file-check",
    version: "Example",
    example: "# Code review\n\n1. Read the full change before reviewing.\n2. Prioritize correctness and security.\n3. Cite the file and location for findings.\n4. Mention missing tests and uncertainty.",
    tags: ["Engineering", "Review"],
  },
  {
    id: "git-workflow",
    name: "Git workflow",
    category: "Skill",
    description: "Keep branches, commits, and pull requests small and easy to verify.",
    detail: "A skill scaffold for careful Git operations. It encourages checking repository state first, avoiding unrelated edits, and describing the final diff.",
    icon: "git-branch",
    version: "Example",
    example: "# Git workflow\n\n- Inspect status before editing.\n- Avoid destructive commands without approval.\n- Keep changes focused.\n- Summarize the final diff.",
    tags: ["Git", "Workflow"],
  },
  {
    id: "security-review",
    name: "Security review",
    category: "Skill",
    description: "Look for unsafe inputs, secret exposure, and risky execution paths.",
    detail: "A skill scaffold for security-minded code review. It prioritizes exploitable behaviour and data boundaries rather than speculative findings.",
    icon: "shield-check",
    version: "Example",
    example: "# Security review\n\n- Trace untrusted input to sensitive operations.\n- Check secret handling and authorization.\n- Explain exploitability and impact.\n- Do not claim a vulnerability without evidence.",
    tags: ["Security", "Code quality"],
  },
  {
    id: "github-mcp",
    name: "GitHub connector",
    category: "MCP server",
    description: "A placeholder entry representing repository and pull-request tooling.",
    detail: "This sample illustrates how a server connection could be represented in a package. Packy's current generator emits placeholder URLs for MCP selections; it does not configure a live GitHub MCP server.",
    icon: "git-branch",
    version: "Placeholder",
    example: "{\n  \"mcpServers\": {\n    \"github\": {\n      \"url\": \"https://example.invalid/github\"\n    }\n  }\n}",
    tags: ["GitHub", "MCP"],
  },
  {
    id: "postgres-mcp",
    name: "PostgreSQL connector",
    category: "MCP server",
    description: "A placeholder entry for database-aware agent workflows.",
    detail: "This sample represents a possible database connection in the future registry. Live endpoint definitions, authentication, and secret handling are not implemented in Packy yet.",
    icon: "command",
    version: "Placeholder",
    example: "{\n  \"mcpServers\": {\n    \"postgres\": {\n      \"url\": \"https://example.invalid/postgres\"\n    }\n  }\n}",
    tags: ["Database", "MCP"],
  },
  {
    id: "review-prompt",
    name: "Review changes",
    category: "Prompt",
    description: "Ask the agent to inspect a diff and report correctness risks and missing tests.",
    detail: "A concise prompt command designed to produce actionable review notes instead of a broad summary.",
    icon: "file-text",
    version: "Example",
    example: "Review the current changes.\n\nReport correctness issues, risks, and missing tests. Cite affected files and explain the impact of each finding.",
    tags: ["Prompt", "Code review"],
  },
  {
    id: "explain-code",
    name: "Explain code",
    category: "Prompt",
    description: "Explain a code path in plain language, following actual control flow.",
    detail: "A prompt command scaffold for understanding unfamiliar code. It should identify entry points, dependencies, state changes, and important edge cases.",
    icon: "book-open",
    version: "Example",
    example: "Explain the selected code path in plain language.\n\nStart at the entry point, trace important calls and state changes, and call out assumptions or edge cases.",
    tags: ["Prompt", "Learning"],
  },
];

const categories: FilterCategory[] = ["All resources", "Skill", "MCP server", "Prompt"];

function categoryIcon(category: ResourceCategory): IconName {
  if (category === "Skill") return "layers";
  if (category === "MCP server") return "plug";
  return "file-text";
}

function categoryLabel(category: FilterCategory) {
  if (category === "All resources") return "All resources";
  if (category === "MCP server") return "MCP servers";
  if (category === "Prompt") return "Prompts";
  return "Skills";
}

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All resources");
  const [search, setSearch] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    if (!selectedResource) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedResource(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedResource]);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = activeCategory === "All resources" || resource.category === activeCategory;
      const haystack = [
        resource.name,
        resource.description,
        resource.category,
        resource.tags.join(" "),
      ].join(" ").toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [activeCategory, search]);

  return (
    <AppShell activeSection="marketplace" sectionLabel="Resource library">
      <div className="page-heading library-heading">
        <div className="page-heading-copy">
          <div className="eyebrow"><span className="eyebrow-marker" /> REUSABLE BUILDING BLOCKS</div>
          <h1>Good agents are composed.</h1>
          <p>Explore examples of the skills, server connections, and prompt commands that could make up a Packy package.</p>
        </div>
        <div className="page-heading-meta">
          <span className="preview-status-label"><span className="preview-status-dot" /> CATALOG PREVIEW</span>
          <Link href="/" className="inline-link">Build an agent <Icon name="arrow-right" size={15} /></Link>
        </div>
      </div>

      <div className="catalog-note">
        <span className="catalog-note-icon"><Icon name="info" size={17} /></span>
        <div>
          <strong>Sample resources, not a live registry.</strong>
          <p>These entries demonstrate the future catalog experience. Publishing and one-click installation are not connected yet, and MCP examples are placeholders.</p>
        </div>
      </div>

      <section className="library-section" aria-label="Sample resource catalog">
        <div className="library-toolbar">
          <div className="library-tabs" role="tablist" aria-label="Filter resource category">
            {categories.map((category) => {
              const count = category === "All resources"
                ? resources.length
                : resources.filter((resource) => resource.category === category).length;
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={"library-tab " + (active ? "active" : "")}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabel(category)}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="library-search">
            <Icon name="search" size={17} />
            <Input
              label="Search resources"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search examples..."
              inputClassName="library-search-input"
            />
            {search && (
              <button className="search-clear" type="button" onClick={() => setSearch("")} aria-label="Clear search">
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="catalog-summary">
          <div>
            <span className="catalog-result-count">{filteredResources.length}</span>
            <span className="catalog-result-label">{filteredResources.length === 1 ? "sample resource" : "sample resources"}</span>
          </div>
          <span className="catalog-order"><Icon name="sliders" size={14} /> Curated examples</span>
        </div>

        {filteredResources.length > 0 ? (
          <div className="resource-grid">
            {filteredResources.map((resource, index) => (
              <article className="resource-card" key={resource.id} style={{ animationDelay: (index * 28) + "ms" }}>
                <div className="resource-card-top">
                  <span className={"resource-icon resource-icon-" + (resource.category === "Skill" ? "skill" : resource.category === "MCP server" ? "mcp" : "prompt")}>
                    <Icon name={resource.icon} size={19} />
                  </span>
                  <span className="resource-example-tag">EXAMPLE</span>
                </div>
                <div className="resource-card-body">
                  <div className="resource-kind">{resource.category}</div>
                  <h2>{resource.name}</h2>
                  <p>{resource.description}</p>
                </div>
                <div className="resource-tags">
                  {resource.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="resource-card-footer">
                  <span className="resource-author"><span className="author-mark">P</span> Packy examples</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedResource(resource)}>
                    Inspect <Icon name="arrow-up-right" size={14} />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <span className="catalog-empty-icon"><Icon name="search" size={20} /></span>
            <h2>No matching examples</h2>
            <p>Try another search term or switch to a different resource category.</p>
            <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setActiveCategory("All resources"); }}>
              Clear filters
            </Button>
          </div>
        )}
      </section>

      <div className="library-footer-note">
        <div className="library-footer-icon"><Icon name="layers" size={16} /></div>
        <div>
          <strong>Designed for composition</strong>
          <p>The long-term direction is to assemble agent packages from reusable, versioned resources rather than recreate each environment by hand.</p>
        </div>
      </div>

      {selectedResource && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setSelectedResource(null)}>
          <section
            className="resource-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dialog-header">
              <div className="dialog-title-group">
                <span className={"resource-icon resource-icon-" + (selectedResource.category === "Skill" ? "skill" : selectedResource.category === "MCP server" ? "mcp" : "prompt")}>
                  <Icon name={categoryIcon(selectedResource.category)} size={19} />
                </span>
                <div>
                  <div className="resource-kind">{selectedResource.category} <span>·</span> {selectedResource.version}</div>
                  <h2 id="resource-dialog-title">{selectedResource.name}</h2>
                </div>
              </div>
              <button className="icon-button" type="button" onClick={() => setSelectedResource(null)} aria-label="Close resource details">
                <Icon name="x" size={18} />
              </button>
            </div>
            <p className="dialog-description">{selectedResource.detail}</p>
            <div className="dialog-meta">
              {selectedResource.tags.map((tag) => <span key={tag}>{tag}</span>)}
              <span>Packy examples</span>
            </div>
            <div className="dialog-code-heading">
              <span><Icon name="file-text" size={15} /> EXAMPLE CONTENT</span>
              <span>Illustrative only</span>
            </div>
            <pre className="dialog-code">{selectedResource.example}</pre>
            <div className="notice notice-warning dialog-notice">
              <Icon name="info" size={16} />
              <p>This preview does not install the resource or publish it to a registry. Resource installation is not implemented yet.</p>
            </div>
            <div className="dialog-actions">
              <Button variant="secondary" onClick={() => setSelectedResource(null)}>Close preview</Button>
              <Link className="btn btn-primary btn-md" href="/" onClick={() => setSelectedResource(null)}>
                Open builder <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
