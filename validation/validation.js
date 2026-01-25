import { z } from "zod";

export const loginValidation = z.object({
  email: z.string().email({ message: "Enter Valid Email Address" }),
  pass: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const signupValidation = loginValidation
  .extend({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    cpass: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine(({ pass, cpass }) => pass === cpass, {
    message: "Passwords do not match",
  });
