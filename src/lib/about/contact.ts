"use server";

import nodemailer from "nodemailer";
import { ContactFormValues, contactSchema } from "./contact-schema";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type SendContactEmailResult =
  | { success: true }
  | { success: false; error: string };

export async function sendContactEmail(
  values: ContactFormValues
): Promise<SendContactEmailResult> {
  // Always re-validate on the server — never trust client input
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data." };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New contact form message: ${subject}`,
      html: `
        <h2>New message from your website contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }
}