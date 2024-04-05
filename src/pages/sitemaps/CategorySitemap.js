import { useEffect, useState } from "react";
import Config from "../../config/Config";
import XMLViewer from "react-xml-viewer";

function CategorySitemap() {
  const [sitemap, setSitemap] = useState("");

  useEffect(() => {
    fetch(`${Config.SERVER_URL}/sitemaps/categories`)
      .then((response) => response.text()) // Extract the text from the response
      .then((response) => {
        setSitemap(response);
      })
      .catch((error) => {
        console.error("Error fetching sitemap:", error);
      });
  }, []);

  return <XMLViewer xml={sitemap} />;
}

export default CategorySitemap;
