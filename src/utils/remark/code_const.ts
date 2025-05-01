import type { RemarkPlugin } from "@astrojs/markdown-remark";
import type { Literal } from "mdast";
import { visit } from "unist-util-visit";

// replaces constants in code blocks
// expression format: \{CONSTANT_NAME}

interface Options {
  constants: Record<string, string>;
}

const plugin: RemarkPlugin = ({ constants }: Options) => {
  return (tree) => {
    visit(tree, ["code", "inlineCode"], (node) => {
      if (node.type === "code" && !node.meta?.includes("replace")) {
        return;
      }

      const code = node as Literal;
      code.value = code.value.replace(/\\\{([^}]+?)}/g, (_, name) => constants[name] ?? name);
    });
  };
};

export default plugin;
