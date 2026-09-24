import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import FeaturesHero from "../components/landing/FeaturesHero";
import CoreFeatures from "../components/landing/CoreFeatures";
import OperationalWorkflow from "../components/landing/OperationalWorkflow";
import SecurityAccess from "../components/landing/SecurityAccess";
import AIAssistant from "../components/landing/AIAssistant";
import ContactCTA from "../components/landing/ContactCTA";
import PageSEO from "../seo/PageSEO";

function FeaturesPage() {
  return (
    <>
      <PageSEO
        title="Features | FlowSync"
        description="Explore FlowSync features for order management, employee access control, analytics, reporting, and business operations."
        keywords="FlowSync features, business management features, order management, employee management, analytics, reporting"
      />
      <Navbar />
      <FeaturesHero />
      <CoreFeatures />
      <OperationalWorkflow />
      <AIAssistant />
      <SecurityAccess />
      <ContactCTA />
      <Footer hasCTA />
    </>
  );
}

export default FeaturesPage;
