import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';
import { validateCsrf } from '@/lib/csrf';
import sql from '@/lib/db';
import { Testimonial, getPendingTestimonials, createTestimonial } from '@/lib/repositories/testimonials';
import { pingIndexNow } from '@/lib/indexnow';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');
  const testimonials = filter === 'pending'
    ? await getPendingTestimonials()
    : await sql`SELECT * FROM testimonials ORDER BY created_at DESC` as unknown as Testimonial[];
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    const body = await request.json();
    const testimonial = await createTestimonial({ ...body, approved: true });
    revalidatePath('/api/testimonials');
    revalidatePath('/testimonials');
    revalidatePath('/about');
    pingIndexNow([`${process.env.APP_URL || 'https://hassproperties.online'}/testimonials`]);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
