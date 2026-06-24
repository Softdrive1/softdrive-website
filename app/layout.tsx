import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Softdrive",
  description: "Electronic music duo from Hamburg. Speed House · UK Garage · Hard House · Trance.",
  openGraph: {
    title: "Softdrive",
    description: "Electronic music duo from Hamburg. Speed House · UK Garage · Hard House · Trance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
