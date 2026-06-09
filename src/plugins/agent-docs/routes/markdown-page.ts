import type { APIContext, GetStaticPaths } from "astro";
import { getDocsPages, markdownPathFromId } from "../lib/docs";
import { pageToMarkdown } from "../lib/markdown";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getDocsPages();

  return pages.map((page) => {
    const path = markdownPathFromId(page.id).replace(/^\//, "").replace(/\.md$/, "");

    return {
      params: { slug: path },
      props: { page },
    };
  });
};

export function GET({ props }: APIContext) {
  return new Response(pageToMarkdown(props.page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
