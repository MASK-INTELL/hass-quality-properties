export interface ImageMetadata {
  url: string;
  alt: string;
  filename: string;
}

export function getAltText(metadata: ImageMetadata[] | undefined | null, url: string, fallback: string): string {
  return metadata?.find(m => m.url === url)?.alt || fallback;
}

export function getFilename(metadata: ImageMetadata[] | undefined | null, url: string): string {
  return metadata?.find(m => m.url === url)?.filename || '';
}
