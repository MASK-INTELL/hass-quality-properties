import { getBaseUrl } from './config';

const INDEXNOW_URL = 'https://www.bing.com/indexnow';

export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  const baseUrl = getBaseUrl();

  try {
    await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: new URL(baseUrl).host,
        key,
        keyLocation: `${baseUrl}/${key}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Fire-and-forget — failure is non-critical
  }
}
