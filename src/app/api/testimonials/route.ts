import { NextResponse } from 'next/server';
import { getAllTestimonials } from '@/lib/repositories/testimonials';

export async function GET() {
  const testimonials = await getAllTestimonials();
  return NextResponse.json(testimonials);
}
