import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { rateLimit } from '@/lib/rate-limit';
import { getPresignedUploadUrl, generateFileKey, getPublicUrl, R2_CONFIG } from '@/lib/r2';

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = rateLimit(`presign:${ip}`, 10, 60000);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const fileName = body.name as string;
    const mimeType = body.type as string;

    if (!fileName || !mimeType) {
      return NextResponse.json({ error: 'name and type are required' }, { status: 400 });
    }

    if (!R2_CONFIG.allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const ext = mimeType.split('/')[1] === 'svg+xml' ? 'svg' : mimeType.split('/')[1] || 'bin';
    const key = generateFileKey('upload', fileName, ext);
    const presignedUrl = await getPresignedUploadUrl(key, mimeType);

    return NextResponse.json({
      presignedUrl,
      publicUrl: getPublicUrl(key),
      key,
    });
  } catch (error) {
    console.error('Presign error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
