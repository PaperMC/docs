import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  admin: [
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
            slug: "category//paper/how-to-guides",
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
            slug: "category//paper/reference",
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
            slug: "category//velocity/how-to-guides",
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
            slug: "category//velocity/reference",
          },
          items: [
            "velocity/reference/configuration",
            "velocity/reference/commands",
            "velocity/reference/server-compatibility",
            "velocity/reference/comparison",
            "velocity/reference/libraries",
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
        slug: "category/common",
        description: "Documentation relevant to all PaperMC projects.",
      },
      items: ["common/java-install", "common/downloads-api", "common/assets", "common/contact"],
    },
  ],
  dev: [
    {
      type: "category",
      label: "Paper",
      link: {
        type: "doc",
        id: "dev/paper/README",
      },
      items: [
        {
          type: "ref",
          id: "dev/paper/README",
        },
      ],
    },
    {
      type: "category",
      label: "Velocity",
      link: {
        type: "doc",
        id: "dev/velocity/README",
      },
      items: [
        {
          type: "ref",
          id: "dev/velocity/README",
        },
        {
          type: "category",
          label: "Getting Started",
          link: {
            type: "generated-index",
            slug: "category/dev/velocity/getting-started",
          },
          items: [
            "dev/velocity/getting-started/creating-your-first-plugin",
            "dev/velocity/getting-started/api-basics",
            "dev/velocity/getting-started/pitfalls",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          link: {
            type: "generated-index",
            slug: "category/dev/velocity/how-to-guides",
          },
          items: [
            "dev/velocity/how-to/dependencies",
            "dev/velocity/how-to/porting-from-velocity-1",
          ],
        },
        {
          type: "category",
          label: "API",
          link: {
            type: "generated-index",
            slug: "category/dev/velocity/api",
          },
          items: [
            "dev/velocity/api/event",
            "dev/velocity/api/command",
            "dev/velocity/api/scheduler",
          ],
        },
      ],
    },
  ],
};

export = sidebars;
