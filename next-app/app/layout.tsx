import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'How I Work — 3D Demo',
  description: 'A scroll-driven 3D view of the product development process.',
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
