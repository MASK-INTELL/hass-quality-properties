const RESEND_API = 'https://api.resend.com';

interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    await fetch(`${RESEND_API}/emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Hass Quality Properties <notifications@hassqualityproperties.xyz>',
        to,
        subject,
        html,
      }),
    });
  } catch {
    // Fail silently — non-critical
  }
}

export function sendInquiryNotification(inquiry: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  property_title?: string | null;
}) {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) return;

  const phoneLine = inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : '';
  const propertyLine = inquiry.property_title
    ? `<p><strong>Property:</strong> ${inquiry.property_title}</p>`
    : '';

  return sendEmail({
    to: adminEmails,
    subject: `New Inquiry from ${inquiry.name}`,
    html: `
      <h2>New Inquiry Received</h2>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      ${phoneLine}
      ${propertyLine}
      <p><strong>Message:</strong></p>
      <blockquote style="border-left:3px solid #059669;padding-left:12px;margin-left:0;color:#555">
        ${inquiry.message.replace(/\n/g, '<br>')}
      </blockquote>
      <hr>
      <p style="color:#999;font-size:12px">
        View all inquiries: <a href="https://hassqualityproperties.xyz/admin/inquiries">admin dashboard</a>
      </p>
    `.trim(),
  });
}
