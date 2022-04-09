import type { SidebarItemConfig } from "@docusaurus/plugin-content-docs/lib/sidebars/types";

export const sidebar: SidebarItemConfig[] = [
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
