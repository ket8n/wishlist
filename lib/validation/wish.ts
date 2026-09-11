import { z } from "zod";

export const WISH_STATUSES = ["PENDING", "BOUGHT", "COMPLETED", "REJECTED"] as const;
export const WISH_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const WISH_CATEGORIES = [
  "ELECTRONICS",
  "CLOTHING",
  "FITNESS",
  "BOOKS",
  "TRAVEL",
  "EDUCATION",
  "HOME",
  "OTHER",
] as const;

export const LIMITS = {
  name: 120,
  description: 2000,
  note: 2000,
  url: 2048,
  linkLabel: 60,
  images: 10,
  links: 10,
  maxPrice: 9_999_999_999.99,
} as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

// External URLs are untrusted: http(s) only.
export const httpUrl = z
  .string()
  .trim()
  .max(LIMITS.url)
  .pipe(z.url({ protocol: /^https?$/, hostname: z.regexes.domain }));

export const wishId = z.string().trim().min(1).max(64);

const price = z
  .union([z.number(), z.string().trim()])
  .optional()
  .nullable()
  .transform((v, ctx) => {
    if (v === undefined || v === null || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n) || n < 0 || n > LIMITS.maxPrice) {
      ctx.addIssue({ code: "custom", message: "Enter a valid price" });
      return z.NEVER;
    }
    return n.toFixed(2);
  });

export const wishFieldsSchema = z.object({
  name: z.string().trim().min(1, "Give it a name").max(LIMITS.name),
  description: optionalText(LIMITS.description),
  category: z.enum(WISH_CATEGORIES).default("OTHER"),
  priority: z.enum(WISH_PRIORITIES).default("MEDIUM"),
  estimatedPrice: price,
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Use a 3-letter currency code")
    .default("INR"),
  images: z.array(httpUrl).max(LIMITS.images).default([]),
  links: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Add a label").max(LIMITS.linkLabel),
        url: httpUrl,
      }),
    )
    .max(LIMITS.links)
    .default([]),
});

export const createWishSchema = wishFieldsSchema.extend({
  status: z.enum(WISH_STATUSES).default("PENDING"),
  note: optionalText(LIMITS.note),
});

export const updateWishSchema = wishFieldsSchema.extend({ id: wishId });

export const changeStatusSchema = z.object({
  id: wishId,
  status: z.enum(WISH_STATUSES),
  note: optionalText(LIMITS.note),
});

export const updateNoteSchema = z.object({
  id: wishId,
  note: optionalText(LIMITS.note),
});

export type WishStatusValue = (typeof WISH_STATUSES)[number];
export type CreateWishInput = z.infer<typeof createWishSchema>;
export type WishFieldsInput = z.infer<typeof wishFieldsSchema>;
