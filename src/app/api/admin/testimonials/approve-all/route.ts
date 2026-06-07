import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';
import { validateCsrf } from '@/lib/csrf';
import { approveAllPendingTestimonials } from '@/lib/repositories/testimonials';

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    await approveAllPendingTestimonials();
    revalidatePath('/testimonials');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving all testimonials:', error);
    return NextResponse.json({ error: 'Failed to approve all' }, { status: 500 });
  }
}
