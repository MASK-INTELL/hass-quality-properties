import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import sql from '@/lib/db';
import { createTestimonial } from '@/lib/repositories/testimonials';
import { validateCsrf } from '@/lib/csrf';
import { rateLimit } from '@/lib/rate-limit';
import { testimonialSchema } from '@/lib/validation';

export async function GET() {
  const testimonials = await sql`
    SELECT id, name, role, quote, rating FROM testimonials WHERE approved = true ORDER BY created_at DESC
  `;
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rl = rateLimit(`testimonial:${clientIp}`, 3, 600_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = testimonialSchema.parse(body);
    await createTestimonial(parsed);
    return NextResponse.json({ message: 'Your testimonial has been submitted for review and will appear once approved.' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 });
  }
}
