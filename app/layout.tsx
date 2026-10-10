import './globals.css';
import type { Metadata } from 'next';
import Brand from './components/ui/Brand';

export const metadata: Metadata = {
  title: 'Packy - Your agent. Packaged.',
  description: 'Turn agent configurations into installable runtime packages.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}