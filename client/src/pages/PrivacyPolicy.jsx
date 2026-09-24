import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import PrivacyPolicyContent from "../components/landing/PrivacyPolicyContent";
import PageSEO from "../seo/PageSEO";

function PrivacyPolicy() {
  return (
    <>
      <PageSEO
        title="Privacy Policy | FlowSync"
        description="Read the FlowSync Privacy Policy to understand how information is collected, used, and protected."
        keywords="FlowSync privacy policy, privacy, data protection, user data, data security"
      />
      <Navbar />
      <PrivacyPolicyContent />
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
