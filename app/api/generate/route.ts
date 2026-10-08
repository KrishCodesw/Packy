// import { NextResponse } from "next/server";
// import yazl from "yazl";

// import { mkdir, stat, readdir } from "node:fs/promises";
// import { createWriteStream } from "node:fs";
// import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { Readable } from "node:stream";

// import {
//   buildFiles,
//   type HarnessInput,
// } from "../../../lib/harness";

// export const runtime = "nodejs";

// const PI_VERSION = "1.0.4";

// const RUNTIME_ROOT = resolve(
//   process.cwd(),
//   ".runtime-cache",
// );

// const RUNTIMES = [
//   {
//     name: "windows-x64",
//     directory: `pi-${PI_VERSION}-windows-x64`,
//     binary: "pi.exe",
//   },
//   {
//     name: "macos-x64",
//     directory: `pi-${PI_VERSION}-macos-x64`,
//     binary: "pi",
//   },
//   {
//     name: "macos-arm64",
//     directory: `pi-${PI_VERSION}-macos-arm64`,
//     binary: "pi",
//   },
// ] as const;

// function sanitizeName(name: string): string {
//   return (
//     name
//       .replace(/[^a-zA-Z0-9-_]+/g, "-")
//       .replace(/^-+|-+$/g, "")
//       .toLowerCase() || "personal-harness"
//   );
// }

// function windowsInstaller(
//   harnessSlug: string,
// ): string {
//   return `@echo off
// setlocal

// set "SOURCE=%~dp0"
// set "BASE=%USERPROFILE%\\.harness-builder"
// set "HARNESS=%BASE%\\harnesses\\${harnessSlug}"
// set "BIN=%BASE%\\bin"

// echo.
// echo Installing ${harnessSlug}...
// echo.

// if not exist "%BASE%" mkdir "%BASE%"
// if not exist "%BASE%\\harnesses" mkdir "%BASE%\\harnesses"
// if not exist "%BIN%" mkdir "%BIN%"
// if not exist "%HARNESS%" mkdir "%HARNESS%"

// xcopy "%SOURCE%runtimes" "%HARNESS%\\runtimes" /E /I /Y >nul
// xcopy "%SOURCE%agent" "%HARNESS%\\agent" /E /I /Y >nul

// copy "%SOURCE%harness.json" "%HARNESS%\\harness.json" /Y >nul
// copy "%SOURCE%README.md" "%HARNESS%\\README.md" /Y >nul

// (
//   echo @echo off
//   echo setlocal
//   echo set "HARNESS=%%USERPROFILE%%\\.harness-builder\\harnesses\\${harnessSlug}"
//   echo set "PI_CODING_AGENT_DIR=%%HARNESS%%\\agent"
//   echo "%%HARNESS%%\\runtimes\\windows-x64\\pi.exe" %%*
// ) > "%BIN%\\${harnessSlug}.cmd"

// (
//   echo #!/usr/bin/env bash
//   echo HARNESS="$HOME/.harness-builder/harnesses/${harnessSlug}"
//   echo if [ ! -f "$HARNESS/runtimes/windows-x64/pi.exe" ]; then
//   echo   echo "Windows x64 Pi runtime is missing."
//   echo   exit 1
//   echo fi
//   echo export PI_CODING_AGENT_DIR="$HARNESS/agent"
//   echo PI="$(cygpath -w "$HARNESS/runtimes/windows-x64/pi.exe")"
//   echo exec cmd.exe /d /c "\\"$PI\\" $*"
// ) > "%BIN%\\${harnessSlug}"

// powershell -NoProfile -ExecutionPolicy Bypass -Command ^
//   "$bin = [Environment]::GetEnvironmentVariable('Path', 'User');" ^
//   "if (-not $bin) { $bin = '' };" ^
//   "$parts = $bin -split ';' | Where-Object { $_ -ne '' };" ^
//   "if ($parts -notcontains '%BIN%') {" ^
//   "  $newPath = (($parts + '%BIN%') -join ';');" ^
//   "  [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')" ^
//   "}"

// echo.
// echo Installed successfully.
// echo.
// echo Run:
// echo   ${harnessSlug}
// echo.
// echo Open a new terminal before running it.
// echo.

// pause
// `;
// }

// function macInstaller(
//   harnessSlug: string,
// ): string {
//   return `#!/bin/sh
// set -e

// SOURCE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

// BASE="$HOME/.harness-builder"
// HARNESS="$BASE/harnesses/${harnessSlug}"
// BIN="$BASE/bin"

// echo ""
// echo "Installing ${harnessSlug}..."
// echo ""

// mkdir -p "$HARNESS"
// mkdir -p "$BIN"

// cp -R "$SOURCE/runtimes" "$HARNESS/"
// cp -R "$SOURCE/agent" "$HARNESS/"

// cp "$SOURCE/harness.json" "$HARNESS/harness.json"
// cp "$SOURCE/README.md" "$HARNESS/README.md"

// chmod +x "$HARNESS/runtimes/macos-x64/pi" 2>/dev/null || true
// chmod +x "$HARNESS/runtimes/macos-arm64/pi" 2>/dev/null || true

// cat > "$BIN/${harnessSlug}" <<'LAUNCHER'
// #!/bin/sh
// set -e

// HARNESS="$HOME/.harness-builder/harnesses/${harnessSlug}"

// case "$(uname -s)" in
//   Darwin)
//     ;;
//   *)
//     echo "This launcher is intended for macOS."
//     exit 1
//     ;;
// esac

// ARCH="$(uname -m)"

// case "$ARCH" in
//   arm64)
//     PI="$HARNESS/runtimes/macos-arm64/pi"
//     ;;
//   x86_64)
//     PI="$HARNESS/runtimes/macos-x64/pi"
//     ;;
//   *)
//     echo "Unsupported macOS architecture: $ARCH"
//     exit 1
//     ;;
// esac

// if [ ! -f "$PI" ]; then
//   echo "Required Pi runtime is missing."
//   exit 1
// fi

// export PI_CODING_AGENT_DIR="$HARNESS/agent"

// exec "$PI" "$@"
// LAUNCHER

// chmod +x "$BIN/${harnessSlug}"

// SHELL_NAME="$(basename "$SHELL")"

// case "$SHELL_NAME" in
//   zsh)
//     PROFILE="$HOME/.zshrc"
//     ;;
//   bash)
//     PROFILE="$HOME/.bashrc"
//     ;;
//   *)
//     PROFILE="$HOME/.profile"
//     ;;
// esac

// if ! grep -Fq 'export PATH="$HOME/.harness-builder/bin:$PATH"' "$PROFILE" 2>/dev/null; then
//   printf '\\nexport PATH="$HOME/.harness-builder/bin:$PATH"\\n' >> "$PROFILE"
// fi

// echo ""
// echo "Installed successfully."
// echo ""
// echo "Run:"
// echo "  ${harnessSlug}"
// echo ""
// echo "Restart your terminal or run:"
// echo "  source $PROFILE"
// echo ""
// `;
// }

// function readme(
//   input: HarnessInput,
//   harnessSlug: string,
// ): string {
//   return `# ${input.name}

// This is a self-contained Pi-based agent generated by Harness Builder.

// ## Installation

// ### Windows

// Run:

//     install.cmd

// Then open a new terminal and run:

//     ${harnessSlug}

// ### macOS

// Run:

//     chmod +x install.sh
//     ./install.sh

// Then restart your terminal and run:

//     ${harnessSlug}

// ## Runtime

// This harness bundles Pi ${PI_VERSION} for:

// - Windows x64
// - macOS Intel (x64)
// - macOS Apple Silicon (arm64)

// You do not need to install Pi separately.

// ## Agent resources

// The generated agent resources live in:

//     agent/

// The harness runtime is stored separately from the agent configuration.

// Pi version: ${PI_VERSION}
// `;
// }

// async function collectRuntimeFiles(
//   root: string,
//   archivePrefix: string,
//   current = root,
// ): Promise<
//   Array<{
//     absolutePath: string;
//     archivePath: string;
//   }>
// > {
//   const entries = await readdir(current, {
//     withFileTypes: true,
//   });

//   const files: Array<{
//     absolutePath: string;
//     archivePath: string;
//   }> = [];

//   for (const entry of entries) {
//     const absolutePath = join(
//       current,
//       entry.name,
//     );

//     if (entry.isDirectory()) {
//       files.push(
//         ...(await collectRuntimeFiles(
//           root,
//           archivePrefix,
//           absolutePath,
//         )),
//       );
//       continue;
//     }

//     const relativePath = absolutePath
//       .slice(root.length + 1)
//       .replaceAll("\\", "/");

//     files.push({
//       absolutePath,
//       archivePath: `${archivePrefix}/${relativePath}`,
//     });
//   }

//   return files;
// }

// async function createZip(
//   input: HarnessInput,
//   zipPath: string,
//   harnessSlug: string,
// ): Promise<void> {
//   const zipfile = new yazl.ZipFile();

//   const output = createWriteStream(zipPath);

//   const completed = new Promise<void>(
//     (resolvePromise, rejectPromise) => {
//       output.on(
//         "close",
//         resolvePromise,
//       );

//       output.on(
//         "error",
//         rejectPromise,
//       );

//       zipfile.outputStream.on(
//         "error",
//         rejectPromise,
//       );
//     },
//   );

//   zipfile.outputStream.pipe(output);

//   // Generated Harness Builder resources
//   const files = buildFiles({
//     ...input,
//     targetPlatform: "multi-platform",
//   });

//   for (const file of files) {
//     zipfile.addBuffer(
//       Buffer.isBuffer(file.content)
//         ? file.content
//         : Buffer.from(file.content),
//       file.path,
//     );
//   }

//   // Bundled Pi runtimes
//   for (const runtime of RUNTIMES) {
//     const runtimeRoot = join(
//       RUNTIME_ROOT,
//       runtime.directory,
//       "runtime",
//     );

//     const runtimeFiles =
//       await collectRuntimeFiles(
//         runtimeRoot,
//         `runtimes/${runtime.name}`,
//       );

//     for (const file of runtimeFiles) {
//       zipfile.addFile(
//         file.absolutePath,
//         file.archivePath,
//       );
//     }
//   }

//   // Installers
//   zipfile.addBuffer(
//     Buffer.from(
//       windowsInstaller(harnessSlug),
//       "utf8",
//     ),
//     "install.cmd",
//   );

//   zipfile.addBuffer(
//     Buffer.from(
//       macInstaller(harnessSlug),
//       "utf8",
//     ),
//     "install.sh",
//   );

//   // README
//   zipfile.addBuffer(
//     Buffer.from(
//       readme(input, harnessSlug),
//       "utf8",
//     ),
//     "README.md",
//   );

//   zipfile.end();

//   await completed;
// }

// async function verifyRuntimes(): Promise<void> {
//   for (const runtime of RUNTIMES) {
//     await stat(
//       join(
//         RUNTIME_ROOT,
//         runtime.directory,
//         "runtime",
//         runtime.binary,
//       ),
//     );
//   }
// }

// export async function POST(
//   request: Request,
// ) {
//   try {
//     const input =
//       (await request.json()) as HarnessInput;

//     if (!input.name?.trim()) {
//       return NextResponse.json(
//         {
//           error: "name is required",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     // Verify all Pi runtimes.
//     try {
//       await verifyRuntimes();
//     } catch {
//       return NextResponse.json(
//         {
//           error:
//             "Pi runtimes are not prepared. Run `npm run prepare:pi` once.",
//         },
//         {
//           status: 503,
//         },
//       );
//     }

//     const harnessSlug =
      sanitizeName(input.name);

    const filename =
      `${harnessSlug}.zip`;

    const temporaryDirectory =
      await mkdtemp(
        join(
          tmpdir(),
          "harness-builder-",
        ),
      );

    const zipPath =
      join(
        temporaryDirectory,
        filename,
      );

    try {
      await createZip(
        input,
        zipPath,
        harnessSlug,
        runtime,
      );

      const { size } =
        await stat(zipPath);

      console.log(
        `Harness generated: ${filename} (${size} bytes)`,
      );

      const fileStream =
        createReadStream(zipPath);

      const cleanup = () =>
        rm(
          temporaryDirectory,
          {
            recursive: true,
            force: true,
          },
        ).catch((error) =>
          console.error(
            "Temporary harness cleanup failed:",
            error,
          ),
        );

      fileStream.on("close", cleanup);
      fileStream.on("error", cleanup);

      return new Response(
        Readable.toWeb(fileStream) as ReadableStream,
        {
          headers: {
            "content-type":
              "application/zip",
            "content-length":
              String(size),
            "content-disposition":
              `attachment; filename="${filename}"`,
            "cache-control":
              "no-store",
          },
        },
      );
    } catch (error) {
      await rm(
        temporaryDirectory,
        {
          recursive: true,
          force: true,
        },
      );

      throw error;
    }

  } catch (error) {
//     console.error(
//       "Harness generation failed:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "Generation failed",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
import { NextResponse } from "next/server";
import yazl from "yazl";

import { mkdtemp, readdir, rm, stat } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { join, resolve } from "node:path";

import {
  buildFiles,
  type HarnessInput,
} from "../../../lib/harness";

export const runtime = "nodejs";

const PI_VERSION = "1.0.4";

const RUNTIME_ROOT = resolve(
  process.cwd(),
  ".runtime-cache",
);

const RUNTIMES = [
  {
    name: "windows-x64",
    directory: `pi-${PI_VERSION}-windows-x64`,
    binary: "pi.exe",
  },
  {
    name: "macos-x64",
    directory: `pi-${PI_VERSION}-macos-x64`,
    binary: "pi",
  },
  {
    name: "macos-arm64",
    directory: `pi-${PI_VERSION}-macos-arm64`,
    binary: "pi",
  },
] as const;

const OUTPUT_DIR = join(
  process.cwd(),
  "public",
  "generated",
);

function sanitizeName(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "personal-harness"
  );
}

function windowsInstaller(
  harnessSlug: string,
): string {
  return `@echo off
setlocal

set "SOURCE=%~dp0"
set "BASE=%USERPROFILE%\\.harness-builder"
set "HARNESS=%BASE%\\harnesses\\${harnessSlug}"
set "BIN=%BASE%\\bin"

echo.
echo Installing ${harnessSlug}...
echo.

if not exist "%BASE%" mkdir "%BASE%"
if not exist "%BASE%\\harnesses" mkdir "%BASE%\\harnesses"
if not exist "%BIN%" mkdir "%BIN%"
if not exist "%HARNESS%" mkdir "%HARNESS%"

xcopy "%SOURCE%runtimes" "%HARNESS%\\runtimes" /E /I /Y >nul
xcopy "%SOURCE%agent" "%HARNESS%\\agent" /E /I /Y >nul

copy "%SOURCE%harness.json" "%HARNESS%\\harness.json" /Y >nul
copy "%SOURCE%README.md" "%HARNESS%\\README.md" /Y >nul

(
  echo @echo off
  echo setlocal
  echo set "HARNESS=%%USERPROFILE%%\\.harness-builder\\harnesses\\${harnessSlug}"
  echo set "PI_CODING_AGENT_DIR=%%HARNESS%%\\agent"
  echo "%%HARNESS%%\\runtimes\\windows-x64\\pi.exe" %%*
) > "%BIN%\\${harnessSlug}.cmd"

(
  echo #!/usr/bin/env bash
  echo HARNESS="$HOME/.harness-builder/harnesses/${harnessSlug}"
  echo if [ ! -f "$HARNESS/runtimes/windows-x64/pi.exe" ]; then
  echo   echo "Windows x64 Pi runtime is missing."
  echo   exit 1
  echo fi
  echo export PI_CODING_AGENT_DIR="$HARNESS/agent"
  echo PI="$(cygpath -w "$HARNESS/runtimes/windows-x64/pi.exe")"
  echo exec cmd.exe /d /c "\\"$PI\\"" "$@"
) > "%BIN%\\${harnessSlug}"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$bin = [Environment]::GetEnvironmentVariable('Path', 'User');" ^
  "if (-not $bin) { $bin = '' };" ^
  "$parts = $bin -split ';' | Where-Object { $_ -ne '' };" ^
  "if ($parts -notcontains '%BIN%') {" ^
  "  $newPath = (($parts + '%BIN%') -join ';');" ^
  "  [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')" ^
  "}"

echo.
echo Installed successfully.
echo.
echo Run:
echo   ${harnessSlug}
echo.
echo Open a new terminal before running it.
echo.

pause
`;
}

function macInstaller(
  harnessSlug: string,
): string {
  return `#!/bin/sh
set -e

SOURCE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

BASE="$HOME/.harness-builder"
HARNESS="$BASE/harnesses/${harnessSlug}"
BIN="$BASE/bin"

echo ""
echo "Installing ${harnessSlug}..."
echo ""

mkdir -p "$HARNESS"
mkdir -p "$BIN"

cp -R "$SOURCE/runtimes" "$HARNESS/"
cp -R "$SOURCE/agent" "$HARNESS/"

cp "$SOURCE/harness.json" "$HARNESS/harness.json"
cp "$SOURCE/README.md" "$HARNESS/README.md"

chmod +x "$HARNESS/runtimes/macos-x64/pi" 2>/dev/null || true
chmod +x "$HARNESS/runtimes/macos-arm64/pi" 2>/dev/null || true

cat > "$BIN/${harnessSlug}" <<'LAUNCHER'
#!/bin/sh
set -e

HARNESS="$HOME/.harness-builder/harnesses/${harnessSlug}"

case "$(uname -s)" in
  Darwin)
    ;;
  *)
    echo "This launcher is intended for macOS."
    exit 1
    ;;
esac

ARCH="$(uname -m)"

case "$ARCH" in
  arm64)
    PI="$HARNESS/runtimes/macos-arm64/pi"
    ;;
  x86_64)
    PI="$HARNESS/runtimes/macos-x64/pi"
    ;;
  *)
    echo "Unsupported macOS architecture: $ARCH"
    exit 1
    ;;
esac

if [ ! -f "$PI" ]; then
  echo "Required Pi runtime is missing."
  exit 1
fi

export PI_CODING_AGENT_DIR="$HARNESS/agent"

exec "$PI" "$@"
LAUNCHER

chmod +x "$BIN/${harnessSlug}"

SHELL_NAME="$(basename "$SHELL")"

case "$SHELL_NAME" in
  zsh)
    PROFILE="$HOME/.zshrc"
    ;;
  bash)
    PROFILE="$HOME/.bashrc"
    ;;
  *)
    PROFILE="$HOME/.profile"
    ;;
esac

if ! grep -Fq 'export PATH="$HOME/.harness-builder/bin:$PATH"' "$PROFILE" 2>/dev/null; then
  printf '\\nexport PATH="$HOME/.harness-builder/bin:$PATH"\\n' >> "$PROFILE"
fi

echo ""
echo "Installed successfully."
echo ""
echo "Run:"
echo "  ${harnessSlug}"
echo ""
echo "Restart your terminal or run:"
echo "  source $PROFILE"
echo ""
`;
}

function readme(
  input: HarnessInput,
  harnessSlug: string,
  runtime: (typeof RUNTIMES)[number],
): string {
  const isWindows = runtime.name === "windows-x64";

  return `# ${input.name}

This is a self-contained Pi-based agent generated by Harness Builder.

## Installation

${
  isWindows
    ? `### Windows

Run:

    install.cmd

Then open a new terminal and run:

    ${harnessSlug}`
    : `### macOS

Run:

    chmod +x install.sh
    ./install.sh

Then restart your terminal and run:

    ${harnessSlug}`
}

## Runtime

This harness bundles Pi ${PI_VERSION} for:

- ${runtime.name}

You do not need to install Pi separately.

## Agent resources

The generated agent resources live in:

    agent/

The harness runtime is stored separately from the agent configuration.

Pi version: ${PI_VERSION}
`;
}

async function collectRuntimeFiles(
  root: string,
  archivePrefix: string,
  current = root,
): Promise<
  Array<{
    absolutePath: string;
    archivePath: string;
  }>
> {
  const entries = await readdir(current, {
    withFileTypes: true,
  });

  const files: Array<{
    absolutePath: string;
    archivePath: string;
  }> = [];

  for (const entry of entries) {
    const absolutePath = join(
      current,
      entry.name,
    );

    if (entry.isDirectory()) {
      files.push(
        ...(await collectRuntimeFiles(
          root,
          archivePrefix,
          absolutePath,
        )),
      );

      continue;
    }

    const relativePath = absolutePath
      .slice(root.length + 1)
      .replaceAll("\\", "/");

    files.push({
      absolutePath,
      archivePath: `${archivePrefix}/${relativePath}`,
    });
  }

  return files;
}

async function createZip(
  input: HarnessInput,
  zipPath: string,
  harnessSlug: string,
  runtime: (typeof RUNTIMES)[number],
): Promise<void> {
  const zipfile = new yazl.ZipFile();
  const output = createWriteStream(zipPath);

  const completed = new Promise<void>(
    (resolvePromise, rejectPromise) => {
      output.on(
        "close",
        resolvePromise,
      );

      output.on(
        "error",
        rejectPromise,
      );

      zipfile.outputStream.on(
        "error",
        rejectPromise,
      );
    },
  );

  zipfile.outputStream.pipe(output);

  // Generated Harness Builder resources
  const files = buildFiles({
    ...input,
    targetPlatform: runtime.name,
  });

  for (const file of files) {
    zipfile.addBuffer(
      Buffer.isBuffer(file.content)
        ? file.content
        : Buffer.from(file.content),
      file.path,
    );
  }

  // Selected Pi runtime only
  const runtimeRoot = join(
    RUNTIME_ROOT,
    runtime.directory,
    "runtime",
  );

  const runtimeFiles =
    await collectRuntimeFiles(
      runtimeRoot,
      `runtimes/${runtime.name}`,
    );

  for (const file of runtimeFiles) {
    zipfile.addFile(
      file.absolutePath,
      file.archivePath,
    );
  }

  // Platform-specific installer
  if (runtime.name === "windows-x64") {
    zipfile.addBuffer(
      Buffer.from(
        windowsInstaller(harnessSlug),
        "utf8",
      ),
      "install.cmd",
    );
  } else {
    zipfile.addBuffer(
      Buffer.from(
        macInstaller(harnessSlug),
        "utf8",
      ),
      "install.sh",
    );
  }

  // README
  zipfile.addBuffer(
    Buffer.from(
      readme(
        input,
        harnessSlug,
        runtime,
      ),
      "utf8",
    ),
    "README.md",
  );

  zipfile.end();

  await completed;
}

async function verifyRuntime(
  runtime: (typeof RUNTIMES)[number],
): Promise<void> {
  await stat(
    join(
      RUNTIME_ROOT,
      runtime.directory,
      "runtime",
      runtime.binary,
    ),
  );
}

export async function POST(
  request: Request,
) {
  try {
    const input =
      (await request.json()) as HarnessInput;

    if (!input.name?.trim()) {
      return NextResponse.json(
        {
          error: "name is required",
        },
        {
          status: 400,
        },
      );
    }

    // Find the requested platform runtime
    const runtime = RUNTIMES.find(
      (item) =>
        item.name === input.targetPlatform,
    );

    if (!runtime) {
      return NextResponse.json(
        {
          error:
            "A valid target platform is required.",
        },
        {
          status: 400,
        },
      );
    }

    // Verify only the selected Pi runtime
    try {
      await verifyRuntime(runtime);
    } catch {
      return NextResponse.json(
        {
          error:
            `Pi runtime for ${runtime.name} is not prepared. ` +
            "Run `npm run prepare:pi` once.",
        },
        {
          status: 503,
        },
      );
    }

    await mkdir(
      OUTPUT_DIR,
      {
        recursive: true,
      },
    );

    const harnessSlug =
      sanitizeName(input.name);

    const filename =
      `${harnessSlug}.zip`;

    const zipPath =
      join(
        OUTPUT_DIR,
        filename,
      );

    await createZip(
      input,
      zipPath,
      harnessSlug,
      runtime,
    );

    const { size } =
      await stat(zipPath);

    console.log(
      `Harness generated: ${filename} (${size} bytes)`,
    );

    return NextResponse.json({
      success: true,
      filename,
      downloadUrl:
        `/generated/${encodeURIComponent(filename)}`,
      size,
    });
  } catch (error) {
    console.error(
      "Harness generation failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Generation failed",
      },
      {
        status: 500,
      },
    );
  }
}