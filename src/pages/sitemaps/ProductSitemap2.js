import { useEffect } from "react";
import Config from "../../config/Config";

function ProductSitemap() {
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/product?skip=0&limit=0`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Generate XML for the sitemap
        const xml = generateSitemap(data.body);

        // Serve XML as the response
        const blob = new Blob([xml], { type: "text/xml" });
        const url = URL.createObjectURL(blob);
        window.location.assign(url);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  // Function to generate XML for the sitemap
  const generateSitemap = (posts) => {
    console.log(posts);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Add each post to the sitemap
    posts.forEach((post) => {
      xml += `<url><loc>https://thecakeinc.com/product/${post.slug}</loc><lastmod>${post.updatedAt}</lastmod></url>`;
    });

    xml += "</urlset>";
    return xml;
  };

  return null; // Since this component doesn't render anything visible
}

export default ProductSitemap;
