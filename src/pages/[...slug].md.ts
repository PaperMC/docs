import type { APIRoute, GetStaticPaths } from "astro";
import { getDocsPages, markdownSlug, pageToMarkdown } from "../utils/llms";

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getDocsPages();

  return pages.map((page) => {
    return {
      params: { slug: markdownSlug(page.id) },
      props: { page },
    };
  });
};

export const GET: APIRoute = ({ props }) =>
  new Response(pageToMarkdown(props.page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
