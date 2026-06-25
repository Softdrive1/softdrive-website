import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HardDriveSection from "./components/HardDriveSection";
import ReleasesSection from "./components/ReleasesSection";
import SetsSection from "./components/SetsSection";
import AboutSection from "./components/AboutSection";
import DemoDropSection from "./components/DemoDropSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HardDriveSection />
        <ReleasesSection />
        <SetsSection />
        <AboutSection />
        <DemoDropSection />
      </main>
      <div
        style={{
          background: "#c3bfb9",
          paddingBottom: "28px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            color: "rgba(26,20,14,0.28)",
            letterSpacing: "0.01em",
            fontFamily: "'Inter', 'Space Grotesk', sans-serif",
            lineHeight: 1.5,
          }}
        >
          {/* Replace [Author] and [Source URL] with the actual model credits */}
          &ldquo;Hard Drive&rdquo; 3D model by [Author] — licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(26,20,14,0.38)",
              textDecoration: "underline",
            }}
          >
            CC BY 4.0
          </a>
        </p>
      </div>
    </>
  );
}
