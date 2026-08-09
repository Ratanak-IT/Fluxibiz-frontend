import { z } from "zod";

export const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

export function validateEmailFormat(val?: string | null): string | true {
  if (!val || val.trim() === "") return "Email is required";
  const trimmed = val.trim();

  if (trimmed.startsWith("@")) {
    return "Email must contain a username before @ (e.g. name@domain.com)";
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return "Invalid email format (e.g. name@example.com)";
  }

  if (!parts[1].includes(".") || parts[1].endsWith(".")) {
    return "Email domain must include an extension like .com or .kh (e.g. gmail.com)";
  }

  if (!STRICT_EMAIL_REGEX.test(trimmed)) {
    return "Invalid email format (e.g. name@example.com)";
  }

  const domain = parts[1].toLowerCase();
  if (domain === "gmai.com" || domain === "gamil.com" || domain === "gmaill.com" || domain === "gmail.co") {
    return "Did you mean @gmail.com?";
  }
  if (domain === "yaho.com" || domain === "yahoo.co") {
    return "Did you mean @yahoo.com?";
  }
  if (domain === "hotmial.com" || domain === "hotmail.co") {
    return "Did you mean @hotmail.com?";
  }

  return true;
}

export const strictEmailSchema = z.string().superRefine((val, ctx) => {
  const result = validateEmailFormat(val);
  if (result !== true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result,
    });
  }
});

export const userRegisterSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z
      .string()
      .min(8, "Phone number must be at least 8 digits")
      .regex(/^\+?[0-9\s]+$/, "Invalid phone number format"),
    email: strictEmailSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;

export const businessRegisterSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  businessType: z.string().min(1, "Please select a business type"),
  businessEmail: strictEmailSchema,
  businessAddress: z.string().min(3, "Address must be at least 3 characters"),
  description: z.string().optional(),
});

export type BusinessRegisterFormData = z.infer<typeof businessRegisterSchema>;
