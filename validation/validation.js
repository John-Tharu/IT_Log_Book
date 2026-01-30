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

export const userLogsValidation = z.object({
  date: z.string().trim().nonempty({ message: "Date is required" }),
  time: z.string().trim().nonempty({ message: "Time is required" }),
  location: z
    .string()
    .trim()
    .nonempty({ message: "Location field is required" }),
  description: z
    .string()
    .trim()
    .nonempty({ message: "Description field is required" }),
  action: z.string().trim().nonempty({ message: "Action field is required" }),
  status: z.enum(["Pending", "Solved"], {
    required_error: "Status is required",
  }),
});
