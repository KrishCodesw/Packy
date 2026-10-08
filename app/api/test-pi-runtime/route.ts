import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import unzipper from "unzipper";

const PI_RUNTIME_URL =
  "https://github.com/earendil-works/pi/releases/download/v1.0.4/pi-windows-x64.zip";

export async function GET() {
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "harness-pi-test-"),
  );

  const zipPath = path.join(tempDir, "pi-runtime.zip");
  const extractDir = path.join(tempDir, "pi-runtime");

  try {
    // 1. Download Pi runtime
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

    // 2. Save ZIP to Vercel's temporary filesystem
    await fs.writeFile(zipPath, buffer);

    // 3. Extract ZIP
    await fs.mkdir(extractDir, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const stream = require("node:fs")
        .createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractDir }));

      stream.on("close", resolve);
      stream.on("error", reject);
    });

    // 4. Inspect extracted files
    const extractedFiles = await fs.readdir(extractDir, {
      recursive: true,
    });

    // 5. Calculate extracted size
    let extractedBytes = 0;

    async function calculateSize(directory: string): Promise<void> {
      const entries = await fs.readdir(directory, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          await calculateSize(entryPath);
        } else {
          const stat = await fs.stat(entryPath);
          extractedBytes += stat.size;
        }
      }
    }

    await calculateSize(extractDir);

    return NextResponse.json({
      success: true,
      download: {
        status: response.status,
        bytes: buffer.length,
        contentType: response.headers.get("content-type"),
      },
      extraction: {
        success: true,
        directory: extractDir,
        fileCount: extractedFiles.length,
        extractedBytes,
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
    // Clean up Vercel temporary files
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
}