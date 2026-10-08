# Agentmaxxer

Agentmaxxer is a pre-install customization layer for [Pi](https://github.com/earendil-works/pi). You configure an agent in a web UI, and it generates a **self-contained ZIP harness**: the Pi runtime, your agent configuration, and an installer. Nothing else needs to be installed on the target machine.

Agentmaxxer does not replace Pi or add a new agent runtime. It decides what goes into Pi *before* installation, for the things that are hard to change afterwards.

## How it works

The builder is a 5-step flow:

1. **Identity**: name and description of the agent
2. **Runtime**: model, thinking level, target platform
3. **Capabilities**: built-in tools and MCP servers
4. **Behavior**: rules, skills, prompts
5. **Review**: check the configuration and generate

Pick one target platform per harness. Only that platform's runtime is bundled.

| Platform | Value | Installer |
| --- | --- | --- |
| Windows x64 | `windows-x64` | `install.cmd` |
| macOS Intel | `macos-x64` | `install.sh` |
| macOS Apple Silicon | `macos-arm64` | `install.sh` |

The generated ZIP is **streamed directly to the browser**. Nothing is stored on the server per generation.

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run prepare:pi   # one-time: downloads the pinned Pi runtimes into .runtime-cache/
npm run dev
```

Open http://localhost:3000.

`prepare:pi` downloads Pi **v1.0.4** for Windows x64, macOS x64 and macOS arm64 from the official GitHub release and unpacks them into `.runtime-cache/`. Until it has run, `POST /api/generate` returns `503`.

> The prepare script currently extracts archives with `powershell.exe` (zip) and `tar.exe` (tar.gz), so it is written for a Windows development machine.

## What a generated harness contains

```
<harness-name>.zip
├── install.cmd | install.sh      # platform-specific installer
├── README.md                     # install instructions for this harness
├── harness.json                  # harness metadata (name, Pi version, model, platform)
├── runtimes/<platform>/          # the bundled Pi runtime for the chosen platform
└── agent/
    ├── settings.json             # default model, thinking level, tools, resource globs
    ├── mcp.json                  # MCP server configuration
    ├── SYSTEM.md                 # description and operating rules
    ├── skills/<skill>/SKILL.md
    └── prompts/<prompt>.md
```

## Installing a generated harness

**Windows**: run `install.cmd`, open a new terminal, then run `<harness-name>`.

**macOS**:

```bash
chmod +x install.sh
./install.sh
```

Restart your terminal, then run `<harness-name>`.

The installer copies the harness to `~/.harness-builder/harnesses/<harness-name>/` and adds a launcher to `~/.harness-builder/bin/`, which it puts on your `PATH`. The launcher sets `PI_CODING_AGENT_DIR` to the harness's `agent/` directory and starts the bundled Pi, so harnesses stay isolated from each other and from any separate Pi install.

## Project layout

```
app/page.tsx                  # the 5-step builder UI
app/api/generate/route.ts     # validates input, streams the ZIP
lib/harness.ts                # builds agent/ files and harness.json from the input
scripts/prepare-pi-runtime.mjs  # downloads and unpacks Pi runtimes
.runtime-cache/               # prepared runtimes (git-ignored)
```

## API

`POST /api/generate` takes a JSON `HarnessInput` (see `lib/harness.ts`) including `targetPlatform`, and responds with `application/zip`. Errors are JSON:

| Status | Meaning |
| --- | --- |
| 400 | missing `name`, or invalid `targetPlatform` |
| 503 | the Pi runtime for that platform has not been prepared |
| 500 | generation failed |

## Current limitations

- MCP servers are selectable (`github`, `postgres`, `filesystem`, `browser`), but the generated `mcp.json` currently uses **placeholder URLs**; real server definitions are not wired up yet.
- Capabilities are hardcoded in the UI. A versioned marketplace of Skills, MCPs, Tools, Flows and Stacks, with dependency resolution and reproducible packaging, is planned but not implemented.
- Runtimes are read from local disk (`.runtime-cache/`), so a hosted deployment will need them provided at build time or from object storage.