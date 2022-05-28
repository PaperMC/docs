import type { Footer } from "@docusaurus/theme-common";

const footer: Footer = {
  style: "dark",
  links: [
    {
      title: "Community",
      items: [
        {
          label: "Discord",
          href: "https://discord.gg/papermc",
        },
        {
          label: "Forums",
          href: "https://forums.papermc.io",
        },
        {
          label: "IRC",
          href: "https://webchat.esper.net/?channels=paper",
        },
      ],
    },
    {
      title: "Documentation",
      items: [
        {
          label: "Javadoc",
          href: "https://papermc.io/javadocs",
        },
        {
          label: "Docs",
          href: "/",
        },
        {
          label: "Downloads API",
          href: "https://api.papermc.io/docs",
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          label: "Main Site",
          href: "https://papermc.io",
        },
        {
          label: "GitHub",
          href: "https://github.com/PaperMC",
        },
      ],
    },
  ],
  copyright: `Copyright © ${new Date().getFullYear()} PaperMC and Contributors. Built with Docusaurus.`,
};

export default footer;
