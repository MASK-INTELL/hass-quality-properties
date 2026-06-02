import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_CONFIG } from '@/lib/r2';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > R2_CONFIG.maxFileSize) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }

    if (!R2_CONFIG.allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileKey = `properties/${userId}/${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    }));

    const publicUrl = R2_CONFIG.publicUrl
      ? `${R2_CONFIG.publicUrl}/${fileKey}`
      : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileKey}`;

    return NextResponse.json({ url: publicUrl, key: fileKey });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
