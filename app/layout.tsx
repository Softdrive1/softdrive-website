import type { Metadata } from "next";
import { Syne, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Display — wide techno grotesque, carries the chrome headings
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Body copy
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Utility — eyebrows, labels, data
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Softdrive",
  description:
    "Electronic music duo from Hamburg. Speed House · UK Garage · Hard House · Trance.",
  openGraph: {
    title: "Softdrive",
    description:
      "Electronic music duo from Hamburg. Speed House · UK Garage · Hard House · Trance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
