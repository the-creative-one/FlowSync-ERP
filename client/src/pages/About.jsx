import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import ContactCTA from "../components/landing/ContactCTA";
import AboutHero from "../components/landing/AboutHero";
import BuiltWithPurpose from "../components/landing/BuiltWithPurpose";
import WhyFlowSync from "../components/landing/WhyFlowSync";

function About() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <BuiltWithPurpose />
      <WhyFlowSync />
      <ContactCTA />
      <Footer hasCTA />
    </>
  );
}

export default About;
