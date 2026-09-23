import { z } from "zod";

// Shapes returned by the Instagram Graph API media endpoint. We validate at this
// boundary so a malformed/changed payload fails loudly instead of silently
// corrupting the generated data file.

const childSchema = z.object({
  id: z.string(),
  media_type: z.enum(["IMAGE", "VIDEO"]),
  media_url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
});

export const mediaNodeSchema = z.object({
  id: z.string(),
  caption: z.string().optional(),
  media_type: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  media_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  permalink: z.string().url(),
  timestamp: z.string(),
  children: z.object({ data: z.array(childSchema) }).optional(),
});

export const mediaResponseSchema = z.object({
  data: z.array(mediaNodeSchema),
  paging: z.object({ cursors: z.unknown().optional(), next: z.string().optional() }).optional(),
});

export type MediaNode = z.infer<typeof mediaNodeSchema>;
export type MediaResponse = z.infer<typeof mediaResponseSchema>;
