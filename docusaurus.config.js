// @ts-check

const isCI = process.env.CI === "true";
const isPreview = process.env.DEPLOY_PREVIEW === "true";

const url = isPreview ? process.env.PREVIEW_URL : "https://docs.papermc.io";
const baseUrl = isPreview ? process.env.PREVIEW_BASE_URL : "/";
const completeUrl = url + baseUrl;

/** @type {import("@docusaurus/types").Config} */
const base = {
  title: "PaperMC Documentation",
  tagline: "Documentation for projects within the PaperMC organization.",
  customFields: {
    description:
      "Documentation for all projects under the PaperMC umbrella, including Paper, Velocity, and Waterfall.",
  },
  url: url,
  baseUrl: baseUrl,
  onBrokenLinks: isCI ? "throw" : "warn",
  onBrokenMarkdownLinks: isCI ? "throw" : "warn",
  onDuplicateRoutes: isCI ? "throw" : "error",
  favicon: "img/favicon.ico",
  organizationName: "PaperMC",
  projectName: "docs",
  trailingSlash: false,
  noIndex: isPreview,

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        debug: !isCI || isPreview,
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
        docs: {
          editUrl: ({ docPath }) => `https://github.com/PaperMC/docs/blob/main/docs/${docPath}`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarCollapsible: true,
          remarkPlugins: [require("@fec/remark-a11y-emoji")],
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-pwa",
      {
        offlineModeActivationStrategies: ["appInstalled", "standalone", "queryString"],
        pwaHead: [
          {
            tagName: "link",
            rel: "icon",
            href: "img/paper.png",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "/manifest.json",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "rgb(0, 78, 233)",
          },
        ],
      },
    ],
    [
      "custom-tags",
      {
        headTags: [
          {
            tagName: "script",
            attributes: {
              type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: completeUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${completeUrl}search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: "img/og-image.png",
      metadata: [
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:image:alt",
          content: "PaperMC Logo",
        },
      ],
      navbar: {
        title: "PaperMC Docs",
        logo: {
          alt: "PaperMC Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "paper",
            label: "Paper",
            position: "left",
          },
          {
            to: "velocity",
            label: "Velocity",
            position: "left",
          },
          {
            to: "waterfall",
            label: "Waterfall",
            position: "left",
          },
          {
            to: "https://papermc.io/downloads",
            label: "Downloads",
            position: "right",
          },
          {
            href: "https://discord.gg/PaperMC",
            className: "header-icon-link header-discord-link",
            position: "right",
          },
          {
            href: "https://github.com/PaperMC",
            className: "header-icon-link header-github-link",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/papermc",
              },
              {
                label: "Forums",
                href: "https://forums.papermc.io",
              },
              {
                label: "IRC",
                href: "https://webchat.esper.net/?channels=paper",
              },
            ],
          },
          {
            title: "Documentation",
            items: [
              {
                label: "Javadoc",
                href: "https://papermc.io/javadocs",
              },
              {
                label: "Docs",
                href: "/",
              },
              {
                label: "Downloads API",
                href: "https://papermc.io/api/docs",
              },
            ],
          },
          {
            title: "Other",
            items: [
              {
                label: "Main Site",
                href: "https://papermc.io",
              },
              {
                label: "GitHub",
                href: "https://github.com/PaperMC",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} PaperMC and Contributors`,
      },
      prism: {
        additionalLanguages: [
          "batch",
          "bash",
          "git",
          "java",
          "javastacktrace",
          "kotlin",
          "groovy",
          "log",
          "toml",
          "properties",
        ],
        theme: require("prism-react-renderer/themes/vsDark"),
      },
      algolia: {
        appId: "P1BCDPTG1Q",
        apiKey: "34772712950f27c6e9c714ad2e6c5e16",
        indexName: "docs-papermc",
      },
    }),
};

async function config() {
  return base;
}

module.exports = config;
