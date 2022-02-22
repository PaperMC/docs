// @ts-check

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "PaperMC Documentation",
  tagline: "Documentation for projects within the PaperMC organization.",
  url: "https://docs.papermc.io",
  baseUrl: "/",
  onBrokenLinks: "error",
  onBrokenMarkdownLinks: "error",
  favicon: "img/favicon.ico",
  organizationName: "PaperMC",
  projectName: "docs",
  trailingSlash: false,

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
        docs: {
          remarkPlugins: [require("@fec/remark-a11y-emoji")],
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
      }),
    ],
  ],

  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
      },
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
            href: "https://papermc.io/downloads",
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
                href: "https://papermc.io/forums",
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
                label: "Github",
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
          "yaml",
          "properties",
        ],
        theme: require("prism-react-renderer/themes/github"),
        darkTheme: require("prism-react-renderer/themes/dracula"),
      },
    }),

  plugins: [
    [
      // TODO: investigate algolia docsearch? seems super nice and more official
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        docsDir: "docs",
        docsRouteBasePath: "/",
        indexDocs: true,
        indexPages: false,
        highlightSearchTermsOnTargetPage: false,
      },
    ],
  ],
};

module.exports = config;
