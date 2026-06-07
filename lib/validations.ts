import { z } from "zod";
import { slugify } from "@/lib/utils";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  category: z.enum(["fictional", "public_figure"]),
  source_title: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .max(4000, "Description is too long.")
    .optional()
    .or(z.literal("")),
  image_url: z
    .string()
    .trim()
    .url("Use a valid image URL.")
    .optional()
    .or(z.literal("")),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .transform(slugify),
});

export const voteSchema = z.object({
  profileId: z.string().uuid(),
  typingSystemId: z.string().uuid(),
  typeOptionId: z.string().uuid(),
});

export const evidenceSchema = z.object({
  profileId: z.string().uuid(),
  typingSystemId: z.string().uuid(),
  typeOptionId: z.string().uuid(),
  title: z.string().trim().min(4, "Title must be at least 4 characters."),
  body: z.string().trim().min(30, "Evidence needs at least 30 characters."),
  stance: z.enum(["for", "against"]),
});

export const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
