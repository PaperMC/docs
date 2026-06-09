import type { AstroIntegration } from "astro";

export function agentDocsRoutes(): AstroIntegration {
  return {
    name: "agent-docs-routes",
    hooks: {
      "astro:config:setup"({ injectRoute }) {
        injectRoute({
          pattern: "/llms.txt",
          entrypoint: "./src/plugins/agent-docs/routes/llms.txt.ts",
          prerender: true,
        });

        injectRoute({
          pattern: "/llms-full.txt",
          entrypoint: "./src/plugins/agent-docs/routes/llms-full.txt.ts",
          prerender: true,
        });

        injectRoute({
          pattern: "/[...slug].md",
          entrypoint: "./src/plugins/agent-docs/routes/markdown-page.ts",
          prerender: true,
        });
      },
    },
  };
}
