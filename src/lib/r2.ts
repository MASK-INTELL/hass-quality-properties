import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

function getR2Endpoint() {
  const accountId = process.env.R2_ACCOUNT_ID;
  return `https://${accountId}.r2.cloudflarestorage.com`;
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: getR2Endpoint(),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const R2_CONFIG = {
  bucketName: process.env.R2_BUCKET_NAME!,
  publicUrl: process.env.R2_PUBLIC_URL,
  maxFileSize: 50 * 1024 * 1024,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
  ],
};

function getBaseUrl() {
  return R2_CONFIG.publicUrl || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}`;
}

export function getPublicUrl(key: string) {
  return `${getBaseUrl()}/${key}`;
}

export async function listObjects(prefix?: string, maxKeys: number = 50, continuationToken?: string) {
  const command = new ListObjectsV2Command({
    Bucket: R2_CONFIG.bucketName,
    ...(prefix ? { Prefix: prefix } : {}),
    MaxKeys: maxKeys,
    ...(continuationToken ? { ContinuationToken: continuationToken } : {}),
  });
  return r2Client.send(command);
}

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  });
  return r2Client.send(command);
}

const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'video/webm',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function inferContentType(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() || '';
  return MIME_MAP[ext] || 'application/octet-stream';
}
