import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Workflow from "../components/landing/Workflow";
import AnalyticsShowcase from "../components/landing/AnalyticsShowcase";
import ContactCTA from "../components/landing/ContactCTA";
import Footer from "../components/landing/Footer";
import PageSEO from "../seo/PageSEO";

function Home() {
  return (
    <>
      <PageSEO
        title="FlowSync | Business Management Platform"
        description="FlowSync helps businesses manage orders, employees, analytics, and daily operations from one centralized platform."
        keywords="FlowSync, business management platform, ERP software, order management, employee management, business analytics"
      />
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
