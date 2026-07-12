import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import ScrollFx from "@/components/ScrollFx";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";

// Below-the-fold sections are code-split and lazy-loaded to keep the
// first paint lean (Core Web Vitals — this is an SEO's own site, after all).
const About = dynamic(() => import("@/components/sections/About"));
const Services = dynamic(() => import("@/components/sections/Services"));
const HallBand = dynamic(() => import("@/components/sections/HallBand"));
const Results = dynamic(() => import("@/components/sections/Results"));
const Process = dynamic(() => import("@/components/sections/Process"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const Footer = dynamic(() => import("@/components/sections/Footer"));
const SoundToggle = dynamic(() => import("@/components/SoundToggle"));

export default function Home() {
  return (
    <main>
      <Preloader />
      <CustomCursor />
      <ScrollFx />
      <Nav />

      <Hero />
      <About />
      <Services />
      <HallBand />
      <Results />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />

      <SoundToggle />
    </main>
  );
}
