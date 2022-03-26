import { LoadContext, PluginOptions, Plugin, InjectedHtmlTags } from "@docusaurus/types";

export default async function pluginCustomTags(
  context: LoadContext,
  options: PluginOptions
): Promise<Plugin<LoadContext>> {
  return {
    name: "docusaurus-plugin-custom-tags",

    injectHtmlTags() {
      return options as unknown as InjectedHtmlTags;
    },
  };
}
