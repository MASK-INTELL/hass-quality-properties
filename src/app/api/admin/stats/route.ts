import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllStats, createStat } from '@/lib/repositories/stats';

export async function GET() {
  const stats = await getAllStats();
  return NextResponse.json(stats);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const stat = await createStat(body);
    revalidatePath('/about');
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
  }
}
