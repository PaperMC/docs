import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";

// replaces special Markdown links with Javadoc URLs
// link format: jd:<javadoc name>:<fully qualified class name; . as package separator, $ for inner>[:<module name>]

interface Target {
  url: string;
  module?: string; // default
}

interface Options {
  targets: Record<string, string | Target>;
}

const asUrl = (name: string): string => {
  let [name0, hash] = name.split("#", 2);
  name0 = name0.replaceAll(".", "/").replaceAll("$", ".");

  return `${name0}.html` + (hash ? `#${hash}` : "");
};

const parse = (url: string, { targets }: Options): string | null => {
  const match = /^jd:(.+?):(.+?)(?::(.+?))?$/.exec(url);
  if (!match) {
    return null;
  }

  const target = targets[match[1]];
  if (!target) {
    return null;
  }

  const name = match[2];
  const module = match[3] ?? (typeof target !== "string" ? target.module : undefined);

  return `${typeof target !== "string" ? target.url : target}/${module ? `${module}/` : ""}${asUrl(name)}`;
};

const plugin: RemarkPlugin = (options: Options) => {
  return (tree) => {
    visit(tree, "link", (node) => {
      node.url = parse(node.url, options) ?? node.url;
    });
  };
};

export default plugin;
