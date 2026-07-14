import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import FeaturesHero from "../components/landing/FeaturesHero";
import CoreFeatures from "../components/landing/CoreFeatures";
import OperationalWorkflow from "../components/landing/OperationalWorkflow";
import SecurityAccess from "../components/landing/SecurityAccess";
import ContactCTA from "../components/landing/ContactCTA";

function FeaturesPage() {
  return (
    <>
      <Navbar />
      <FeaturesHero />
      <CoreFeatures />
      <OperationalWorkflow />
      <SecurityAccess />
      <ContactCTA />
      <Footer />
    </>
  );
}

export default FeaturesPage;
