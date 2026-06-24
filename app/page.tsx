import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HardDriveSection from "./components/HardDriveSection";
import ReleasesSection from "./components/ReleasesSection";
import SetsSection from "./components/SetsSection";
import AboutSection from "./components/AboutSection";
import LinksSection from "./components/LinksSection";
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
        <AboutSection />
        <LinksSection />
        <Footer />
      </main>
    </>
  );
}
