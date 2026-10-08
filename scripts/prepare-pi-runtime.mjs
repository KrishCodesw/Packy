import {
  mkdir,
  rm,
  writeFile,
  readFile,
  readdir,
} from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join, resolve } from "node:path";

const execFileAsync = promisify(execFile);

const PI_VERSION = "1.0.4";

const ROOT = resolve(process.cwd(), ".runtime-cache");

const BASE_URL =
  `https://github.com/earendil-works/pi/releases/download/v${PI_VERSION}`;

const PLATFORMS = [
  {
    name: "windows-x64",
    archive: "pi-windows-x64.zip",
    type: "zip",
    binary: "pi.exe",
  },
  {
    name: "macos-x64",
    archive: "pi-darwin-x64.tar.gz",
    type: "tar",
    binary: "pi",
  },
  {
    name: "macos-arm64",
    archive: "pi-darwin-arm64.tar.gz",
    type: "tar",
    binary: "pi",
  },
];

async function collectFiles(rootDir, current = rootDir) {
  const output = {};

  const entries = await readdir(current, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const absolute = join(current, entry.name);

    if (entry.isDirectory()) {
      Object.assign(
        output,
        await collectFiles(rootDir, absolute),
      );
    } else {
      const relative = absolute
        .slice(rootDir.length + 1)
        .replaceAll("\\", "/");

      output[relative] = await readFile(absolute);
    }
  }

  return output;
}

async function extractZip(archive, destination) {
  await execFileAsync("powershell.exe", [
    "-NoProfile",
    "-NonInteractive",
    "-Command",
    `Expand-Archive -LiteralPath '${archive.replaceAll(
      "'",
      "''",
    )}' -DestinationPath '${destination.replaceAll(
      "'",
      "''",
    )}' -Force`,
  ]);
}

async function extractTarGz(archive, destination) {
  const toGitBashPath = (windowsPath) =>
    windowsPath
      .replace(/\\/g, "/")
      .replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`);

  const archivePath = toGitBashPath(archive);
  const destinationPath = toGitBashPath(destination);

  await execFileAsync("tar.exe", [
    "-xzf",
    archivePath,
    "-C",
    destinationPath,
  ]);
}

async function preparePlatform(platform) {
  const platformRoot = join(
    ROOT,
    `pi-${PI_VERSION}-${platform.name}`,
  );

  const archive = join(
    platformRoot,
    platform.archive,
  );

  const extracted = join(
    platformRoot,
    "extracted",
  );

  const runtime = join(
    platformRoot,
    "runtime",
  );

  const marker = join(
    runtime,
    platform.binary,
  );

  // Already prepared.
  try {
    await readFile(marker);

    console.log(
      `✓ ${platform.name} already prepared.`,
    );

    return;
  } catch {
    // Runtime not prepared yet.
  }

  await rm(platformRoot, {
    recursive: true,
    force: true,
  });

  await mkdir(extracted, {
    recursive: true,
  });

  await mkdir(runtime, {
    recursive: true,
  });

  const url = `${BASE_URL}/${platform.archive}`;

  console.log(
    `Downloading Pi ${PI_VERSION} for ${platform.name}...`,
  );

  const response = await fetch(url, {
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(
      `Pi ${platform.name} download failed: HTTP ${response.status}`,
    );
  }

  await writeFile(
    archive,
    Buffer.from(await response.arrayBuffer()),
  );

  console.log(
    `Extracting ${platform.name}...`,
  );

  if (platform.type === "zip") {
    await extractZip(
      archive,
      extracted,
    );
  } else {
    await extractTarGz(
      archive,
      extracted,
    );
  }

  const files = await collectFiles(extracted);

  const binaryPath = Object.keys(files).find(
    (path) =>
      path.toLowerCase() ===
        platform.binary.toLowerCase() ||
      path
        .toLowerCase()
        .endsWith(
          `/${platform.binary.toLowerCase()}`,
        ),
  );

  if (!binaryPath) {
    throw new Error(
      `Downloaded ${platform.name} archive does not contain ${platform.binary}`,
    );
  }

  for (const [relative, content] of Object.entries(files)) {
    const target = join(
      runtime,
      relative,
    );

    const lastSlash = Math.max(
      target.lastIndexOf("/"),
      target.lastIndexOf("\\"),
    );

    if (lastSlash !== -1) {
      await mkdir(
        target.slice(0, lastSlash),
        {
          recursive: true,
        },
      );
    }

    await writeFile(
      target,
      content,
    );
  }

  console.log(
    `✓ ${platform.name} prepared.`,
  );
}

async function main() {
  console.log(
    `Preparing Pi ${PI_VERSION} runtimes...`,
  );

  for (const platform of PLATFORMS) {
    await preparePlatform(platform);
  }

  console.log("");
  console.log(
    `All Pi ${PI_VERSION} runtimes are ready.`,
  );
}

main().catch((error) => {
  console.error(
    error instanceof Error
      ? error.message
      : error,
  );

  process.exit(1);
});