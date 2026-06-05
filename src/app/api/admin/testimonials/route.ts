import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import sql from '@/lib/db';
import { Testimonial, getPendingTestimonials, createTestimonial } from '@/lib/repositories/testimonials';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');
  const testimonials = filter === 'pending'
    ? await getPendingTestimonials()
    : await sql`SELECT * FROM testimonials ORDER BY created_at DESC` as unknown as Testimonial[];
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testimonial = await createTestimonial({ ...body, approved: true });
    revalidatePath('/api/testimonials');
    revalidatePath('/testimonials');
    revalidatePath('/about');
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
