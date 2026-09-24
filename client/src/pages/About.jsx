import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import ContactCTA from "../components/landing/ContactCTA";
import AboutHero from "../components/landing/AboutHero";
import BuiltWithPurpose from "../components/landing/BuiltWithPurpose";
import WhyFlowSync from "../components/landing/WhyFlowSync";
import PageSEO from "../seo/PageSEO";

function About() {
  return (
    <>
      <PageSEO
        title="About | FlowSync"
        description="Learn about FlowSync and its approach to simplifying business operations, management, and productivity."
        keywords="About FlowSync, FlowSync, business management platform, business operations, productivity"
      />
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
