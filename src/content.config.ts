import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";
import categories from "./data/categories.json";
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");
const status = z.enum([
  "ufficiale",
  "osservato",
  "riferito",
  "calcolato",
  "ipotesi",
  "da-verificare",
  "superato",
]);
const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z
    .object({
      title: z.string().min(3),
      description: z.string().min(20).max(220),
      lang: z.literal("it"),
      category: z
        .string()
        .refine(
          (value) => categories.some((c) => c.id === value),
          "Unknown category",
        ),
      order: z.number().int(),
      tags: z.array(z.string()).default([]),
      status,
      published: date,
      updated: date,
      lastVerified: date.nullable(),
      version: z.string().optional(),
      sources: z.array(z.string()).min(1),
      related: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
    })
    .refine(
      (data) => data.updated >= data.published,
      "Update predates publication",
    )
    .refine(
      (data) => !data.lastVerified || data.lastVerified <= data.updated,
      "Verification postdates update",
    ),
});
const sources = defineCollection({
  loader: file("./src/data/sources.json"),
  schema: z.object({
    title: z.string(),
    url: z.string().url().optional(),
    type: z.enum(["ufficiale", "riferito", "osservato"]),
    accessed: date.optional(),
    published: date.optional(),
    observed: date.optional(),
    note: z.string().optional(),
  }),
});
const enchants = defineCollection({
  loader: file("./src/data/enchants.json"),
  schema: z.object({
    name: z.string().min(2),
    description: z.string().min(20),
    maxLevel: z.number().int().positive().nullable().optional(),
    rarity: z
      .enum([
        "Comune",
        "Non comune",
        "Raro",
        "Epico",
        "Leggendario",
        "Speciale",
        "Molto speciale",
      ])
      .nullable()
      .optional(),
    compatibleItems: z.array(z.string()).nullable().optional(),
    conflicts: z.array(z.string()).nullable().optional(),
    procChance: z.number().min(0).max(100).nullable().optional(),
    averageYieldBonusPct: z.number().nonnegative().nullable().optional(),
    cooldownSeconds: z.number().positive().nullable().optional(),
    restrictions: z.array(z.string()),
    source: z.string(),
    officialSource: z.string().optional(),
    observed: date,
    timestampSeconds: z.number().nonnegative(),
    verificationStatus: z.enum(["osservato", "riferito", "da-verificare"]),
  }),
});
export const collections = { docs, sources, enchants };
