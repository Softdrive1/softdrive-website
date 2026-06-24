import HeroSection from "./components/HeroSection";
import VideoHero from "./components/VideoHero";
import TracksSection from "./components/TracksSection";
import LinksSection from "./components/LinksSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <VideoHero />
      <TracksSection />
      <LinksSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
