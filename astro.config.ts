import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
// import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";

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
                      autogenerate: { directory: "paper/admin/getting-started" },
                    },
                    { label: "How-to guides", autogenerate: { directory: "paper/admin/how-to" } },
                    { label: "Reference", autogenerate: { directory: "paper/admin/reference" } },
                    { label: "Miscellaneous", autogenerate: { directory: "paper/admin/misc" } },
                  ],
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
                      autogenerate: { directory: "velocity/admin/getting-started" },
                    },
                    {
                      label: "How-to guides",
                      autogenerate: { directory: "velocity/admin/how-to" },
                    },
                    { label: "Reference", autogenerate: { directory: "velocity/admin/reference" } },
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
                  items: [{ label: "Reference", autogenerate: { directory: "folia/admin/reference" } }],
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
            // pages excluded from sidebars
            topics: {
              paper: ["/paper/admin"],
              velocity: ["/velocity/admin"],
              folia: ["/folia/admin"],
              waterfall: ["/waterfall"],
              misc: ["/misc", "/misc/tools"],
            },
          }
        ),
      ],
    }),
  ],
});
