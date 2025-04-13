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
        {
          type: "category",
          label: "Tools",
          collapsed: false,
          collapsible: true,
          link: {
            type: "doc",
            id: "tools/index",
          },
          items: [
            "tools/start-script-gen",
            "tools/minimessage-web-editor",
            "tools/item-command-converter",
            "tools/diff-viewer",
          ],
        },
        "java-install",
        "downloads-api",
        "hangar-publishing",
        "assets",
        "contact",
      ],
    },
  ],
};

export = misc;
