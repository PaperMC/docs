import type { Footer } from "@docusaurus/theme-common";
import { execSync } from "child_process";

let currentCommit: string;
try {
  currentCommit = execSync("git rev-parse HEAD").toString().slice(0, 7).trim();
} catch (error) {
  console.error("Failed to get the current commit:", error);
  currentCommit = "unknown";
}

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
  copyright: `Copyright © ${new Date().getFullYear()} PaperMC and Contributors. Built with Docusaurus.<div> <a href="https://github.com/PaperMC/docs/">PaperMC/docs</a> @ <a href="https://github.com/PaperMC/docs/commit/${currentCommit}">${currentCommit}</a></div>`,
};

export default footer;
