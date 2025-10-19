import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import miniMessageHighlight from "./src/utils/shiki/mm.tmLanguage.json" with { type: "json" };

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default {
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  defaultProps: {
    showLineNumbers: false,
    collapseStyle: "collapsible-start",
  },
  frames: {
    extractFileNameFromCode: false,
  },
  emitExternalStylesheet: false,
  shiki: {
    langs: [miniMessageHighlight],
  },
};
