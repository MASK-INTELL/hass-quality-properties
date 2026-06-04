import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateStat, deleteStat } from '@/lib/repositories/stats';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const stat = await updateStat(id, body);
    if (!stat) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/about');
    return NextResponse.json(stat);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteStat(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/about');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
  }
}
