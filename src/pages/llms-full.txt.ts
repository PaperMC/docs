import type { APIRoute } from "astro";
import { getDocsPages, pageToMarkdown } from "../utils/llms";

export const GET: APIRoute = async () => {
  const pages = await getDocsPages();

  const body = pages.map((page) => pageToMarkdown(page)).join("\n\n---\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
