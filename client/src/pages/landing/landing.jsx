import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import Modes from "../../components/Modes";
import Features from "../../components/Features";
import Trust from "../../components/Trust";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function Landing() {
  return (
    <div className="landing-page">

      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <Modes />
        <Features />
        <Trust />
        <CTA />
      </main>

      <Footer />

    </div>
  );
}