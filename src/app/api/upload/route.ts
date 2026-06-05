import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import { requireAdmin } from '@/lib/require-admin';
import { r2Client, R2_CONFIG } from '@/lib/r2';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'untitled';
}

// Map allowed MIME types to accepted types for file-type detection
const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'application/pdf',
]);

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { userId } = await auth();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > R2_CONFIG.maxFileSize) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }

    // Quick preliminary filter (client-supplied MIME is untrusted)
    if (!R2_CONFIG.allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Magic byte detection — authoritative check
    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !ACCEPTED_TYPES.has(detected.mime)) {
      return NextResponse.json({ error: 'File content does not match an accepted type' }, { status: 400 });
    }

    const ext = detected.ext;
    const customName = (formData.get('filename') as string)?.trim();
    const baseName = customName ? slugify(customName) : slugify(file.name.replace(/\.[^.]+$/, ''));
    const suffix = Math.random().toString(36).slice(2, 6);
    const fileKey = `properties/${userId}/${baseName}-${suffix}.${ext}`;

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: detected.mime,
    }));

    const publicUrl = R2_CONFIG.publicUrl
      ? `${R2_CONFIG.publicUrl}/${fileKey}`
      : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileKey}`;

    return NextResponse.json({ url: publicUrl, key: fileKey, filename: baseName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
