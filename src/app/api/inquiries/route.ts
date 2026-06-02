import { NextRequest, NextResponse } from 'next/server';
import { createInquiry } from '@/lib/repositories/inquiries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inquiry = await createInquiry(body);
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
