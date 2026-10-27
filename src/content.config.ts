import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// De privacydocumenten. Elk document is een Markdown-bestand in src/content/documenten/.
const documenten = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/documenten' }),
  schema: z.object({
    title: z.string(),
    sub: z.string(),
    order: z.number(),
    lead: z.string(),
    status: z.enum(['concept', 'definitief']),
    datum: z.string(),
  }),
});

export const collections = { documenten };
