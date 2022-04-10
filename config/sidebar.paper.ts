import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const paper: SidebarsConfig = {
  primary: [
    "README",
    {
      type: "category",
      label: "Server Administrators",
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
            type: "doc",
            id: "admin/getting-started/README",
          },
          items: [
            {
              type: "ref",
              id: "admin/getting-started/README",
            },
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
            "admin/how-to/per-world-configuration",
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
            "admin/reference/paper-global-configuration",
            "admin/reference/paper-per-world-configuration",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Developer's Guide",
      collapsed: true,
      link: {
        type: "doc",
        id: "dev/README",
      },
      items: [
        {
          type: "ref",
          id: "dev/README",
        },
      ],
    },
  ],
};

export = paper;
