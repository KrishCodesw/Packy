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

export async function downloadPiRuntime(
  targetPlatform: TargetPlatform,
): Promise<string> {
  const runtimeUrl = RUNTIME_URLS[targetPlatform];

  if (!runtimeUrl) {
    throw new Error(
      `Unsupported Pi runtime platform: ${targetPlatform}`,
    );
  }

  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), `harness-pi-${PI_VERSION}-`),
  );

  const archivePath = path.join(tempDir, "pi-runtime.archive");
  const extractDir = path.join(tempDir, "pi-runtime");

  const response = await fetch(runtimeUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download Pi runtime: ${response.status} ${response.statusText}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.writeFile(archivePath, buffer);
  await fs.mkdir(extractDir, { recursive: true });

  if (targetPlatform === "windows-x64") {
    const zip = new AdmZip(archivePath);
    zip.extractAllTo(extractDir, true);
  } else {
    throw new Error(
      `Archive extraction for ${targetPlatform} is not implemented yet.`,
    );
  }

  return extractDir;
}