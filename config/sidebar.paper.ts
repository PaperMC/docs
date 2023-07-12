import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const paper: SidebarsConfig = {
  primary: [
    "README",
    {
      type: "category",
      label: "Administration",
      collapsed: true,
      link: {
        type: "doc",
        id: "admin/README",
      },
      items: [
        {
          type: "category",
          label: "Getting Started",
          link: {
            type: "generated-index",
            slug: "/cat/admin/getting-started",
          },
          items: [
            "admin/getting-started/getting-started",
            "admin/getting-started/adding-plugins",
            "admin/getting-started/migration",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          link: {
            type: "generated-index",
            slug: "/cat/admin/how-to-guides",
          },
          items: [
            "admin/how-to/basic-troubleshooting",
            "admin/how-to/update",
            "admin/how-to/aikars-flags",
            "admin/how-to/anti-xray",
          ],
        },
        {
          type: "category",
          label: "Reference",
          link: {
            type: "generated-index",
            slug: "/cat/admin/reference",
          },
          items: [
            {
              type: "category",
              label: "Paper Configuration",
              link: {
                type: "doc",
                id: "admin/reference/configuration/README",
              },
              items: [
                "admin/reference/configuration/global-configuration",
                "admin/reference/configuration/world-configuration",
              ],
            },
            "admin/reference/system-properties",
            "admin/reference/paper-plugins",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Development",
      collapsed: true,
      link: {
        type: "doc",
        id: "dev/README",
      },
      items: [
        {
          type: "category",
          label: "Getting started",
          collapsed: true,
          link: {
            type: "doc",
            id: "dev/getting-started/README",
          },
          items: [
            "dev/getting-started/project-setup",
            "dev/getting-started/plugin-yml",
            "dev/getting-started/paper-plugins",
          ],
        },
        {
          type: "category",
          label: "API",
          collapsed: true,
          link: {
            type: "doc",
            id: "dev/api/README",
          },
          items: [
            {
              type: "category",
              label: "Event API",
              collapsed: true,
              items: [
                "dev/api/event-api/event-listeners",
                "dev/api/event-api/custom-events",
                "dev/api/event-api/handler-lists",
              ],
            },
            {
              type: "category",
              label: "Component API",
              collapsed: true,
              items: [
                "dev/api/component-api/intro",
              ]
            },
            "dev/api/roadmap",
            "dev/api/pdc",
            "dev/api/custom-inventory-holder",
          ],
        },
        {
          type: "category",
          label: "Miscellaneous",
          collapsed: true,
          link: {
            type: "doc",
            id: "dev/misc/README",
          },
          items: [
            "dev/misc/reading-stacktraces",
            "dev/misc/debugging",
          ],
        },
      ],
    },
  ],
};

export = paper;
