import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Getting Help",
      items: [
        {
          type: "link",
          label: "Discord",
          href: "https://discord.gg/papermc",
        },
        {
          type: "link",
          label: "Forums",
          href: "https://forums.papermc.io",
        },
      ],
    },
    "README",
    {
      type: "category",
      label: "Paper",
      link: {
        type: "doc",
        id: "paper/README",
      },
      items: [
        {
          type: "category",
          label: "Getting Started",
          link: {
            type: "doc",
            id: "paper/getting-started/README",
          },
          items: [
            { type: "ref", id: "paper/getting-started/README" },
            "paper/getting-started/adding-plugins",
            "paper/getting-started/migration",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          link: {
            type: "generated-index",
            slug: "/category/paper/how-to-guides",
          },
          items: [
            "paper/how-to/per-world-configuration",
            "paper/how-to/anti-xray",
            "paper/how-to/update",
            "paper/how-to/aikars-flags",
          ],
        },
        {
          type: "category",
          label: "Reference",
          link: {
            type: "generated-index",
            slug: "/category/paper/reference",
          },
          items: [
            "paper/reference/paper-global-configuration",
            "paper/reference/paper-per-world-configuration",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Velocity",
      link: {
        type: "doc",
        id: "velocity/README",
      },
      items: [
        {
          type: "category",
          label: "Getting Started",
          link: {
            type: "doc",
            id: "velocity/getting-started/README",
          },
          items: [
            { type: "ref", id: "velocity/getting-started/README" },
            "velocity/getting-started/why-velocity",
            "velocity/getting-started/forwarding",
            "velocity/getting-started/faq",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          link: {
            type: "generated-index",
            slug: "/category/velocity/how-to-guides",
          },
          items: [
            "velocity/how-to/security",
            "velocity/how-to/tuning",
            "velocity/how-to/migration",
          ],
        },
        {
          type: "category",
          label: "Reference",
          link: {
            type: "generated-index",
            slug: "/category/velocity/reference",
          },
          items: [
            "velocity/reference/configuration",
            "velocity/reference/commands",
            "velocity/reference/server-compatibility",
            "velocity/reference/comparison",
            "velocity/reference/libraries",
          ],
        },
        {
          type: "category",
          label: "Developers",
          link: {
            type: "doc",
            id: "velocity/developers/README",
          },
          items: [
            { type: "ref", id: "velocity/developers/README" },
            {
              type: "category",
              label: "Getting Started",
              link: {
                type: "generated-index",
                slug: "/category/velocity/developers/getting-started",
              },
              items: [
                "velocity/developers/getting-started/creating-your-first-plugin",
                "velocity/developers/getting-started/api-basics",
                "velocity/developers/getting-started/pitfalls",
              ],
            },
            {
              type: "category",
              label: "How-to Guides",
              link: {
                type: "generated-index",
                slug: "/category/velocity/developers/how-to-guides",
              },
              items: [
                "velocity/developers/how-to/dependencies",
                "velocity/developers/how-to/porting-from-velocity-1",
              ],
            },
            {
              type: "category",
              label: "API",
              link: {
                type: "generated-index",
                slug: "/category/velocity/developers/api",
              },
              items: [
                "velocity/developers/api/event",
                "velocity/developers/api/command",
                "velocity/developers/api/scheduler",
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Waterfall",
      link: {
        type: "doc",
        id: "waterfall/README",
      },
      items: ["waterfall/getting-started", "waterfall/configuration"],
    },
    {
      type: "category",
      label: "Common",
      link: {
        type: "generated-index",
        slug: "/category/common",
        description: "Documentation relevant to all PaperMC projects.",
      },
      items: ["common/java-install"],
    },
    {
      type: "category",
      label: "PaperMC",
      link: {
        type: "generated-index",
        slug: "/category/papermc",
        description: "Information about the PaperMC Organization.",
      },
      items: ["papermc/downloads-api", "papermc/assets", "papermc/contact"],
    },
  ],
};

export = sidebars;
