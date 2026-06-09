import type { StarlightPlugin } from "@astrojs/starlight/types";
import { agentDocsRoutes } from "./integrations/routes";

export function agentDocs(): StarlightPlugin {
  return {
    name: "agent-docs",
    hooks: {
      "config:setup"({ config, updateConfig, addIntegration }) {
        addIntegration(agentDocsRoutes());

        updateConfig({
          components: {
            ...config.components,
            PageTitle: "./src/plugins/agent-docs/components/PageTitleWithCopy.astro",
          },
        });
      },
    },
  };
}
