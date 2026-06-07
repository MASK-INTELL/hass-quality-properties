import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createInquiry } from '@/lib/repositories/inquiries';
import { validateCsrf } from '@/lib/csrf';
import { rateLimit } from '@/lib/rate-limit';
import { inquirySchema } from '@/lib/validation';
import { sendInquiryNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rl = rateLimit(`inquiry:${clientIp}`, 5, 600_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = inquirySchema.parse(body);
    const inquiry = await createInquiry(parsed);
    sendInquiryNotification(parsed);
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
