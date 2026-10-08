import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Harness Builder", description: "Build purpose-built Pi agent harnesses." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
