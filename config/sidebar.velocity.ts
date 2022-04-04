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
        "getting-started/why-velocity",
        "getting-started/forwarding",
        "getting-started/faq",
      ],
    },
    {
      type: "category",
      label: "How-to Guides",
      items: ["how-to/security", "how-to/tuning", "how-to/migration"],
    },
    {
      type: "category",
      label: "Reference",
      items: [
        "reference/configuration",
        "reference/commands",
        "reference/server-compatibility",
        "reference/comparison",
        "reference/libraries",
      ],
    },
    {
      type: "category",
      label: "Developers",
      link: {
        type: "doc",
        id: "developers/README",
      },
      items: [
        { type: "ref", id: "developers/README" },
        {
          type: "category",
          label: "Getting Started",
          items: [
            "developers/getting-started/creating-your-first-plugin",
            "developers/getting-started/api-basics",
            "developers/getting-started/pitfalls",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          items: ["developers/how-to/dependencies", "developers/how-to/porting-from-velocity-1"],
        },
        {
          type: "category",
          label: "API",
          items: ["developers/api/event", "developers/api/command", "developers/api/scheduler"],
        },
      ],
    },
  ],
};

export = sidebars;
