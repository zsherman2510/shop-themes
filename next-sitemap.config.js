/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://your-domain.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    "/admin/*",
    "/api/*",
    "/auth/*",
    "/success",
    "/error",
    "/server-sitemap.xml",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/success", "/error"],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom transform function (optional)
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
