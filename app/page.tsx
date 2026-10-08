"use client";

import { useMemo, useState } from "react";

import type { HarnessInput, TargetPlatform } from "../lib/harness";

const toolOptions = ["read", "write", "edit", "bash", "grep", "find", "ls"];

const mcpOptions = ["github", "postgres", "filesystem", "browser"];

const defaultSkills = [ 
  {
    name: "Code Review",
    description:
      "Review code for correctness, maintainability, and common security issues.",
  },
  {
    name: "Git Workflow",
    description:
      "Use disciplined Git workflows for branches, commits, and pull requests.",
  },
];

export default function Home() {
  const [name, setName] = useState("My Engineering Agent");
  const [description, setDescription] = useState(
    "A focused coding agent configured for my workflow.",
  );
  const [model, setModel] = useState("anthropic/claude-sonnet-4");
  const [thinking, setThinking] = useState("medium");
  const [tools, setTools] = useState(["read", "grep", "find", "ls"]);
  const [mcps, setMcps] = useState(["github"]);
  const [targetPlatform, setTargetPlatform] =
    useState<TargetPlatform>("windows-x64");
  const [rules, setRules] = useState(
    "Never expose secrets.\nAsk before destructive operations.\nPrefer small, verifiable changes.",
  );
  const [skills, setSkills] = useState(defaultSkills);
  const [promptName, setPromptName] = useState("review");
  const [promptBody, setPromptBody] = useState(
    "Review the current changes and report correctness, risks, and missing tests.",
  );
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");

  const input: HarnessInput = useMemo(
    () => ({
      name,
      description,
      model,
      thinking,
      tools,
      mcp: mcps,
      targetPlatform,
      skills,
      rules,
      prompts: [
        {
          name: promptName,
          description: "Review the current changes",
          body: promptBody,
        },
      ],
    }),
    [
      name,
      description,
      model,
      thinking,
      tools,
      mcps,
      targetPlatform,
      skills,
      rules,
      promptName,
      promptBody,
    ],
  );

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  async function generate() {
    try {
      setStatus("Generating...");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Generation failed");
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "harness.zip";

      const match = contentDisposition?.match(/filename="([^"]+)"/);
      if (match?.[1]) {
        filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(url);

      setStatus(
        "Harness generated. Run install.cmd on Windows or install.sh on macOS.",
      );
    } catch (error) {
      console.error("Generation failed:", error);
      setStatus(error instanceof Error ? error.message : "Generation failed");
    }
  }

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">Harness Builder</div>

        <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
          Compose a purpose-built Pi harness before installation.
        </div>

        <div className="steps">
          {["Identity", "Runtime", "Capabilities", "Behavior", "Review"].map(
            (x, i) => (
              <div
                key={x}
                className={`step ${i === step ? "active" : ""} ${
                  i < step ? "done" : ""
                }`}
              >
                {String(i + 1).padStart(2, "0")} &nbsp; {x}
              </div>
            ),
          )}
        </div>

        <div style={{ marginTop: "auto" }} className="muted">
          <span className="pill">Pi runtime · immutable</span>
        </div>
      </aside>

      <main className="main">
        <div className="top">
          <div>
            <div className="eyebrow">Harness / New</div>

            <h1 className="title">Build your agent.</h1>

            <p className="desc">
              Define the parts Pi should load. Harness Builder turns the
              specification into a portable Pi configuration and resource
              package.
            </p>
          </div>

          <span className="pill">MVP</span>
        </div>

        {step === 0 && (
          <section className="grid">
            <div className="card">
              <h2>Agent identity</h2>

              <div className="field">
                <label className="label">NAME</label>

                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">DESCRIPTION</label>

                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="card">
              <h2>Output</h2>

              <div className="preview">
                {name || "Unnamed harness"}
                {"\n\n"}
                Pi runtime: immutable
                {"\n"}
                Config: generated
                {"\n"}
                Skills: generated
                {"\n"}
                Prompts: generated
                {"\n"}
                MCP: generated
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="grid">
            <div className="card">
              <h2>Runtime</h2>

              <div className="field">
                <label className="label">MODEL</label>

                <input
                  className="input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">TARGET PLATFORM</label>

                <select
                  className="select"
                  value={targetPlatform}
                  onChange={(e) =>
                    setTargetPlatform(e.target.value as TargetPlatform)
                  }
                >
                  <option value="windows-x64">Windows x64</option>
                  <option value="macos-arm64">macOS Apple Silicon</option>
                  <option value="macos-x64">macOS Intel</option>
                </select>
              </div>

              <div className="field">
                <label className="label">THINKING LEVEL</label>

                <select
                  className="select"
                  value={thinking}
                  onChange={(e) => setThinking(e.target.value)}
                >
                  <option>minimal</option>
                  <option>low</option>
                  <option>medium</option>
                  <option>high</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h2>Generated</h2>

              <div className="preview">
                settings.json
                {"\n\n"}
                {JSON.stringify(
                  {
                    defaultModel: model,
                    defaultThinkingLevel: thinking,
                  },
                  null,
                  2,
                )}
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="grid">
            <div className="card">
              <h2>Built-in tools</h2>

              <div className="checks">
                {toolOptions.map((x) => (
                  <label className="check" key={x}>
                    <input
                      type="checkbox"
                      checked={tools.includes(x)}
                      onChange={() => toggle(tools, x, setTools)}
                    />
                    {x}
                  </label>
                ))}
              </div>

              <h2 style={{ marginTop: 28 }}>MCP servers</h2>

              <div className="checks">
                {mcpOptions.map((x) => (
                  <label className="check" key={x}>
                    <input
                      type="checkbox"
                      checked={mcps.includes(x)}
                      onChange={() => toggle(mcps, x, setMcps)}
                    />
                    {x}
                  </label>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Capability summary</h2>

              <div className="reviewRow">
                <span>Tools</span>
                <b>{tools.length}</b>
              </div>

              <div className="reviewRow">
                <span>MCPs</span>
                <b>{mcps.length}</b>
              </div>

              <div className="reviewRow">
                <span>Custom extensions</span>
                <b>0</b>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="grid">
            <div className="card">
              <h2>Behavior</h2>

              <div className="field">
                <label className="label">SYSTEM RULES · ONE PER LINE</label>

                <textarea
                  className="textarea"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">PROMPT COMMAND</label>

                <input
                  className="input"
                  value={promptName}
                  onChange={(e) => setPromptName(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">PROMPT BODY</label>

                <textarea
                  className="textarea"
                  value={promptBody}
                  onChange={(e) => setPromptBody(e.target.value)}
                />
              </div>
            </div>

            <div className="card">
              <h2>Skills</h2>

              {skills.map((s) => (
                <div key={s.name} className="reviewRow">
                  <span>{s.name}</span>
                  <span className="muted">SKILL.md</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="grid">
            <div className="card">
              <h2>Ready to build</h2>

              <div className="review">
                <div className="reviewRow">
                  <span>Platform</span>

                  <b>
                    {targetPlatform === "windows-x64"
                      ? "Windows x64"
                      : targetPlatform === "macos-arm64"
                        ? "macOS Apple Silicon"
                        : "macOS Intel"}
                  </b>
                </div>

                <div className="reviewRow">
                  <span>Name</span>
                  <b>{name}</b>
                </div>

                <div className="reviewRow">
                  <span>Model</span>
                  <b>{model}</b>
                </div>

                <div className="reviewRow">
                  <span>Tools</span>
                  <b>{tools.join(", ") || "None"}</b>
                </div>

                <div className="reviewRow">
                  <span>MCP</span>
                  <b>{mcps.join(", ") || "None"}</b>
                </div>

                <div className="reviewRow">
                  <span>Skills</span>
                  <b>{skills.length}</b>
                </div>

                <div className="reviewRow">
                  <span>Prompt commands</span>
                  <b>1</b>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Package</h2>

              <div className="preview">
                settings.json
                {"\n"}
                mcp.json
                {"\n"}
                SYSTEM.md
                {"\n"}
                harness.json
                {"\n"}
                README.md
                {"\n"}
                skills/*/SKILL.md
                {"\n"}
                prompts/*.md
              </div>
            </div>
          </section>
        )}

        <div className="actions">
          <button
            className="btn"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>

          {step < 4 ? (
            <button className="btn primary" onClick={() => setStep(step + 1)}>
              Continue
            </button>
          ) : (
            <button className="btn primary" onClick={generate}>
              Build & Download
            </button>
          )}
        </div>

        {status && <div className="footerNote">{status}</div>}

        <div className="footerNote">
          The generated package uses Pi&apos;s existing resource mechanisms.
          Harness Builder does not modify Pi core.
        </div>
      </main>
    </div>
  );
}
