import type { Metadata } from "next";
import { Syne, Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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

// metadataBase makes the file-convention og:image (app/opengraph-image.png)
// resolve to an absolute URL — required for WhatsApp/social link previews.
export const metadata: Metadata = {
  metadataBase: new URL("https://wearesoftdrive.netlify.app"),
  title: "Softdrive",
  description: "We make the music you hear at 4am.",
  openGraph: {
    title: "Softdrive",
    description: "We make the music you hear at 4am.",
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
      <body className="min-h-dvh">
        {children}
        {/* Metricool — Besucherzahlen neben den Social-Zahlen im selben Dashboard.
            afterInteractive: lädt erst, wenn die Seite steht, blockiert nichts. */}
        <Script id="metricool" strategy="afterInteractive">
          {`(function(){var h=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript";s.src="https://tracker.metricool.com/resources/be.js";s.onload=function(){beTracker.t({hash:"85fc3a03187abc6aa7aeb35237e3e3b3"})};h.appendChild(s)})();`}
        </Script>
      </body>
    </html>
  );
}
