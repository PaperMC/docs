import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "link",
      label: "Support Discord",
      href: "https://discord.gg/papermc",
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
            "paper/getting-started/README",
            "paper/getting-started/adding-plugins",
            "paper/getting-started/migration",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          items: [
            "paper/how-to/per-world-configuration",
            "paper/how-to/update",
            "paper/how-to/aikars-flags",
          ],
        },
        {
          type: "category",
          label: "Reference",
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
            "velocity/getting-started/README",
            "velocity/getting-started/why-velocity",
            "velocity/getting-started/forwarding",
            "velocity/getting-started/faq",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          items: [
            "velocity/how-to/security",
            "velocity/how-to/tuning",
            "velocity/how-to/migration",
          ],
        },
        {
          type: "category",
          label: "Reference",
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
            "velocity/developers/README",
            {
              type: "category",
              label: "Getting Started",
              items: [
                "velocity/developers/getting-started/creating-your-first-plugin",
                "velocity/developers/getting-started/api-basics",
                "velocity/developers/getting-started/pitfalls",
              ],
            },
            {
              type: "category",
              label: "How-to Guides",
              items: [
                "velocity/developers/how-to/dependencies",
                "velocity/developers/how-to/porting-from-velocity-1",
              ],
            },
            {
              type: "category",
              label: "API",
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
      items: ["common/java-install"],
    },
    {
      type: "category",
      label: "PaperMC",
      items: ["papermc/downloads-api", "papermc/assets", "papermc/contact"],
    },
  ],
};

export = sidebars;
