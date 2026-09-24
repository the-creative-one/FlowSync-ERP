import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import ContactCTA from "../components/landing/ContactCTA";
import ContactHero from "../components/landing/ContactHero";
import ContactFormSection from "../components/landing/ContactFormSection";
import ContactProcess from "../components/landing/ContactProcess";
import ContactFAQ from "../components/landing/ContactFAQ";
import PageSEO from "../seo/PageSEO";

function Contact() {
  return (
    <>
      <PageSEO
        title="Contact | FlowSync"
        description="Get in touch with the FlowSync team for questions, feedback, support, or business inquiries."
        keywords="Contact FlowSync, FlowSync support, business inquiries, customer support"
      />
      <Navbar />
      <ContactHero />
      <ContactFormSection />
      <ContactProcess />
      <ContactFAQ />
      <ContactCTA />
      <Footer hasCTA />
    </>
  );
}

export default Contact;
