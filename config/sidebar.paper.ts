import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const paper: SidebarsConfig = {
  primary: [
    "README",
    {
      type: "category",
      label: "Administration",
      collapsed: true,
      link: {
        type: "doc",
        id: "admin/README",
      },
      items: [
        {
          type: "category",
          label: "Getting Started",
          link: {
            type: "generated-index",
            slug: "/cat/admin/getting-started",
          },
          items: [
            "admin/getting-started/getting-started",
            "admin/getting-started/adding-plugins",
            "admin/getting-started/migration",
          ],
        },
        {
          type: "category",
          label: "How-to Guides",
          link: {
            type: "generated-index",
            slug: "/cat/admin/how-to-guides",
          },
          items: [
            "admin/how-to/basic-troubleshooting",
            "admin/how-to/update",
            "admin/how-to/aikars-flags",
            "admin/how-to/anti-xray",
          ],
        },
        {
          type: "category",
          label: "Reference",
          link: {
            type: "generated-index",
            slug: "/cat/admin/reference",
          },
          items: [
            {
              type: "category",
              label: "Configuration",
              link: {
                type: "doc",
                id: "admin/reference/configuration/README",
              },
              items: [
                "admin/reference/configuration/global-configuration",
                "admin/reference/configuration/world-configuration",
                "admin/reference/configuration/server-properties",
                "admin/reference/configuration/spigot-configuration",
                "admin/reference/configuration/bukkit-configuration",
                "admin/reference/configuration/bukkit-commands-configuration",
              ],
            },
            "admin/reference/system-properties",
            "admin/reference/paper-plugins",
          ],
        },
        {
          type: "category",
          label: "Miscellaneous",
          link: {
            type: "generated-index",
            slug: "/cat/admin/misc",
          },
          items: [
            "admin/misc/faq",
            "admin/misc/paper-bug-fixes",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Development",
      collapsed: true,
      link: {
        type: "doc",
        id: "dev/README",
      },
      items: [
        {
          type: "category",
          label: "Getting started",
          collapsed: true,
          link: {
            type: "doc",
            id: "dev/getting-started/README",
          },
          items: [
            "dev/getting-started/project-setup",
            "dev/getting-started/plugin-yml",
            "dev/getting-started/paper-plugins",
            "dev/getting-started/userdev",
          ],
        },
        {
          type: "category",
          label: "API",
          collapsed: true,
          link: {
            type: "doc",
            id: "dev/api/README",
          },
          items: [
            {
              type: "category",
              label: "Event API",
              collapsed: true,
              items: [
                "dev/api/event-api/event-listeners",
                "dev/api/event-api/custom-events",
                "dev/api/event-api/handler-lists",
                "dev/api/event-api/chat-event",
              ],
            },
            {
              type: "category",
              label: "Component API (Adventure)",
              collapsed: true,
              items: [
                "dev/api/component-api/intro",
                "dev/api/component-api/i18n",
                "dev/api/component-api/audiences",
              ]
            },
            "dev/api/how-do-plugins-work",
            "dev/api/pdc",
            "dev/api/custom-inventory-holder",
            "dev/api/scheduler",
            "dev/api/plugin-messaging",
            "dev/api/plugin-configs",
            "dev/api/lifecycle",
            "dev/api/folia-support",
            "dev/api/roadmap",
          ],
        },
        {
          type: "category",
          label: "Miscellaneous",
          collapsed: true,
          link: {
            type: "doc",
            id: "dev/misc/README",
          },
          items: [
            "dev/misc/reading-stacktraces",
            "dev/misc/debugging",
            "dev/misc/databases",
            "dev/misc/internal-code",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Contributing",
      collapsed: true,
      link: {
        type: "doc",
        id: "contributing/README",
      },
      items: [
        "contributing/events",
      ],
    },
  ],
};

export = paper;
