import { Navbar } from "@docusaurus/theme-common";

// don't specify style or hideOnScroll here, we want it to be dynamic
const navbar: Omit<Navbar, "style" | "hideOnScroll"> = {
  logo: {
    src: "img/logo-marker-light.svg",
    srcDark: "img/logo-marker-dark.svg",
    height: 42, // when changing here, also change css
    width: 121,
    alt: "PaperMC Docs",
  },
  items: [
    {
      to: "/paper",
      label: "Paper",
      position: "left",
      activeBaseRegex: "\\/paper.*",
      modules: [
        {
          label: "Administration",
          to: "/paper/admin",
          activeBaseRegex: "\\/paper/(?!(dev|contributing)).*",
        },
        {
          label: "Development",
          to: "/paper/dev",
          activeBaseRegex: "\\/paper\\/dev.*",
        },
        {
          label: "Contributing",
          to: "/paper/contributing",
          activeBaseRegex: "\\/paper\\/contributing.*",
        },
      ],
    },
    {
      to: "/folia",
      label: "Folia",
      position: "left",
      activeBaseRegex: "(\\/folia)(.+)?",
      modules: [
        {
          label: "Administration",
          to: "/folia/admin",
          activeBaseRegex: "(\\/folia/)(?!dev)(.+)?",
        },
        {
          label: "Development",
          to: "/folia/dev",
          activeBaseRegex: "\\/folia\\/dev.*",
        },
      ],
    },
    {
      to: "/velocity",
      label: "Velocity",
      position: "left",
      activeBaseRegex: "\\/velocity.*",
      modules: [
        {
          label: "Administration",
          to: "/velocity/admin",
          activeBaseRegex: "\\/velocity/(?!dev).*",
        },
        {
          label: "Development",
          to: "/velocity/dev",
          activeBaseRegex: "\\/velocity\\/dev.*",
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
