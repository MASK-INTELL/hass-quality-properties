import { NextRequest, NextResponse } from 'next/server';
import { getAllTestimonials, createTestimonial } from '@/lib/repositories/testimonials';

export async function GET() {
  const testimonials = await getAllTestimonials();
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testimonial = await createTestimonial(body);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
