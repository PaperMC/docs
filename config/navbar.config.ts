import { Navbar } from "@docusaurus/theme-common";

// don't specify style or hideOnScroll here, we want it to be dynamic
const navbar: Omit<Navbar, "style" | "hideOnScroll"> = {
  title: "PaperMC Docs",
  logo: {
    src: "img/logo.svg",
    alt: "PaperMC Logo",
  },
  items: [
    {
      type: "dropdown",
      label: "Paper",
      position: "left",
      items: [
        {
          type: "doc",
          label: "Server Administrator",
          docId: "paper/README",
        },
        {
          type: "doc",
          label: "Developer",
          docId: "dev/paper/README",
        },
      ],
    },
    {
      type: "dropdown",
      label: "Velocity",
      position: "left",
      items: [
        {
          type: "doc",
          label: "Server Administrator",
          docId: "velocity/README",
        },
        {
          type: "doc",
          label: "Developer",
          docId: "dev/velocity/README",
        },
      ],
    },
    {
      to: "waterfall",
      label: "Waterfall",
      position: "left",
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
