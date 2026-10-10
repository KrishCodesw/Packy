import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Packy — Your agent. Packaged.",
    template: "%s — Packy",
  },
  description: "Build and package self-contained Pi agent environments.",
  applicationName: "Packy",
  keywords: ["AI agents", "Pi", "agent packaging", "developer tools"],
};

export const viewport: Viewport = {
  themeColor: "#f7f7f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
