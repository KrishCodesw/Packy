import { NextResponse } from "next/server";

const PI_RUNTIME_URL =
  "https://github.com/earendil-works/pi/releases/download/v1.0.4/pi-windows-x64.zip";

export async function GET() {
  const response = await fetch(PI_RUNTIME_URL);

  if (!response.ok) {
    return NextResponse.json(
      {
        success: false,
        status: response.status,
      },
      { status: 502 },
    );
  }

  const buffer = await response.arrayBuffer();

  return NextResponse.json({
    success: true,
    status: response.status,
    bytes: buffer.byteLength,
    contentType: response.headers.get("content-type"),
  });
}