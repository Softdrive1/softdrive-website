import Navbar from "./components/Navbar";
import DitherBackground from "./components/DitherBackground";
import HeroSection from "./components/HeroSection";
import HardDriveSection from "./components/HardDriveSection";
import ReleasesSection from "./components/ReleasesSection";
import SynthSection from "./components/SynthSection";
import SetsSection from "./components/SetsSection";
import PhotoMarquee from "./components/PhotoMarquee";
import AboutSection from "./components/AboutSection";
import DemoDropSection from "./components/DemoDropSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <DitherBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main>
          <HeroSection />
          <HardDriveSection />
          <ReleasesSection />
          <SynthSection />
          <SetsSection />
          <PhotoMarquee />
          <AboutSection />
          <DemoDropSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
