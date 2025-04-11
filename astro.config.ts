import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
// import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";
import codeConstantsPlugin from "./src/utils/remark/code_const";
import javadocPlugin from "./src/utils/remark/javadoc";
import { LATEST_MC_RELEASE, LATEST_PAPER_RELEASE, LATEST_VELOCITY_RELEASE } from "./src/utils/versions";

const prod = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
  site: prod ? "https://docs.papermc.io" : undefined,
  integrations: [
    starlight({
      title: "PaperMC Docs",
      favicon: "favicon.ico",
      logo: {
        light: "./src/assets/logo-marker-light.svg",
        dark: "./src/assets/logo-marker-dark.svg",
        replacesTitle: true,
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/PaperMC" },
        { icon: "discord", label: "Discord", href: "https://discord.gg/PaperMC" },
        { icon: "seti:java", label: "Javadoc", href: "https://jd.papermc.io" },
      ],
      lastUpdated: true,
      editLink: {
        baseUrl: "https://github.com/PaperMC/docs/edit/main/",
      },
      customCss: [
        "@fontsource/poppins/400.css",
        // "@fontsource/poppins/600.css", // see src/styles/custom.css
        "@fontsource/jetbrains-mono/400.css",
        "@fontsource/jetbrains-mono/600.css",
        "./src/styles/custom.css",
      ],
      components: {
        Head: "./src/components/overrides/Head.astro",
        Sidebar: "./src/components/overrides/Sidebar.astro",
        Footer: "./src/components/overrides/Footer.astro",
        Banner: "./src/components/overrides/Banner.astro",
      },
      plugins: [
        // starlightLinksValidator(),
        starlightSidebarTopics(
          [
            {
              id: "paper",
              label: "Paper",
              link: "/paper/",
              icon: "paper",
              items: [
                {
                  label: "Administration",
                  items: [
                    {
                      label: "Getting started",
                      items: ["paper/getting-started", "paper/adding-plugins", "paper/migration", "paper/next-steps"],
                    },
                    {
                      label: "How-to guides",
                      items: [
                        "paper/aikars-flags",
                        "paper/anti-xray",
                        "paper/basic-troubleshooting",
                        "paper/profiling",
                        "paper/updating",
                        "paper/vanilla",
                      ],
                    },
                    {
                      label: "Reference",
                      items: [
                        "paper/reference/paper-plugins",
                        "paper/reference/system-properties",
                        "paper/reference/permissions",
                      ],
                    },
                    {
                      label: "Miscellaneous",
                      items: ["paper/misc/paper-bug-fixes", "paper/faq"],
                    },
                  ],
                },
                {
                  label: "Development",
                  items: [
                    {
                      label: "Getting started",
                      items: [
                        "paper/dev/project-setup",
                        "paper/dev/how-do-plugins-work",
                        "paper/dev/getting-started/paper-plugins",
                        "paper/dev/plugin-yml",
                        "paper/dev/userdev",
                      ],
                    },
                    {
                      label: "Miscellaneous",
                      items: [
                        "paper/dev/using-databases",
                        "paper/dev/debugging",
                        "paper/dev/internals",
                        "paper/dev/reading-stacktraces",
                      ],
                    },
                  ],
                },
                {
                  label: "Contributing",
                  items: ["paper/contributing/events"],
                },
              ],
            },
            {
              id: "velocity",
              label: "Velocity",
              link: "/velocity/",
              icon: "velocity",
              items: [
                {
                  label: "Administration",
                  items: [
                    {
                      label: "Getting started",
                      items: [
                        "velocity/getting-started",
                        "velocity/why-velocity",
                        "velocity/player-information-forwarding",
                        "velocity/faq",
                      ],
                    },
                    {
                      label: "How-to guides",
                      items: ["velocity/tuning", "velocity/security", "velocity/migration"],
                    },
                    {
                      label: "Reference",
                      items: [
                        "velocity/configuration",
                        "velocity/reference/system-properties",
                        "velocity/built-in-commands",
                        "velocity/server-compatibility",
                        "velocity/comparisons-to-other-proxies",
                        "velocity/credits",
                      ],
                    },
                  ],
                },
                {
                  label: "Development",
                  items: [
                    {
                      label: "Getting started",
                      items: [
                        "velocity/dev/creating-your-first-plugin",
                        "velocity/dev/api-basics",
                        "velocity/dev/pitfalls",
                      ],
                    },
                    {
                      label: "How-to guides",
                      items: ["velocity/dev/dependency-management", "velocity/dev/porting-plugins-from-velocity-1"],
                    },
                    {
                      label: "API",
                      items: [
                        "velocity/dev/event-api",
                        "velocity/dev/scheduler-api",
                        "velocity/dev/command-api",
                        "velocity/dev/plugin-messaging",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "folia",
              label: "Folia",
              link: "/folia/",
              icon: "folia",
              items: [
                {
                  label: "Administration",
                  items: [
                    {
                      label: "Reference",
                      items: ["folia/reference/overview", "folia/reference/region-logic", "folia/faq"],
                    },
                  ],
                },
              ],
            },
            {
              id: "waterfall",
              label: "Waterfall",
              link: "/waterfall/",
              icon: "waterfall",
              items: ["waterfall/getting-started", "waterfall/configuration"],
            },
            {
              id: "misc",
              label: "Miscellaneous",
              link: "/misc/",
              icon: "random",
              items: [
                "misc/assets",
                "misc/contact",
                "misc/downloads-api",
                "misc/hangar-publishing",
                "misc/java-install",
                {
                  label: "Tools",
                  items: ["misc/tools/minimessage-web-editor"],
                },
              ],
            },
          ],
          {
            // pages excluded from sidebars - index.md(x) pages
            topics: {
              paper: [
                "/paper/admin",
                "/paper/admin/getting-started",
                "/paper/admin/how-to",
                "/paper/admin/misc",
                "/paper/admin/reference",
                "/paper/dev",
                "/paper/dev/getting-started",
                "/paper/dev/misc",
                "/paper/contributing",
              ],
              velocity: [
                "/velocity/admin",
                "/velocity/admin/getting-started",
                "/velocity/admin/how-to",
                "/velocity/admin/reference",
                "/velocity/dev",
                "/velocity/dev/getting-started",
                "/velocity/dev/how-to",
                "/velocity/dev/api",
              ],
              folia: ["/folia/admin", "/folia/admin/reference"],
              waterfall: ["/waterfall"],
              misc: ["/misc", "/misc/tools"],
            },
          }
        ),
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [
      [
        javadocPlugin,
        {
          targets: {
            paper: `https://jd.papermc.io/paper/${LATEST_PAPER_RELEASE}`,
            velocity: `https://jd.papermc.io/velocity/${LATEST_VELOCITY_RELEASE.substring(0, LATEST_VELOCITY_RELEASE.lastIndexOf("."))}.0`,
            java: { url: "https://docs.oracle.com/en/java/javase/21/docs/api", module: "java.base" },
          },
        },
      ],
      [
        codeConstantsPlugin,
        {
          constants: {
            LATEST_MC_RELEASE,
            LATEST_PAPER_RELEASE,
            LATEST_VELOCITY_RELEASE,
          },
        },
      ],
    ],
  },
});
