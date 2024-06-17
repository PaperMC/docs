import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const waterfall: SidebarsConfig = {
  primary: [
    {
      type: "category",
      label: "Welcome to the Waterfall Docs",
      collapsed: false,
      collapsible: false,
      link: {
        type: "doc",
        id: "README",
      },
      items: ["getting-started", "configuration"],
    },
  ],
};

export = waterfall;
