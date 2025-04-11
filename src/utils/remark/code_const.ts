import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";

// replaces constants in code blocks
// expression format: \{CONSTANT_NAME}

interface Options {
  constants: Record<string, string>;
}

const plugin: RemarkPlugin = ({ constants }: Options) => {
  return (tree) => {
    visit(tree, "code", (node) => {
      if (!node.meta?.includes("replace")) {
        return;
      }

      node.value = node.value.replace(/\\\{([^}]+?)}/g, (_, name) => constants[name] ?? name);
    });
  };
};

export default plugin;
