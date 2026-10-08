import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import AdmZip from "adm-zip";

import type { TargetPlatform } from "./harness";

const PI_VERSION = "1.0.4";

const RUNTIME_URLS: Record<TargetPlatform, string> = {
  "windows-x64":
    "https://github.com/earendil-works/pi/releases/download/v1.0.4/pi-windows-x64.zip",

  "macos-x64":
    "https://github.com/earendil-works/pi/releases/download/v1.0.4/pi-macos-x64.tar.gz",

  "macos-arm64":
    "https://github.com/earendil-works/pi/releases/download/v1.0.4/pi-macos-arm64.tar.gz",
};

async function findFile(
  root: string,
  filename: string,
): Promise<string | null> {
  const entries = await fs.readdir(root, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);

    if (entry.isFile() && entry.name === filename) {
      return entryPath;
    }

    if (entry.isDirectory()) {
      const found = await findFile(entryPath, filename);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

export async function downloadPiRuntime(
  targetPlatform: TargetPlatform,
): Promise<{
  runtimeRoot: string;
  tempDir: string;
}> {
  const runtimeUrl = RUNTIME_URLS[targetPlatform];

  if (!runtimeUrl) {
    throw new Error(
      `Unsupported Pi runtime platform: ${targetPlatform}`,
    );
  }

  // Windows x64 is the first production-supported runtime.
  // macOS extraction will be added separately because those
  // release assets are .tar.gz archives.
  if (targetPlatform !== "windows-x64") {
    throw new Error(
      `Runtime download for ${targetPlatform} is not implemented yet.`,
    );
  }

  const tempDir = await fs.mkdtemp(
    path.join(
      os.tmpdir(),
      `harness-pi-${PI_VERSION}-`,
    ),
  );

  const archivePath = path.join(
    tempDir,
    "pi-runtime.zip",
  );

  const extractDir = path.join(
    tempDir,
    "pi-runtime",
  );

  try {
    const response = await fetch(runtimeUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download Pi runtime: ${response.status} ${response.statusText}`,
      );
    }

    const buffer = Buffer.from(
      await response.arrayBuffer(),
    );

    await fs.writeFile(
      archivePath,
      buffer,
    );

    await fs.mkdir(
      extractDir,
      {
        recursive: true,
      },
    );

    const zip = new AdmZip(
      archivePath,
    );

    zip.extractAllTo(
      extractDir,
      true,
    );

    const binaryPath = await findFile(
      extractDir,
      "pi.exe",
    );

    if (!binaryPath) {
      throw new Error(
        "Downloaded Pi runtime does not contain pi.exe.",
      );
    }

    return {
      runtimeRoot: path.dirname(
        binaryPath,
      ),
      tempDir,
    };
  } catch (error) {
    await fs.rm(
      tempDir,
      {
        recursive: true,
        force: true,
      },
    );

    throw error;
  }
}

export async function cleanupPiRuntime(
  tempDir: string,
): Promise<void> {
  await fs.rm(
    tempDir,
    {
      recursive: true,
      force: true,
    },
  );
}