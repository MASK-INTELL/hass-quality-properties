import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';
import { approveAllPendingTestimonials } from '@/lib/repositories/testimonials';

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await approveAllPendingTestimonials();
    revalidatePath('/testimonials');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving all testimonials:', error);
    return NextResponse.json({ error: 'Failed to approve all' }, { status: 500 });
  }
}
