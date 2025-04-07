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
      },
      plugins: [
        // starlightLinksValidator(),
        starlightSidebarTopics(
          [
            {
              id: "paper",
              label: "Paper",
              link: "/paper/",
              items: [
                {
                  label: "Administration",
                  items: [
                    {
                      label: "Getting started",
                      autogenerate: { directory: "paper/admin/getting-started" },
                    },
                    { label: "How-to guides", autogenerate: { directory: "paper/admin/how-to" } },
                    { label: "Miscellaneous", autogenerate: { directory: "paper/admin/misc" } },
                  ],
                },
              ],
            },
          ],
          {
            // pages excluded from sidebars
            topics: {
              paper: ["/paper/admin"],
            },
          }
        ),
      ],
    }),
  ],
});
