import { getDocsPages, markdownPathFromId } from "../lib/docs";

export const prerender = true;

export async function GET() {
  const pages = await getDocsPages();

  const body = [
    "# Documentation",
    "",
    "> Markdown index for LLMs and agentic documentation tools.",
    "",
    "## Docs",
    "",
    ...pages.map((page) => {
      const title = page.data.title ?? page.id;
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${title}](${markdownPathFromId(page.id)})${description}`;
    }),
    "",
    "## Complete docs",
    "",
    "- [Full documentation](/llms-full.txt)",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
