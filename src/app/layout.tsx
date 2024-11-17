// src/app/layout.tsx
import type { Metadata } from "next";
import { Bruno_Ace_SC } from 'next/font/google';  // Add this import
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Add Bruno Ace SC using next/font/google
const brunoAce = Bruno_Ace_SC({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bruno-ace',
});

export const metadata: Metadata = {
  title: 'Game Collection',
  description: 'A collection of fun games',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brunoAce.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}