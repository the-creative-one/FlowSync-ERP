import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import ContactCTA from "../components/landing/ContactCTA";
import ContactHero from "../components/landing/ContactHero";
import ContactFormSection from "../components/landing/ContactFormSection";
import ContactProcess from "../components/landing/ContactProcess";
import ContactFAQ from "../components/landing/ContactFAQ";

function Contact() {
  return (
    <>
      <Navbar />
      <ContactHero />
      <ContactFormSection />
      <ContactProcess />
      <ContactFAQ />
      <ContactCTA />
      <Footer />
    </>
  );
}

export default Contact;
