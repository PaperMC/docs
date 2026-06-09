import { getCollection } from "astro:content";

export async function getDocsPages() {
  const docs = await getCollection("docs", ({ data }) => {
    return data.draft !== true;
  });

  return docs.filter((entry) => !entry.id.startsWith("_")).sort((a, b) => a.id.localeCompare(b.id));
}

export function htmlPathFromId(id: string) {
  return `/${id.replace(/(^|\/)index$/, "")}`.replace(/\/$/, "") || "/";
}

export function markdownPathFromId(id: string) {
  const clean = id.replace(/\.mdx?$/, "");

  if (clean.endsWith("/index")) {
    return `/${clean}.md`;
  }

  return `/${clean}/index.md`;
}
