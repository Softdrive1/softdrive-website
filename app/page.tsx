import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HardDriveSection from "./components/HardDriveSection";
import ReleasesSection from "./components/ReleasesSection";
import SetsSection from "./components/SetsSection";
import PhotoMarquee from "./components/PhotoMarquee";
import AboutSection from "./components/AboutSection";
import DemoDropSection from "./components/DemoDropSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HardDriveSection />
        <ReleasesSection />
        <SetsSection />
        <PhotoMarquee />
        <AboutSection />
        <DemoDropSection />
      </main>
      <Footer />
    </>
  );
}
