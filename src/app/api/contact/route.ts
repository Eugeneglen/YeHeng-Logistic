import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECEIVER_EMAIL = "info@yeheng.com.sg";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are not configured.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    // ── Validation ─────────────────────────────────────────────
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // ── Send Email ─────────────────────────────────────────────
    const transporter = createTransporter();

    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafafa; border-radius: 8px;">
        <div style="border-bottom: 3px solid #D97706; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="margin: 0; font-size: 20px; color: #111;">New Enquiry from Website</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #666;">YeHeng Logistics — Contact Form</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 12px; background: #f0f0f0; font-weight: 600; width: 120px; border-radius: 4px 0 0 4px;">Name</td>
            <td style="padding: 10px 12px; background: #fff; border-radius: 0 4px 4px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f0f0f0; font-weight: 600;">Email</td>
            <td style="padding: 10px 12px; background: #fff;"><a href="mailto:${escapeHtml(email)}" style="color: #D97706;">${escapeHtml(email)}</a></td>
          </tr>
          ${phone ? `<tr>
            <td style="padding: 10px 12px; background: #f0f0f0; font-weight: 600;">Phone</td>
            <td style="padding: 10px 12px; background: #fff;"><a href="tel:${escapeHtml(phone)}" style="color: #D97706;">${escapeHtml(phone)}</a></td>
          </tr>` : ""}
          ${company ? `<tr>
            <td style="padding: 10px 12px; background: #f0f0f0; font-weight: 600;">Company</td>
            <td style="padding: 10px 12px; background: #fff;">${escapeHtml(company)}</td>
          </tr>` : ""}
        </table>

        <div style="background: #fff; border-radius: 8px; padding: 16px; border-left: 4px solid #D97706;">
          <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; font-weight: 600;">Message</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center;">
          Received ${new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" })} SGT
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"YeHeng Website" <${process.env.SMTP_USER}>`,
      to: RECEIVER_EMAIL,
      replyTo: email,
      subject: `Website Enquiry: ${name}${company ? ` (${company})` : ""}`,
      html: htmlBody,
      text: `
New Enquiry from YeHeng Logistics Website
${"=".repeat(45)}

Name:    ${name}
Email:   ${email}
${phone ? `Phone:   ${phone}` : ""}
${company ? `Company: ${company}` : ""}

Message:
${message}

---
Received ${new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" })} SGT
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact form error:", msg);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}