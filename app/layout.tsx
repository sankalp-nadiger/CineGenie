import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Add display swap for better performance
  preload: true,   // Ensure font preloading
  adjustFontFallback: true // Improve font loading behavior
});

export const metadata: Metadata = {
  title: 'CineGenie',
  description: 'Developed with love by Sankalp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}