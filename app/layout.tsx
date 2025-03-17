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
  icons: {
    icon: [
      { url: '/cinegenie logo.png' },
      { url: '/cine genie.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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