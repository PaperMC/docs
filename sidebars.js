// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "link",
      label: "Support Discord",
      href: "https://discord.gg/papermc",
    },
    "README",
    {
      type: "category",
      label: "Paper",
      link: {
        type: "doc",
        id: "paper/README",
      },
      items: [
        {
          type: "category",
          label: "Reference",
          link: {
            type: "generated-index",
          },
          items: ["paper/reference/paper-yml"],
        },
        {
          type: "category",
          label: "Tutorials",
          link: {
            type: "generated-index",
          },
          items: ["paper/tutorial/update", "paper/tutorial/aikars-flags"],
        },
        {
          type: "category",
          label: "How-to Guides",
          link: {
            type: "generated-index",
          },
          items: ["paper/how-to/getting-started"],
        },
      ],
    },
    {
      type: "category",
      label: "Velocity",
      link: {
        type: "doc",
        id: "velocity/README",
      },
      items: [
        {
          type: "category",
          label: "User's Guide",
          link: {
            type: "doc",
            id: "velocity/users/README",
          },
          items: [
            "velocity/users/getting-started",
            "velocity/users/what-does-velocity-do-for-me",
            "velocity/users/configuration",
            "velocity/users/server-compatibility",
            "velocity/users/comparison",
            "velocity/users/forwarding",
            "velocity/users/commands",
            "velocity/users/faq",
            "velocity/users/migration",
          ],
        },
        {
          type: "category",
          label: "Developer's Guide",
          link: {
            type: "doc",
            id: "velocity/developers/README",
          },
          items: [
            "velocity/developers/creating-your-first-plugin",
            "velocity/developers/api-basics",
            "velocity/developers/event-api",
            "velocity/developers/command-api",
            "velocity/developers/task-scheduling",
            "velocity/developers/dependencies",
            "velocity/developers/pitfalls",
            "velocity/developers/porting-from-velocity-1",
          ],
        },
        {
          type: "category",
          label: "Deployment Guide",
          link: {
            type: "doc",
            id: "velocity/deployment/README",
          },
          items: ["velocity/deployment/security", "velocity/deployment/tuning"],
        },
        {
          type: "category",
          label: "Misc",
          link: {
            type: "doc",
            id: "velocity/misc/credits",
          },
          items: ["velocity/misc/credits"],
        },
      ],
    },
    {
      type: "category",
      label: "Waterfall",
      link: {
        type: "doc",
        id: "waterfall/README",
      },
      items: ["waterfall/configuration"],
    },
  ],
};

module.exports = sidebars;
