import { getDocsPages } from "../lib/docs";
import { pageToMarkdown } from "../lib/markdown";

export const prerender = true;

export async function GET() {
  const pages = await getDocsPages();

  const body = pages.map((page) => pageToMarkdown(page)).join("\n\n---\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
