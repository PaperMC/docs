import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL?: URL) => {
  let content = `User-agent: *\nAllow: /\n`;
  if (sitemapURL) {
    content += `\nSitemap: ${sitemapURL.href}\n`;
  }

  return content;
};

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = site ? new URL("sitemap-index.xml", site) : undefined;
  return new Response(getRobotsTxt(sitemapURL));
};
