import { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebarType: SidebarsConfig = {
  sidebar: [],
};

export const sidebar: typeof sidebarType.sidebar = [
  {
    type: "category",
    collapsed: true,
    label: "Getting Help",
    items: [
      {
        type: "link",
        label: "Discord",
        href: "https://discord.gg/papermc",
      },
      {
        type: "link",
        label: "Forums",
        href: "https://forums.papermc.io",
      },
    ],
  },
];
