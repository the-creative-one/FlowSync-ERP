import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import TermsConditionsContent from "../components/landing/TermsConditionsContent";
import PageSEO from "../seo/PageSEO";

function TermsConditions() {
  return (
    <>
      <PageSEO
        title="Terms and Conditions | FlowSync"
        description="Read the terms and conditions governing the use of the FlowSync platform and its services."
        keywords="FlowSync terms and conditions, terms of service, platform terms, user agreement"
      />
      <Navbar />
      <TermsConditionsContent />
      <Footer />
    </>
  );
}

export default TermsConditions;
