export function pageToMarkdown(page: { id: string; data: { title?: string; description?: string }; body?: string }) {
  const title = page.data.title ?? page.id;
  const description = page.data.description;

  return [`# ${title}`, description ? `\n${description}` : "", "", page.body ?? ""]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}
