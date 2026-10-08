# Harness Builder

Harness Builder creates a self-contained Pi-based agent for Windows x64.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

When a harness is generated, Harness Builder downloads the pinned Pi v1.0.4 Windows x64 runtime, places it under `bin/`, and packages the generated Pi resources under `agent/`.

The resulting harness can be started with `run.cmd` without a separate Pi installation.
