export interface SidebarLink {
  type: "link";
  label: string;
  href: string;
}

export interface SidebarGroup {
  type: "group";
  label: string;
  entries: (SidebarLink | SidebarGroup)[];
}

export type SidebarEntry = SidebarLink | SidebarGroup;

export const flattenEntries = (entries: SidebarEntry[], result: SidebarEntry[] = []): SidebarEntry[] => {
  for (const entry of entries) {
    result.push(entry);
    if (entry.type === "group") {
      flattenEntries(entry.entries, result);
    }
  }

  return result;
};
