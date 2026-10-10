const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createWriteStream } = require("node:fs");
const AdmZip = require("adm-zip");
const yazl = require("yazl");

const {
  streamFileResponse,
} = require("../.test-dist/stream-file-response.js");

async function createTestArchive(zipPath, payload) {
  const zipfile = new yazl.ZipFile();
  const output = createWriteStream(zipPath);

  const completed = new Promise((resolve, reject) => {
    output.once("close", resolve);
    output.once("error", reject);
    zipfile.outputStream.once("error", reject);
  });

  zipfile.outputStream.pipe(output);
  zipfile.addBuffer(payload, "runtimes/windows-x64/pi.exe", {
    compress: false,
  });
  zipfile.end();

  await completed;
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

test("streams a ZIP larger than 4.5 MB without changing bytes and cleans up afterward", async () => {
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "packy-stream-test-"));
  const zipPath = path.join(tempDir, "large-package.zip");
  const payload = crypto.randomBytes(5 * 1024 * 1024);

  try {
    await createTestArchive(zipPath, payload);
    const originalArchive = await fsp.readFile(zipPath);
    const originalSize = (await fsp.stat(zipPath)).size;

    assert.ok(
      originalSize > 4.5 * 1024 * 1024,
      `fixture should exceed 4.5 MB; received ${originalSize} bytes`,
    );

    // Confirm the fixture itself is a valid ZIP with the expected runtime entry.
    const originalZip = new AdmZip(originalArchive);
    const originalEntry = originalZip.getEntry("runtimes/windows-x64/pi.exe");
    assert.ok(originalEntry, "fixture contains the runtime entry");
    assert.deepEqual(originalEntry.getData(), payload);

    const response = streamFileResponse({
      filePath: zipPath,
      tempDir,
      fileName: "large-package.zip",
      size: originalSize,
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "application/zip");
    assert.equal(response.headers.get("content-length"), String(originalSize));
    assert.equal(
      response.headers.get("content-disposition"),
      'attachment; filename="large-package.zip"',
    );

    assert.ok(response.body, "response should provide a stream");
    const downloadedArchive = Buffer.from(await response.arrayBuffer());

    assert.equal(downloadedArchive.byteLength, originalSize);
    assert.equal(sha256(downloadedArchive), sha256(originalArchive));

    // Parse the received bytes, rather than relying only on the HTTP status.
    const downloadedZip = new AdmZip(downloadedArchive);
    const downloadedEntry = downloadedZip.getEntry("runtimes/windows-x64/pi.exe");
    assert.ok(downloadedEntry, "downloaded archive contains the runtime entry");
    assert.deepEqual(downloadedEntry.getData(), payload);

    // The stream owns cleanup and should remove its temporary directory after EOF.
    for (let attempt = 0; attempt < 50 && fs.existsSync(tempDir); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    assert.equal(fs.existsSync(tempDir), false, "temporary directory is removed after streaming");
  } finally {
    await fsp.rm(tempDir, { recursive: true, force: true });
  }
});
