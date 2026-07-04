import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    fullName: z
      .string({ error: "Full name is required" })
      .min(2, { error: "Full name must be at least 2 characters" })
      .trim(),

    email: z.email({ error: "Invalid email format" }).trim().toLowerCase(),

    password: z
      .string({ error: "Password is required" })
      .min(6, { error: "Password must be at least 6 characters" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email format" }).trim().toLowerCase(),

    password: z
      .string({ error: "Password is required" })
      .min(1, { error: "Password cannot be empty" }),
  }),
});

export const onboardingSchema = z.object({
  body: z.object({
    fullName: z
      .string({ error: "Full name is required" })
      .min(2, { error: "Full name must be at least 2 characters" })
      .trim(),

    bio: z
      .string({ error: "Bio is required" })
      .min(10, { error: "Bio must be at least 10 characters long" })
      .max(500, { error: "Bio cannot exceed 500 characters" })
      .trim(),

    skillToShare: z
      .string({ error: "Subject is required" })
      .min(2, { error: "Please provide a valid subject" })
      .trim(),

    skillToLearn: z
      .string({ error: "Subject is required" })
      .min(2, { error: "Please provide a valid subject" })
      .trim(),

    location: z
      .string({ error: "Location is required" })
      .min(2, { error: "Please provide a valid location" })
      .trim(),
  }),
});
