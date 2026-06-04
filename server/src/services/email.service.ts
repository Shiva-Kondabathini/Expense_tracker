import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

type EmailResult = { sent: boolean; previewUrl?: string };

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

const createEtherealTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendWithResend = async ({
  to,
  subject,
  html,
}: EmailPayload): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "Nakharch <onboarding@resend.dev>";

  if (!apiKey) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API failed (${response.status}): ${errorBody}`);
  }

  return true;
};

const sendWithDevelopmentEmail = async ({
  to,
  subject,
  html,
}: EmailPayload): Promise<EmailResult> => {
  const transporter: Mail = await createEtherealTransporter();

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@example.com",
    to,
    subject,
    html,
  });

  const testUrl = nodemailer.getTestMessageUrl(info);

  return { sent: true, previewUrl: testUrl || undefined };
};

const sendEmail = async (payload: EmailPayload): Promise<EmailResult> => {
  const sentWithResend = await sendWithResend(payload);

  if (sentWithResend) {
    return { sent: true };
  }

  if (process.env.NODE_ENV === "production") {
    console.warn("RESEND_API_KEY not configured - skipping email send");
    return { sent: false };
  }

  return sendWithDevelopmentEmail(payload);
};

export const sendVerificationEmail = async (
  to: string,
  token: string,
): Promise<EmailResult> => {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";

  const verifyUrl = `${frontend}/verify/${token}`;

  return sendEmail({
    to,
    subject: "Verify your email",
    html: `
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>If the link doesn't work, copy and paste this URL into your browser:</p>
      <p>${verifyUrl}</p>
    `,
  });
};

export const sendResetPasswordEmail = async (
  to: string,
  token: string,
): Promise<EmailResult> => {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";

  const resetUrl = `${frontend}/reset-password/${token}`;

  return sendEmail({
    to,
    subject: "Reset your password",
    html: `
      <p>You requested to reset your password. Please click the link below:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If the link doesn't work, copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

export default { sendVerificationEmail, sendResetPasswordEmail };
