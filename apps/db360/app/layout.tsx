import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AxonRing DB360',
  description: 'Commercial intelligence operating system for AxonRing Holdings Group.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
