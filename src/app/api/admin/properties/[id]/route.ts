import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/repositories/properties';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(property);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const property = await updateProperty(id, body);
    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    revalidatePath('/api/properties');
    revalidatePath('/api/properties/featured');
    revalidatePath('/api/properties/gallery');
    revalidatePath(`/properties/${id}`);
    revalidatePath('/about');
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProperty(id);
    revalidatePath('/api/properties');
    revalidatePath('/api/properties/featured');
    revalidatePath('/api/properties/gallery');
    revalidatePath(`/properties/${id}`);
    revalidatePath('/about');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
