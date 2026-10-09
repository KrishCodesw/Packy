const test = require("node:test");
const assert = require("node:assert/strict");

const { buildFiles } = require("../.test-dist/harness.js");

const baseInput = {
  name: "Security Reviewer",
  description: "Reviews code for common security issues.",
  model: "anthropic/claude-sonnet-4",
  thinking: "medium",
  tools: ["read", "grep", "find", "ls"],
  mcp: ["github"],
  skills: [
    {
      name: "Code Review",
      description: "Review code for correctness and maintainability.",
    },
  ],
  rules: "  Never expose secrets.  \n\n Ask before destructive operations. \n",
  prompts: [
    {
      name: "Review Changes",
      description: "Review the current changes.",
      body: "Inspect the diff and report risks.",
    },
  ],
  targetPlatform: "windows-x64",
};

function fileMap(input = baseInput) {
  return new Map(
    buildFiles(input).map((file) => [
      file.path,
      Buffer.isBuffer(file.content)
        ? file.content.toString("utf8")
        : file.content,
    ]),
  );
}

test("builds the expected package files", () => {
  const files = fileMap();

  assert.ok(files.has("harness.json"));
  assert.ok(files.has("agent/settings.json"));
  assert.ok(files.has("agent/mcp.json"));
  assert.ok(files.has("agent/SYSTEM.md"));
  assert.ok(files.has("agent/skills/code-review/SKILL.md"));
  assert.ok(files.has("agent/prompts/review-changes.md"));
});

test("writes model, thinking, tools, and resource globs to settings", () => {
  const files = fileMap();
  const settings = JSON.parse(files.get("agent/settings.json"));

  assert.equal(settings.defaultModel, baseInput.model);
  assert.equal(settings.defaultThinkingLevel, baseInput.thinking);
  assert.deepEqual(settings.defaultTools, baseInput.tools);
  assert.deepEqual(settings.resources.skills, ["skills/**/*"]);
  assert.deepEqual(settings.resources.prompts, ["prompts/**/*"]);
  assert.deepEqual(settings.resources.extensions, ["extensions/**/*"]);
});

test("marks configured MCPs with placeholder URLs rather than real endpoints", () => {
  const files = fileMap();
  const mcp = JSON.parse(files.get("agent/mcp.json"));

  assert.deepEqual(mcp.mcpServers, {
    github: { url: "https://example.invalid/github" },
  });
});

test("trims operating rules and omits blank lines", () => {
  const files = fileMap();
  const system = files.get("agent/SYSTEM.md");

  assert.match(system, /# Security Reviewer/);
  assert.match(system, /Reviews code for common security issues\./);
  assert.match(system, /- Never expose secrets\./);
  assert.match(system, /- Ask before destructive operations\./);
  assert.doesNotMatch(system, /-  Never expose secrets/);
  assert.doesNotMatch(system, /- \s*$/m);
});

test("creates skill frontmatter and content", () => {
  const files = fileMap();
  const skill = files.get("agent/skills/code-review/SKILL.md");

  assert.match(skill, /^---\nname: code-review\n/);
  assert.match(skill, /description: Review code for correctness and maintainability\./);
  assert.match(skill, /# Code Review/);
});

test("creates prompt files from prompt name, description, and body", () => {
  const files = fileMap();
  const prompt = files.get("agent/prompts/review-changes.md");

  assert.match(prompt, /^---\ndescription: Review the current changes\.\n---/);
  assert.match(prompt, /Inspect the diff and report risks\./);
});

test("writes package metadata and target platform", () => {
  const files = fileMap();
  const metadata = JSON.parse(files.get("harness.json"));

  assert.equal(metadata.version, 2);
  assert.equal(metadata.name, baseInput.name);
  assert.equal(metadata.generatedBy, "Harness Builder");
  assert.equal(metadata.pi.version, "1.0.4");
  assert.equal(metadata.pi.model, baseInput.model);
  assert.equal(metadata.pi.thinking, baseInput.thinking);
  assert.equal(metadata.targetPlatform, "windows-x64");
});

test("defaults the target platform to Windows x64 when it is omitted", () => {
  const { targetPlatform, ...inputWithoutTarget } = baseInput;
  const files = fileMap(inputWithoutTarget);
  const metadata = JSON.parse(files.get("harness.json"));

  assert.equal(metadata.targetPlatform, "windows-x64");
});

test("normalizes skill and prompt names into resource paths", () => {
  const files = fileMap({
    ...baseInput,
    skills: [
      { name: "C++ Review / Security", description: "Check risky changes." },
    ],
    prompts: [
      { name: "Explain: Pull Request!", description: "Explain a PR.", body: "Explain this patch." },
    ],
  });

  assert.ok(files.has("agent/skills/c-review-security/SKILL.md"));
  assert.ok(files.has("agent/prompts/explain-pull-request.md"));
});
