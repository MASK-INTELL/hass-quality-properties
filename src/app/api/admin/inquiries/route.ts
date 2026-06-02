import { NextResponse } from 'next/server';
import { getAllInquiries } from '@/lib/repositories/inquiries';

export async function GET() {
  const inquiries = await getAllInquiries();
  return NextResponse.json(inquiries);
}
