import { Helmet } from "react-helmet-async";

const PageSEO = ({ title, description, keywords }) => {
  const siteUrl = window.location.origin;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`${siteUrl}${window.location.pathname}`} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${siteUrl}${window.location.pathname}`}
      />
      <meta property="og:site_name" content="FlowSync" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
export default PageSEO;
