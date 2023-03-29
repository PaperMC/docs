import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const folia: SidebarsConfig = {
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
            "admin/reference/faq",
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
          label: "Reference",
          collapsed: true,
          link: {
            type: "generated-index",
            slug: "/cat/dev/reference",
          },
          items: [
            "admin/reference/overview",
            "admin/reference/region-logic",
          ],
        },
      ],
    },
  ],
};

export = folia;
