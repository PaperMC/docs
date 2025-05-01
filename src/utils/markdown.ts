import { createMarkdownProcessor } from "@astrojs/markdown-remark";

const renderer = await createMarkdownProcessor(globalThis.markdownConfig);

export const render = async (content: string): Promise<string> => {
  const code = (await renderer.render(content)).code;

  return code.startsWith("<p>") && code.endsWith("</p>") ? code.substring(3, code.length - 4) : code;
};
