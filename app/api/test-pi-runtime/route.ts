import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import AdmZip from "adm-zip";

const PI_RUNTIME_URL =
  "https://github.com/earendil-works/pi/releases/download/v1.0.4/pi-windows-x64.zip";

export async function GET() {
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "harness-pi-test-"),
  );

  const zipPath = path.join(tempDir, "pi-runtime.zip");
  const extractDir = path.join(tempDir, "pi-runtime");

  try {
    const response = await fetch(PI_RUNTIME_URL);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          step: "download",
          status: response.status,
        },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    await fs.writeFile(zipPath, buffer);

    await fs.mkdir(extractDir, { recursive: true });

    const zip = new AdmZip(zipPath);

    zip.extractAllTo(extractDir, true);

    const extractedFiles = await fs.readdir(extractDir, {
      recursive: true,
    });

    return NextResponse.json({
      success: true,

      download: {
        status: response.status,
        bytes: buffer.length,
        contentType: response.headers.get("content-type"),
      },

      extraction: {
        success: true,
        fileCount: extractedFiles.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
}