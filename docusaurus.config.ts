import type { Config } from "@docusaurus/types";
import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import vsDark from "prism-react-renderer/themes/vsDark";
import isCI from "is-ci";
import navbar from "./config/navbar.config";
import footer from "./config/footer.config";

const isPreview = process.env.DEPLOY_PREVIEW === "true";

const url = isPreview ? process.env.PREVIEW_URL : "https://docs.papermc.io";
const baseUrl = isPreview ? process.env.PREVIEW_BASE_URL : "/";
const completeUrl = url + baseUrl;

const config: Config = {
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

  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve("swc-loader"),
      options: {
        minify: true,
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
        },
        module: {
          type: isServer ? "commonjs" : "es6",
        },
      },
    }),
  },

  presets: [
    [
      "classic",
      {
        debug: !isCI || isPreview,
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
        docs: {
          editUrl: ({ docPath }) => `https://github.com/PaperMC/docs/blob/main/docs/${docPath}`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarCollapsible: true,
          remarkPlugins: [remarkA11yEmoji],
          routeBasePath: "/",
          sidebarPath: require.resolve("./config/sidebars.config"),
        },
        blog: false,
      },
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

  themeConfig: {
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
    navbar: navbar,
    footer: footer,
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
      theme: vsDark,
    },
    algolia: {
      appId: "P1BCDPTG1Q",
      apiKey: "34772712950f27c6e9c714ad2e6c5e16",
      indexName: "docs-papermc",
    },
  },
};

export = config;
