import { createReadStream } from "node:fs";
import { rm } from "node:fs/promises";
import { Readable } from "node:stream";

export interface StreamFileResponseOptions {
  filePath: string;
  tempDir: string;
  fileName: string;
  size: number;
}

export function streamFileResponse({
  filePath,
  tempDir,
  fileName,
  size,
}: StreamFileResponseOptions): Response {
  const fileStream = createReadStream(filePath);
  let cleanupPromise: Promise<void> | undefined;

  const cleanup = (): void => {
    if (!cleanupPromise) {
      cleanupPromise = rm(tempDir, {
        recursive: true,
        force: true,
      }).catch((error: unknown) => {
        console.error(
          "Failed to clean up generated package files:",
          error,
        );
      });
    }
  };

  // Keep the generated files available until the client finishes reading,
  // or aborts the download. The stream's close event covers both paths.
  fileStream.once("close", cleanup);

  fileStream.once("error", (error: Error) => {
    console.error("Generated package stream failed:", error);
    cleanup();
  });

  return new Response(Readable.toWeb(fileStream), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(size),
      "Cache-Control": "no-store",
    },
  });
}
