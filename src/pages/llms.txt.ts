import type { APIRoute } from "astro";
import { getDocsPagesByTopic, markdownSlug } from "../utils/llms";

export const GET: APIRoute = async () => {
  const pages = await getDocsPagesByTopic();

  const body = [
    "# Documentation",
    "",
    "> Markdown index for LLMs and agentic documentation tools.",
    "",
    ...pages.flatMap(([topic, topicPages]) => [
      `## ${topic}`,
      "",
      ...topicPages.map((page) => {
        const title = page.data.title ?? page.id;
        const description = page.data.description ? `: ${page.data.description}` : "";
        return `- [${title}](/${markdownSlug(page.id)}.md)${description}`;
      }),
      "",
    ]),
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
};
