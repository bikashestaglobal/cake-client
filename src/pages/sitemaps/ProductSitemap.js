import { useEffect, useState } from "react";
import Config from "../../config/Config";
import XMLViewer from "react-xml-viewer";
import { create } from "xmlbuilder2";

function ProductSitemap() {
  //   const [sitemap, setSitemap] = useState("");

  //   useEffect(() => {
  //     fetch(`${Config.SERVER_URL}/sitemaps/products`)
  //       .then((response) => response.text()) // Extract the text from the response
  //       .then((response) => {
  //         setSitemap(response);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching sitemap:", error);
  //       });
  //   }, []);

  //   return <XMLViewer xml={sitemap} />;

  const generateSitemap = () => {
    const xml = create({ version: "1.0" }).ele("urlset", {
      xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
    });

    // Add URLs to the sitemap (you can replace this with your dynamic data)
    const urls = [
      { loc: "http://example.com/page1", lastmod: "2024-03-26" },
      { loc: "http://example.com/page2", lastmod: "2024-03-25" },
      // Add more URLs as needed...
    ];

    urls.forEach((url) => {
      const { loc, lastmod } = url;
      const urlElement = xml.ele("url");
      urlElement.ele("loc").txt(loc);
      urlElement.ele("lastmod").txt(lastmod);
    });

    return xml.end({ prettyPrint: true });
  };

  return (
    <div>
      <h1>Sitemap.xml</h1>
      <pre>{generateSitemap()}</pre>
    </div>
  );
}

export default ProductSitemap;
