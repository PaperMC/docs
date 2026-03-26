import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { parseAtomFeed, type Atom } from "feedsmith";

const feedLoader = (url: string): (() => Promise<(Atom.Entry<string> & { id: string })[]>) => {
  return async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed from ${url}: ${response.statusText}`);
    }

    const feed = parseAtomFeed(await response.text());
    return feed.entries!.map((e, i) => ({ ...e, id: e.id!, index: i }));
  };
};

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        banner: z
          .object({
            destructive: z.boolean().optional(),
          })
          .optional(),
        version: z.string().optional(),
      }),
    }),
  }),
  "adventure-releases": defineCollection({
    loader: feedLoader("https://github.com/PaperMC/adventure/releases.atom"),
  }),
  "adventure-platform-releases": defineCollection({
    loader: feedLoader("https://github.com/PaperMC/adventure-platform/releases.atom"),
  }),
  "adventure-platform-mod-releases": defineCollection({
    loader: feedLoader("https://github.com/PaperMC/adventure-platform-mod/releases.atom"),
  }),
};
