import type { AstroUserConfig } from "astro";

declare global {
  // for passing the Markdown configuration to the on-demand renderer
  var markdownConfig: AstroUserConfig["markdown"];
}
