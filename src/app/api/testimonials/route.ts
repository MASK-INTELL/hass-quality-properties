import { NextRequest, NextResponse } from 'next/server';
import { createTestimonial } from '@/lib/repositories/testimonials';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await createTestimonial(body);
    return NextResponse.json({ message: 'Your testimonial has been submitted for review and will appear once approved.' }, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 });
  }
}
