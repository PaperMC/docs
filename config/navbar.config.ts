import { Navbar } from "@docusaurus/theme-common";

// don't specify style or hideOnScroll here, we want it to be dynamic
const navbar: Omit<Navbar, "style" | "hideOnScroll"> = {
  logo: {
    src: "img/logo-marker-light.svg",
    srcDark: "img/logo-marker-dark.svg",
    width: 100,
    height: 32,
    alt: "PaperMC Docs",
  },
  items: [
    {
      type: "dropdown",
      label: "Paper",
      to: "/paper",
      position: "left",
      activeBaseRegex: "(\\/paper)(.+)?",
      items: [
        {
          label: "Administration",
          to: "/paper/admin",
          activeBaseRegex: "(\\/paper/)(?!dev)(.+)?",
        },
        {
          label: "Development",
          to: "/paper/dev",
          activeBaseRegex: "(\\/paper\\/dev)(.+)?",
        },
      ],
    },
    {
      type: "dropdown",
      label: "Velocity",
      to: "/velocity",
      position: "left",
      activeBaseRegex: "(\\/velocity)(.+)?",
      items: [
        {
          label: "Administration",
          to: "/velocity/admin",
          activeBaseRegex: "(\\/velocity/)(?!dev)(.+)?",
        },
        {
          label: "Development",
          to: "/velocity/dev",
          activeBaseRegex: "(\\/velocity\\/dev)(.+)?",
        },
      ],
    },
    {
      to: "waterfall",
      label: "Waterfall",
      position: "left",
    },
    {
      to: "misc",
      label: "Misc",
      position: "left",
    },
    {
      type: "docsVersionDropdown",
      docsPluginId: "paper",
      position: "right",
    },
    {
      to: "https://papermc.io/downloads",
      label: "Downloads",
      position: "right",
    },
    {
      href: "https://discord.gg/PaperMC",
      className: "header-icon-link header-discord-link",
      position: "right",
    },
    {
      href: "https://github.com/PaperMC",
      className: "header-icon-link header-github-link",
      position: "right",
    },
  ],
};

export default navbar;
