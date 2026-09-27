import { type CollectionEntry, getCollection } from "astro:content";

export async function getDocsPages() {
  return (await getCollection("docs")).sort((a, b) => a.id.localeCompare(b.id));
}

const topicIdFromEntry = (entry: CollectionEntry<"docs">): string | null => {
  if (entry.id === "index") {
    // not a topical page
    return null;
  }

  // starlight-sidebar-topics data is not available here, infer from slug
  return entry.id.split("/").shift() ?? null;
};

export async function getDocsPagesByTopic() {
  const docs = await getCollection("docs");

  const index = new Map<string, CollectionEntry<"docs">[]>();
  for (const page of docs) {
    const topicId = topicIdFromEntry(page);
    if (topicId) {
      const pages = index.get(topicId) ?? [];
      pages.push(page);
      index.set(topicId, pages);
    }
  }

  for (const pages of index.values()) {
    pages.sort((a, b) => a.id.localeCompare(b.id));
  }
  return Array.from(index.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export function markdownSlug(slug: string) {
  // documentation pages are in "<slug>/index.html", so we want to put the Markdown next to those files
  return slug.endsWith("index") ? slug : `${slug}/index`;
}

export function pageToMarkdown(page: CollectionEntry<"docs">) {
  const title = page.data.title ?? page.id;
  const description = page.data.description;

  return [`# ${title}`, description ? `\n${description}` : "", "", page.body ?? ""]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}
