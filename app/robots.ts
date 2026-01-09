import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/hesabim", "/partner"],
    },
    sitemap: "http://localhost:3100/sitemap.xml",
  };
}


