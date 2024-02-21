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
  copyright: `Copyright © ${new Date().getFullYear()} PaperMC and Contributors. Built with Docusaurus.<a href="https://vercel.com/?utm_source=papermc&utm_campaign=oss" style="text-decoration:underline;color:inherit;margin-top:10px;"><img src="/img/powered-by-vercel.svg" alt="vercel"/></a>`,
};

export default footer;
