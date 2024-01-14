import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const misc: SidebarsConfig = {
  primary: [
    {
      type: "category",
      label: "Miscellaneous Documentation",
      collapsed: false,
      collapsible: false,
      link: {
        type: "doc",
        id: "README",
      },
      items: [
        "java-install",
        "downloads-api",
        "hangar-publishing",
        "assets",
        "contact",
      ],
    }
  ],
};

export = misc;
