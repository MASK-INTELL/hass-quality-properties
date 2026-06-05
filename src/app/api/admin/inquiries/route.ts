import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getAllInquiries } from '@/lib/repositories/inquiries';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const inquiries = await getAllInquiries();
  return NextResponse.json(inquiries);
}
