import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from "../components/Hero";
import SectionFeatures from "../components/SectionFeatures";
import SectionCta from "../components/SectionCta";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <SectionFeatures />

      {/* CTA Section */}
      <SectionCta />

      {/* Footer */}
      <Footer />
    </div>
  );
}
