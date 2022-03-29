import type { Navbar } from "@docusaurus/theme-common";

const navbar: Navbar = {
  title: "PaperMC Docs",
  hideOnScroll: true,
  style: "dark",
  logo: {
    src: "img/logo.svg",
    alt: "PaperMC Logo",
  },
  items: [
    {
      to: "paper",
      label: "Paper",
      position: "left",
    },
    {
      to: "velocity",
      label: "Velocity",
      position: "left",
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
