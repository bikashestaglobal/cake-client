import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title, description, keywords, children }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta name="keywords" content={keywords}></meta>
      {children}
    </Helmet>
  );
};

export default SEO;
