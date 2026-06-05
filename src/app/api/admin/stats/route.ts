import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';
import { getAllStats, createStat } from '@/lib/repositories/stats';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const stats = await getAllStats();
  return NextResponse.json(stats);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const stat = await createStat(body);
    revalidatePath('/about');
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
  }
}
