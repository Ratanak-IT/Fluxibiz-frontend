import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name." })
    .max(80, { message: "Name is too long." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Enter a valid email address." }),
  subject: z
    .string()
    .trim()
    .min(3, { message: "Subject must be at least 3 characters." })
    .max(120, { message: "Subject is too long." }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1000, { message: "Message is too long." }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;