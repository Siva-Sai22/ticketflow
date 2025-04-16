import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or other known service like 'gmail', 'outlook', etc.
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends an email to the specified recipient
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - Email content in HTML format
 * @returns Promise<boolean> - True if email was sent successfully, false otherwise
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}: ${error}`);
    return false;
  }
}
