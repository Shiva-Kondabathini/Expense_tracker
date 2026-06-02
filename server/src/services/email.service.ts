import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

const createSmtpTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT, 10)
    : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

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

export const sendVerificationEmail = async (
  to: string,
  token: string,
): Promise<{ sent: boolean; previewUrl?: string }> => {
  let transporter: Mail | null = createSmtpTransporter();
  let previewUrl: string | undefined;

  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      console.warn("SMTP not configured - skipping email send");
      return { sent: false };
    }

    transporter = await createEtherealTransporter();
  }

  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";

  const verifyUrl = `${frontend}/verify/${token}`;

  const from = process.env.FROM_EMAIL || "noreply@example.com";

  const activeTransporter = transporter;
  if (!activeTransporter) {
    return { sent: false };
  }

  const info = await activeTransporter.sendMail({
    from,
    to,
    subject: "Verify your email",
    html: `
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>If the link doesn't work, copy and paste this URL into your browser:</p>
      <p>${verifyUrl}</p>
    `,
  });

  const testUrl = nodemailer.getTestMessageUrl(info);
  if (testUrl) {
    previewUrl = testUrl;
  }

  return { sent: true, previewUrl };
};

export default { sendVerificationEmail };
