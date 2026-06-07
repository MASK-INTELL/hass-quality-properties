import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { validateCsrf } from '@/lib/csrf';
import { markInquiryRead, deleteInquiry } from '@/lib/repositories/inquiries';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    const { id } = await params;
    await markInquiryRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    const { id } = await params;
    await deleteInquiry(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
