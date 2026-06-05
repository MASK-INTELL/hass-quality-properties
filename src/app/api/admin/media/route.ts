import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { listObjects, deleteObject, getPublicUrl, inferContentType } from '@/lib/r2';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    const result = await listObjects(prefix, limit, cursor);

    const files = (result.Contents || [])
      .filter(item => item.Key && !item.Key.endsWith('/'))
      .map(item => ({
        key: item.Key!,
        url: getPublicUrl(item.Key!),
        size: item.Size || 0,
        lastModified: item.LastModified?.toISOString() || null,
        type: inferContentType(item.Key!),
      }))
      .sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''));

    return NextResponse.json({
      files,
      nextCursor: result.IsTruncated ? result.NextContinuationToken || null : null,
      total: result.KeyCount || files.length,
    });
  } catch (error) {
    console.error('Error listing media:', error);
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    await deleteObject(key);
    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
