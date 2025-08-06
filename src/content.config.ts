import { feedLoader } from "@ascorbic/feed-loader";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection, z } from "astro:content";

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
    loader: feedLoader({
      url: "https://github.com/KyoriPowered/adventure/releases.atom",
    }),
  }),
  "adventure-platform-releases": defineCollection({
    loader: feedLoader({
      url: "https://github.com/KyoriPowered/adventure-platform/releases.atom",
    }),
  }),
  "adventure-platform-mod-releases": defineCollection({
    loader: feedLoader({
      url: "https://github.com/KyoriPowered/adventure-platform-mod/releases.atom",
    }),
  }),
};
