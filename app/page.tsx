"use client";

import { useMemo, useState } from "react";
import type { HarnessInput, TargetPlatform } from "../lib/harness";
import AppShell from "./components/ui/AppShell";
import Button from "./components/ui/Button";
import Checkbox from "./components/ui/Checkbox";
import Icon, { type IconName } from "./components/ui/Icon";
import Input from "./components/ui/Input";
import Preview from "./components/ui/Preview";
import Select from "./components/ui/Select";
import StepsIndicator, { type StepItem } from "./components/ui/StepsIndicator";
import Textarea from "./components/ui/Textarea";

const purposeOptions = [
  { label: "Everyday assistant", name: "My personal assistant", description: "Help me plan my day, organize information, think through decisions, and turn ideas into clear next steps.", icon: "sparkles" as IconName },
  { label: "Writing & ideas", name: "Writing companion", description: "Help me develop ideas, write clearly, improve drafts, and adapt my writing for different audiences.", icon: "file-text" as IconName },
  { label: "Research & learning", name: "Research companion", description: "Help me explore topics, explain unfamiliar ideas, compare information, and summarize what matters.", icon: "book-open" as IconName },
  { label: "Work & planning", name: "Work organizer", description: "Help me break projects into manageable tasks, organize notes, prepare plans, and keep track of priorities.", icon: "layers" as IconName },
  { label: "Coding & technical work", name: "Coding assistant", description: "Help me understand code, investigate issues, make careful changes, and explain technical decisions.", icon: "terminal" as IconName },
];

const steps: StepItem[] = [
  { label: "Identity", description: "Name & purpose" },
  { label: "Runtime", description: "Model & platform" },
  { label: "Tools", description: "Agent capabilities" },
  { label: "Behavior", description: "Rules & skills" },
  { label: "Review", description: "Build package" },
];

const toolOptions: Array<{
  value: string;
  label: string;
  description: string;
  icon: IconName;
}> = [
  { value: "read", label: "Read files", description: "Inspect project files", icon: "file-text" },
  { value: "write", label: "Write files", description: "Create new files", icon: "file-check" },
  { value: "edit", label: "Edit files", description: "Apply focused changes", icon: "wrench" },
  { value: "bash", label: "Terminal", description: "Run shell commands", icon: "terminal" },
  { value: "grep", label: "Search content", description: "Find text across files", icon: "search" },
  { value: "find", label: "Find paths", description: "Locate files and folders", icon: "folder" },
  { value: "ls", label: "List files", description: "Inspect directory contents", icon: "layers" },
];

const mcpOptions: Array<{
  value: string;
  label: string;
  description: string;
  icon: IconName;
}> = [
  { value: "github", label: "GitHub", description: "Repository and pull-request tools", icon: "git-branch" },
  { value: "postgres", label: "PostgreSQL", description: "Database connectivity", icon: "command" },
  { value: "filesystem", label: "Filesystem", description: "Local resource access", icon: "folder" },
  { value: "browser", label: "Browser", description: "Web automation tools", icon: "globe" },
];

const initialSkills = [
  {
    name: "Clear Communication",
    description: "Explain ideas clearly, adapt detail to the task, and organize answers so they are easy to use.",
  },
  {
    name: "Planning & Problem Solving",
    description: "Break complex requests into manageable steps, state assumptions, and suggest practical next actions.",
  },
];

type Notice = {
  kind: "success" | "error" | "info";
  message: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-agent";
}

export default function Home() {
  const [name, setName] = useState("My personal assistant");
  const [description, setDescription] = useState("Help me plan my day, organize information, think through decisions, and turn ideas into clear next steps.");
  const [selectedPurpose, setSelectedPurpose] = useState("Everyday assistant");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [model, setModel] = useState("anthropic/claude-sonnet-4");
  const [thinking, setThinking] = useState("medium");
  const [tools, setTools] = useState(["read", "grep", "find", "ls"]);
  const [mcps, setMcps] = useState(["github"]);
  const [targetPlatform] = useState<TargetPlatform>("windows-x64");
  const [rules, setRules] = useState(
    "Never expose secrets.\nAsk before destructive operations.\nPrefer small, verifiable changes.",
  );
  const [skills, setSkills] = useState(initialSkills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [promptName, setPromptName] = useState("help");
  const [promptBody, setPromptBody] = useState(
    "Help me with the task I describe. Ask clarifying questions when needed, explain ideas clearly, and provide a practical, well-organized answer.",
  );
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    [name, description, model, thinking, tools, mcps, targetPlatform, skills, rules, promptName, promptBody],
  );

  const toggle = (items: string[], value: string, setItems: (next: string[]) => void) => {
    setItems(items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  };

  function goToStep(nextStep: number) {
    setNotice(null);
    setStep(Math.max(0, Math.min(steps.length - 1, nextStep)));
  }

  function continueStep() {
    if (step === 0 && !name.trim()) {
      setNotice({ kind: "error", message: "Give this agent a name before continuing." });
      return;
    }
    if (step === 1 && !model.trim()) {
      setNotice({ kind: "error", message: "Enter the model identifier Packy should configure." });
      return;
    }
    if (step === 3 && (!promptName.trim() || !promptBody.trim())) {
      setNotice({ kind: "error", message: "Add a prompt command name and its instructions." });
      return;
    }
    setNotice(null);
    goToStep(step + 1);
  }

  function addSkill() {
    const skillName = newSkillName.trim();
    const skillDescription = newSkillDescription.trim();

    if (!skillName || !skillDescription) {
      setNotice({ kind: "error", message: "Add both a skill name and a short description." });
      return;
    }
    if (skills.some((skill) => skill.name.toLowerCase() === skillName.toLowerCase())) {
      setNotice({ kind: "error", message: "A skill with that name already exists." });
      return;
    }

    setSkills((current) => [...current, { name: skillName, description: skillDescription }]);
    setNewSkillName("");
    setNewSkillDescription("");
    setNotice({ kind: "success", message: "Skill added to this package configuration." });
  }

  function updateSkill(index: number, field: "name" | "description", value: string) {
    setSkills((current) =>
      current.map((skill, currentIndex) =>
        currentIndex === index ? { ...skill, [field]: value } : skill,
      ),
    );
  }

  function removeSkill(index: number) {
    setSkills((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setNotice({ kind: "info", message: "Skill removed from this package configuration." });
  }

  async function generate() {
    if (!name.trim() || !model.trim() || !promptName.trim() || !promptBody.trim()) {
      setNotice({ kind: "error", message: "Complete the agent name, model, and prompt before building." });
      return;
    }

    setIsGenerating(true);
    setNotice({ kind: "info", message: "Building your Windows x64 package…" });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload && typeof payload.error === "string"
            ? payload.error
            : "The package could not be generated. Please try again.";
        throw new Error(message);
      }

      const expectedLengthHeader = response.headers.get("Content-Length");
      const expectedLength = expectedLengthHeader ? Number(expectedLengthHeader) : null;
      if (expectedLengthHeader && (!Number.isSafeInteger(expectedLength) || expectedLength! <= 0)) {
        throw new Error("The server returned an invalid package size.");
      }
      if (!response.body) {
        throw new Error("Your browser could not read the package stream. Please try again.");
      }

      // Read the response in chunks. Verify the full byte count before allowing a download.
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            receivedLength += value.byteLength;
            if (expectedLength !== null && receivedLength > expectedLength) {
              throw new Error("The package stream exceeded its declared size. No file was downloaded.");
            }
          }
        }
      } catch (error) {
        await reader.cancel().catch(() => undefined);
        throw error;
      }

      if (receivedLength === 0) {
        throw new Error("The generation endpoint returned an empty package.");
      }
      if (expectedLength !== null && receivedLength !== expectedLength) {
        throw new Error(`The download was incomplete (${receivedLength} of ${expectedLength} bytes). Please try again.`);
      }

      // ZIP files start with PK and end with an end-of-central-directory record.
      const firstChunk = chunks[0];
      if (!firstChunk || firstChunk.length < 4 || firstChunk[0] !== 0x50 || firstChunk[1] !== 0x4b) {
        throw new Error("The server response is not a valid ZIP file. Please try again.");
      }
      const tailLength = Math.min(receivedLength, 65_557);
      const tail = new Uint8Array(tailLength);
      let tailOffset = 0;
      let bytesToSkip = receivedLength - tailLength;
      for (const chunk of chunks) {
        if (bytesToSkip >= chunk.length) {
          bytesToSkip -= chunk.length;
          continue;
        }
        const start = bytesToSkip;
        bytesToSkip = 0;
        const count = Math.min(chunk.length - start, tailLength - tailOffset);
        tail.set(chunk.subarray(start, start + count), tailOffset);
        tailOffset += count;
        if (tailOffset === tailLength) break;
      }
      let hasEndRecord = false;
      for (let i = tail.length - 22; i >= Math.max(0, tail.length - 65_557); i--) {
        if (tail[i] === 0x50 && tail[i + 1] === 0x4b && tail[i + 2] === 0x05 && tail[i + 3] === 0x06) {
          hasEndRecord = true;
          break;
        }
      }
      if (!hasEndRecord) {
        throw new Error("The ZIP file is incomplete or damaged. Please try again.");
      }

      // Copy each chunk into an ArrayBuffer. This avoids TypeScript's
      // ArrayBufferLike/SharedArrayBuffer mismatch in newer TypeScript versions.
      const blobParts: BlobPart[] = chunks.map((chunk) => {
        const copy = new Uint8Array(chunk.byteLength);
        copy.set(chunk);
        return copy.buffer;
      });
      const blob = new Blob(blobParts, { type: "application/zip" });
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] || slugify(name) + ".zip";
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1500);

      setNotice({
        kind: "success",
        message: "Package downloaded. Extract the ZIP and run install.cmd on Windows.",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message: error instanceof Error ? error.message : "Package generation failed.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const packageSlug = slugify(name);
  const platformName = "Windows x64";
  const activeToolCount = tools.length;
  const activeMcpCount = mcps.length;

  return (
    <AppShell activeSection="builder" sectionLabel="Build agent">
      <div className="page-heading">
        <div className="page-heading-copy">
          <div className="eyebrow"><span className="eyebrow-marker" /> YOUR PERSONAL HELPER</div>
          <h1>Make a helper that feels like yours.</h1>
          <p>Tell Packy what you need. It takes care of preparing the setup, so you can focus on what you want help with.</p>
        </div>
        <div className="page-heading-meta">
          <span className="status-label"><span className="status-dot" /> BUILDER READY</span>
          <span className="meta-divider" />
          <span className="meta-version">Pi v1.0.4</span>
        </div>
      </div>

      {!showAdvanced && (
        <section className="welcome-builder" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <span className="welcome-eyebrow">A GOOD PLACE TO START</span>
            <h2 id="welcome-title">What would you like a helper to do for you?</h2>
            <p>Choose a starting point, give your helper a name, and Packy will prepare a ready-to-install package. You can fine-tune the details later.</p>
          </div>

          <div className="purpose-grid" role="group" aria-label="Choose what your helper will do">
            {purposeOptions.map((purpose) => (
              <button
                className={"purpose-card " + (selectedPurpose === purpose.label ? "selected" : "")}
                type="button"
                key={purpose.label}
                onClick={() => {
                  setSelectedPurpose(purpose.label);
                  setName(purpose.name);
                  setDescription(purpose.description);
                  setNotice(null);
                }}
                aria-pressed={selectedPurpose === purpose.label}
              >
                <span className="purpose-card-icon"><Icon name={purpose.icon} size={19} /></span>
                <span className="purpose-card-label">{purpose.label}</span>
                <span className="purpose-card-check"><Icon name="check" size={14} /></span>
              </button>
            ))}
          </div>

          <div className="welcome-form">
            <Input
              label="Give your helper a name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. My study companion"
              required
              maxLength={80}
            />
            <Textarea
              label="What should it help you with? Use your own words."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tell Packy what you want your helper to do."
              rows={3}
              required
              maxLength={500}
              helperText="You do not need to know anything about models, tools, or configuration."
            />
          </div>

          <div className="welcome-footer">
            <div className="platform-assurance">
              <span className="platform-assurance-icon"><Icon name="monitor" size={16} /></span>
              <span><strong>For Windows</strong><small>Download a ZIP and run the included installer.</small></span>
            </div>
            <Button onClick={generate} loading={isGenerating} disabled={isGenerating}>
              <Icon name="package" size={16} /> Create my helper
            </Button>
          </div>

          {notice && (
            <div className={"notice notice-" + notice.kind} role={notice.kind === "error" ? "alert" : "status"} aria-live="polite">
              <Icon name={notice.kind === "success" ? "circle-check" : notice.kind === "error" ? "alert-circle" : "info"} size={17} />
              <p>{notice.message}</p>
              {notice.kind === "error" && <button type="button" className="notice-dismiss" onClick={() => setNotice(null)} aria-label="Dismiss message"><Icon name="x" size={14} /></button>}
            </div>
          )}

          <button className="advanced-settings-link" type="button" onClick={() => { setShowAdvanced(true); setStep(0); }}>
            <Icon name="sliders" size={15} /> I want to customize the setup <Icon name="arrow-right" size={14} />
          </button>
        </section>
      )}

      {showAdvanced && <div className="builder-layout">
        <section className="builder-column" aria-label="Agent configuration">
          <div className="builder-toolbar">
            <div>
              <span className="toolbar-kicker">CUSTOMIZE</span>
              <span className="toolbar-title">Make it your own</span>
            </div>
            <span className="toolbar-progress">STEP {String(step + 1).padStart(2, "0")} <span>/</span> 05</span>
          </div>

          <StepsIndicator steps={steps} currentStep={step} onChange={goToStep} />

          <div className="step-panel" key={step}>
            {step === 0 && (
              <>
                <div className="section-heading">
                  <span className="section-index">01</span>
                  <div>
                    <h2>Give it an identity</h2>
                    <p>A useful name and a clear purpose make packages easier to share.</p>
                  </div>
                </div>

                <div className="form-stack">
                  <Input
                    label="Agent name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Security Reviewer"
                    helperText="This becomes the name shown in your package metadata."
                    required
                    maxLength={80}
                  />
                  <Textarea
                    label="What should this agent do?"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the agent's purpose, the work it handles, and where it should focus."
                    rows={4}
                    required
                    maxLength={500}
                    helperText="Keep it specific. This description is included in the generated system instructions."
                  />
                  <div className="slug-preview">
                    <span className="slug-preview-icon"><Icon name="package" size={16} /></span>
                    <span className="slug-preview-label">PACKAGE FILENAME</span>
                    <code>{packageSlug}.zip</code>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="section-heading">
                  <span className="section-index">02</span>
                  <div>
                    <h2>Choose the runtime setup</h2>
                    <p>Set the model defaults and select a platform that Packy can currently build.</p>
                  </div>
                </div>

                <div className="form-stack">
                  <Input
                    label="Model identifier"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    placeholder="provider/model-name"
                    required
                    helperText="Use the model identifier format supported by Pi, for example anthropic/claude-sonnet-4."
                  />

                  <div className="two-column-fields">
                    <Select
                      label="Thinking level"
                      value={thinking}
                      onChange={(event) => setThinking(event.target.value)}
                      options={[
                        { value: "minimal", label: "Minimal" },
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ]}
                      helperText="Default reasoning effort."
                    />
                    <div className="field">
                      <label className="field-label">Pi runtime</label>
                      <div className="read-only-field">
                        <span className="read-only-icon"><Icon name="cpu" size={16} /></span>
                        <span>Pi v1.0.4</span>
                        <span className="read-only-lock"><Icon name="lock" size={13} /></span>
                      </div>
                      <p className="field-helper">Bundled unchanged.</p>
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label">Target platform <span className="required-mark">*</span></label>
                    <div className="platform-card selected">
                      <span className="platform-glyph"><Icon name="monitor" size={20} /></span>
                      <span className="platform-copy">
                        <strong>Windows x64</strong>
                        <span>Installer included · Ready to build</span>
                      </span>
                      <span className="platform-selected"><Icon name="check" size={13} /> Available</span>
                    </div>
                    <div className="platform-unavailable">
                      <Icon name="clock" size={15} />
                      <span>macOS and Linux builds will appear here when their packaging pipelines are implemented.</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="section-heading">
                  <span className="section-index">03</span>
                  <div>
                    <h2>Choose its capabilities</h2>
                    <p>Start with the built-in tools this agent should have available.</p>
                  </div>
                </div>

                <div className="field">
                  <div className="field-header">
                    <label className="field-label">BUILT-IN TOOLS</label>
                    <span className="selection-count">{activeToolCount} selected</span>
                  </div>
                  <div className="option-grid">
                    {toolOptions.map((tool) => (
                      <Checkbox
                        key={tool.value}
                        label={tool.label}
                        description={tool.description}
                        checked={tools.includes(tool.value)}
                        onChange={() => toggle(tools, tool.value, setTools)}
                        icon={<Icon name={tool.icon} size={17} />}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-divider" />

                <div className="field">
                  <div className="field-header">
                    <label className="field-label">MCP SERVER SELECTION</label>
                    <span className="preview-badge">PREVIEW ONLY</span>
                  </div>
                  <div className="option-grid option-grid-two">
                    {mcpOptions.map((mcp) => (
                      <Checkbox
                        key={mcp.value}
                        label={mcp.label}
                        description={mcp.description}
                        checked={mcps.includes(mcp.value)}
                        onChange={() => toggle(mcps, mcp.value, setMcps)}
                        icon={<Icon name={mcp.icon} size={17} />}
                      />
                    ))}
                  </div>
                  <div className="notice notice-warning">
                    <Icon name="info" size={16} />
                    <p>MCP choices currently generate placeholder entries, not live connections. Real endpoints and authentication are not implemented yet.</p>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="section-heading">
                  <span className="section-index">04</span>
                  <div>
                    <h2>Set its behavior</h2>
                    <p>Write operating rules, reusable skills, and a prompt command for the agent.</p>
                  </div>
                </div>

                <div className="form-stack">
                  <Textarea
                    label="Operating rules"
                    value={rules}
                    onChange={(event) => setRules(event.target.value)}
                    placeholder={"Never expose secrets.\nAsk before destructive operations.\nPrefer small, verifiable changes."}
                    rows={4}
                    helperText="One rule per line. These are written into SYSTEM.md."
                  />

                  <div className="form-divider" />

                  <div className="section-subheading">
                    <div>
                      <h3>Skills</h3>
                      <p>Give the agent reusable instructions for specific tasks.</p>
                    </div>
                    <span className="selection-count">{skills.length} {skills.length === 1 ? "skill" : "skills"}</span>
                  </div>

                  {skills.length > 0 ? (
                    <div className="skill-list">
                      {skills.map((skill, index) => (
                        <div className="skill-editor" key={index}>
                          <div className="skill-editor-top">
                            <span className="skill-file-icon"><Icon name="file-text" size={16} /></span>
                            <span className="skill-file-label">SKILL.md</span>
                            <button
                              type="button"
                              className="icon-button subtle-danger"
                              onClick={() => removeSkill(index)}
                              aria-label={"Remove " + skill.name}
                              title="Remove skill"
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                          <div className="skill-editor-fields">
                            <Input
                              label="Skill name"
                              value={skill.name}
                              onChange={(event) => updateSkill(index, "name", event.target.value)}
                              required
                            />
                            <Input
                              label="Description"
                              value={skill.description}
                              onChange={(event) => updateSkill(index, "description", event.target.value)}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-skills">
                      <Icon name="layers" size={20} />
                      <span>No skills added. You can still build a package without custom skills.</span>
                    </div>
                  )}

                  <div className="add-skill-card">
                    <div className="add-skill-title"><Icon name="plus" size={16} /> Add a skill</div>
                    <div className="skill-editor-fields">
                      <Input
                        label="Skill name"
                        value={newSkillName}
                        onChange={(event) => setNewSkillName(event.target.value)}
                        placeholder="e.g. Security Review"
                      />
                      <Input
                        label="Short description"
                        value={newSkillDescription}
                        onChange={(event) => setNewSkillDescription(event.target.value)}
                        placeholder="What should the skill guide?"
                      />
                    </div>
                    <div className="add-skill-action">
                      <Button variant="secondary" size="sm" onClick={addSkill}>
                        <Icon name="plus" size={14} /> Add skill
                      </Button>
                    </div>
                  </div>

                  <div className="form-divider" />

                  <div className="section-subheading">
                    <div>
                      <h3>Prompt command</h3>
                      <p>A named instruction the user can invoke in Pi.</p>
                    </div>
                  </div>
                  <Input
                    label="Command name"
                    value={promptName}
                    onChange={(event) => setPromptName(event.target.value)}
                    placeholder="review"
                    required
                  />
                  <Textarea
                    label="Prompt instructions"
                    value={promptBody}
                    onChange={(event) => setPromptBody(event.target.value)}
                    placeholder="Describe the steps and output expected from this command."
                    rows={4}
                    required
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="section-heading">
                  <span className="section-index">05</span>
                  <div>
                    <h2>Review your package</h2>
                    <p>Check the generated configuration before creating the downloadable ZIP.</p>
                  </div>
                </div>

                <div className="review-summary-banner">
                  <span className="review-check"><Icon name="check" size={18} /></span>
                  <div>
                    <strong>Configuration ready for build</strong>
                    <p>Packy will assemble the runtime and selected resources into one package.</p>
                  </div>
                  <span className="platform-tag"><Icon name="monitor" size={13} /> {platformName}</span>
                </div>

                <div className="review-table">
                  <div className="review-row">
                    <span>Package name</span>
                    <strong>{name || "Untitled agent"}</strong>
                  </div>
                  <div className="review-row">
                    <span>Model</span>
                    <strong>{model || "Not configured"}</strong>
                  </div>
                  <div className="review-row">
                    <span>Thinking level</span>
                    <strong className="value-capitalize">{thinking}</strong>
                  </div>
                  <div className="review-row">
                    <span>Built-in tools</span>
                    <strong>{tools.length} selected</strong>
                  </div>
                  <div className="review-row">
                    <span>Skills</span>
                    <strong>{skills.length} included</strong>
                  </div>
                  <div className="review-row">
                    <span>MCP entries</span>
                    <strong>{mcps.length} placeholder {mcps.length === 1 ? "entry" : "entries"}</strong>
                  </div>
                  <div className="review-row">
                    <span>Prompt commands</span>
                    <strong>{promptName.trim() ? "1 configured" : "None"}</strong>
                  </div>
                </div>

                <Preview label="PACKAGE CONTENTS">
                  {packageSlug + ".zip"}{"\n"}
                  {"├── install.cmd\n"}
                  {"├── README.md\n"}
                  {"├── harness.json\n"}
                  {"├── runtimes/windows-x64/\n"}
                  {"└── agent/\n"}
                  {"    ├── settings.json\n"}
                  {"    ├── mcp.json\n"}
                  {"    ├── SYSTEM.md\n"}
                  {"    ├── skills/\n"}
                  {"    └── prompts/"}
                </Preview>

                {mcps.length > 0 && (
                  <div className="notice notice-warning review-warning">
                    <Icon name="info" size={16} />
                    <p>MCP entries use placeholder URLs in this version. Unselect them if you do not want placeholder definitions in the package.</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="builder-actions">
            <Button
              variant="secondary"
              onClick={() => goToStep(step - 1)}
              disabled={step === 0 || isGenerating}
            >
              <Icon name="arrow-left" size={15} /> Back
            </Button>
            <div className="action-middle">
              <span className="action-step">{String(step + 1).padStart(2, "0")} / 05</span>
              <span className="action-step-track"><span style={{ width: ((step + 1) / steps.length * 100) + "%" }} /></span>
            </div>
            {step < steps.length - 1 ? (
              <Button onClick={continueStep} disabled={isGenerating}>
                Continue <Icon name="arrow-right" size={15} />
              </Button>
            ) : (
              <Button onClick={generate} loading={isGenerating} disabled={isGenerating}>
                <Icon name="download" size={15} /> Build & download
              </Button>
            )}
          </div>

          {notice && (
            <div className={"notice notice-" + notice.kind} role={notice.kind === "error" ? "alert" : "status"} aria-live="polite">
              <Icon
                name={notice.kind === "success" ? "circle-check" : notice.kind === "error" ? "alert-circle" : "info"}
                size={17}
              />
              <p>{notice.message}</p>
              {notice.kind === "error" && (
                <button type="button" className="notice-dismiss" onClick={() => setNotice(null)} aria-label="Dismiss message">
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
          )}
        </section>

        <aside className="inspector-column" aria-label="Live package preview">
          <div className="inspector-card">
            <div className="inspector-header">
              <div>
                <span className="toolbar-kicker">LIVE INSPECTOR</span>
                <h2>Package preview</h2>
              </div>
              <span className="inspector-live"><span /> LIVE</span>
            </div>

            <div className="package-identity">
              <div className="package-avatar"><Icon name="package" size={22} /></div>
              <div className="package-identity-copy">
                <strong>{name.trim() || "Untitled agent"}</strong>
                <span>{packageSlug}.zip</span>
              </div>
            </div>

            <div className="inspector-details">
              <div className="inspector-detail-row">
                <span>Runtime</span>
                <strong>Pi <span className="inline-muted">1.0.4</span></strong>
              </div>
              <div className="inspector-detail-row">
                <span>Target</span>
                <strong><Icon name="monitor" size={14} /> Windows x64</strong>
              </div>
              <div className="inspector-detail-row">
                <span>Model</span>
                <strong className="inspector-model">{model || "Not set"}</strong>
              </div>
              <div className="inspector-detail-row">
                <span>Thinking</span>
                <strong className="value-capitalize">{thinking}</strong>
              </div>
            </div>

            <div className="inspector-divider" />

            <div className="inspector-section-title">
              <span>CONTENTS</span>
              <span className="contents-count">6 + resources</span>
            </div>
            <div className="package-tree">
              <div className="tree-line">
                <Icon name="folder" size={16} />
                <span>agent/</span>
                <span className="tree-meta">{activeToolCount} tools</span>
              </div>
              <div className="tree-child">
                <div><Icon name="file-text" size={14} /><span>settings.json</span></div>
                <div><Icon name="file-text" size={14} /><span>SYSTEM.md</span></div>
                <div><Icon name="file-text" size={14} /><span>mcp.json</span>{mcps.length > 0 && <span className="tree-warning">stub</span>}</div>
                <div><Icon name="folder" size={14} /><span>skills/</span><span className="tree-meta">{skills.length}</span></div>
                <div><Icon name="folder" size={14} /><span>prompts/</span><span className="tree-meta">1</span></div>
              </div>
              <div className="tree-line">
                <Icon name="folder" size={16} />
                <span>runtimes/windows-x64/</span>
                <span className="tree-meta">Pi</span>
              </div>
              <div className="tree-line">
                <Icon name="file-text" size={16} />
                <span>harness.json</span>
              </div>
              <div className="tree-line">
                <Icon name="terminal" size={16} />
                <span>install.cmd</span>
              </div>
            </div>

            <div className="inspector-divider" />

            <div className="inspector-section-title"><span>CAPABILITIES</span></div>
            <div className="capability-pills">
              <span><Icon name="wrench" size={13} /> {activeToolCount} tools</span>
              <span><Icon name="layers" size={13} /> {skills.length} skills</span>
              <span><Icon name="plug" size={13} /> {activeMcpCount} MCP</span>
            </div>
            <div className="inspector-note">
              <Icon name="shield-check" size={16} />
              <p>Pi core stays unchanged. Packy keeps configuration and resources alongside the bundled runtime.</p>
            </div>
          </div>

          <div className="support-note">
            <span className="support-note-icon"><Icon name="info" size={15} /></span>
            <p><strong>Still in preview</strong> — provider credentials are configured separately, and MCP connections are not wired up yet.</p>
          </div>
        </aside>
      </div>}
    </AppShell>
  );
}
