import type { AstroMarkdownOptions } from "@astrojs/markdown-remark";

declare global {
  // for passing the Markdown configuration to the on-demand renderer
  var markdownConfig: AstroMarkdownOptions;
}
