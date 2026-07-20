import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Workflow from "../components/landing/Workflow";
import AnalyticsShowcase from "../components/landing/AnalyticsShowcase";
import ContactCTA from "../components/landing/ContactCTA";
import Footer from "../components/landing/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <AnalyticsShowcase />
      <ContactCTA />
      <Footer hasCTA />
    </>
  );
}

export default Home;
