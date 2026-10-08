export type TargetPlatform =
  | "windows-x64"
  | "macos-x64"
  | "macos-arm64"
  // | "multi-platform";

export type HarnessInput = {
  name: string;
  description: string;
  model: string;
  thinking: string;
  tools: string[];
  mcp: string[];
  skills: { name: string; description: string }[];
  rules: string;
  prompts: { name: string; description: string; body: string }[];
  targetPlatform?: TargetPlatform;
};

export type HarnessFile = {
  path: string;
  content: string | Buffer;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "item";
}

export function buildFiles(input: HarnessInput): HarnessFile[] {
  const settings = {
    defaultModel: input.model,
    defaultThinkingLevel: input.thinking,
    defaultTools: input.tools,
    resources: {
      skills: ["skills/**/*"],
      prompts: ["prompts/**/*"],
      extensions: ["extensions/**/*"],
    },
  };

  const mcpServers: Record<string, { url: string }> = {};
  for (const name of input.mcp) {
    mcpServers[name] = { url: `https://example.invalid/${name}` };
  }

  const files: HarnessFile[] = [
    { path: "agent/settings.json", content: JSON.stringify(settings, null, 2) + "\n" },
    { path: "agent/mcp.json", content: JSON.stringify({ mcpServers }, null, 2) + "\n" },
    {
      path: "agent/SYSTEM.md",
      content:
        `# ${input.name}\n\n${input.description}\n\n` +
        `## Operating rules\n` +
        input.rules
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `- ${line}`)
          .join("\n") +
        "\n",
    },
  ];

  for (const skill of input.skills) {
    const slug = slugify(skill.name);

files.push({
  path: `agent/skills/${slug}/SKILL.md`,
  content:
    `---\nname: ${slug}\ndescription: ${skill.description}\n---\n\n` +
    `# ${skill.name}\n\n${skill.description}\n`,
});
  }

  for (const prompt of input.prompts) {
    const slug = slugify(prompt.name);
    files.push({
      path: `agent/prompts/${slug}.md`,
      content:
        `---\ndescription: ${prompt.description}\n---\n\n${prompt.body}\n`,
    });
  }

  files.push({
    path: "harness.json",
    content:
      JSON.stringify(
        {
          version: 2,
          name: input.name,
          generatedBy: "Harness Builder",
          pi: {
            version: "1.0.4",
            model: input.model,
            thinking: input.thinking,
          },
          targetPlatform: input.targetPlatform ?? "windows-x64",
        },
        null,
        2,
      ) + "\n",
  });

  return files;
}
