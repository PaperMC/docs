import type { Config } from "@docusaurus/types";
import type { Options } from "@docusaurus/plugin-content-docs";
import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import vsDark from "prism-react-renderer/themes/vsDark";
import isCI from "is-ci";
import navbar from "./config/navbar.config";
import footer from "./config/footer.config";

const isPreview = process.env.DEPLOY_PREVIEW === "true";

const url = isPreview ? process.env.PREVIEW_URL : "https://docs.papermc.io";
const baseUrl = isPreview ? process.env.PREVIEW_BASE_URL : "/";
const completeUrl = url + baseUrl;

const docsCommon: Options = {
  breadcrumbs: true,
  editUrl: ({ docPath }) => `https://github.com/PaperMC/docs/blob/main/docs/${docPath}`,
  editCurrentVersion: true,
  remarkPlugins: [remarkA11yEmoji],
  showLastUpdateAuthor: true,
  showLastUpdateTime: true,
};

const config: Config = {
  title: "PaperMC Documentation",
  tagline:
    "Documentation for all projects under the PaperMC umbrella, including Paper, Velocity, and Waterfall.",
  url: url,
  baseUrl: baseUrl,
  onBrokenLinks: isCI ? "throw" : "warn",
  onBrokenMarkdownLinks: isCI ? "throw" : "warn",
  onDuplicateRoutes: isCI ? "throw" : "error",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  noIndex: isPreview,
  baseUrlIssueBanner: false,
  clientModules: [require.resolve("./src/css/custom.css")],

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

  themes: [
    [
      "classic",
      {
        respectPrefersColorScheme: true,
      },
    ],
    "@docusaurus/theme-search-algolia",
  ],

  plugins: [
    [
      "content-docs",
      {
        ...docsCommon,
        id: "misc",
        path: "docs/misc",
        routeBasePath: "/misc",
        sidebarPath: require.resolve("./config/sidebar.misc"),
      },
    ],
    [
      "content-docs",
      {
        ...docsCommon,
        id: "paper",
        path: "docs/paper",
        routeBasePath: "paper",
        sidebarPath: require.resolve("./config/sidebar.paper"),
      },
    ],
    [
      "content-docs",
      {
        ...docsCommon,
        id: "velocity",
        path: "docs/velocity",
        routeBasePath: "velocity",
        sidebarPath: require.resolve("./config/sidebar.velocity"),
      },
    ],
    [
      "content-docs",
      {
        ...docsCommon,
        id: "waterfall",
        path: "docs/waterfall",
        routeBasePath: "waterfall",
        sidebarPath: require.resolve("./config/sidebar.waterfall"),
      },
    ],
    [
      "content-pages",
      {
        remarkPlugins: [remarkA11yEmoji],
      },
    ],
    [
      "pwa",
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
    "debug",
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
    docs: {
      sidebar: {
        hideable: true,
      },
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
