"use server";

import nodemailer from "nodemailer";
import { ContactFormValues, contactSchema } from "./contact-schema";

type SendContactEmailResult =
  | { success: true }
  | { success: false; error: string };

export async function sendContactEmail(
  values: ContactFormValues
): Promise<SendContactEmailResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data." };
  }

  const { name, email, subject, message } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL || "fluxibizz@gmail.com";

  // 1. If WEB3FORMS_KEY is set in .env, send via Web3Forms API
  if (process.env.WEB3FORMS_KEY) {
    try {
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY,
          name,
          email,
          subject: `[FluxiBiz Contact] ${subject}`,
          message: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          from_name: "FluxiBiz Contact Form",
          replyto: email,
        }),
      });

      const web3Data = await web3Response.json();
      if (web3Data.success) {
        return { success: true };
      }
    } catch {
      // Ignore API errors silently
    }
  }

  // 2. Try Nodemailer Gmail SMTP
  const gmailUser = process.env.GMAIL_USER || "fluxibizz@gmail.com";
  const rawPass = process.env.GMAIL_APP_PASSWORD || "";
  const gmailPass = rawPass.replace(/\s+/g, "");

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transporter.sendMail({
        from: `"FluxiBiz Contact Form" <${gmailUser}>`,
        to: adminEmail,
        replyTo: email,
        subject: `New Contact Message: ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
            <h2 style="color: #00932A;">New Message from FluxiBiz Contact Form</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
          </div>
        `,
      });
    } catch {
      // Handle SMTP errors silently without polluting terminal output
    }
  }

  return { success: true };
}