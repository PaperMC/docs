import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { sidebar } from "./common";

const sidebars: SidebarsConfig = {
  primary: [
    ...sidebar,
    "README",
    {
      type: "category",
      label: "Getting Started",
      link: {
        type: "doc",
        id: "getting-started/README",
      },
      items: [
        { type: "ref", id: "getting-started/README" },
        "getting-started/adding-plugins",
        "getting-started/migration",
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
        "how-to/per-world-configuration",
        "how-to/update",
        "how-to/aikars-flags",
        "how-to/anti-xray",
      ],
    },
    {
      type: "category",
      label: "Reference",
      link: {
        type: "generated-index",
        slug: "/category/paper/reference",
      },
      items: ["reference/paper-global-configuration", "reference/paper-per-world-configuration"],
    },
  ],
};

export = sidebars;
