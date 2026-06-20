import { getBaseUrl } from './config';

const INDEXNOW_URL = 'https://www.bing.com/indexnow';

export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: new URL(baseUrl).host,
        key,
        keyLocation: `${baseUrl}/api/indexnow-verify?key=${key}`,
        urlList: urls,
      }),
    });

    if (!res.ok) {
      console.error(`[IndexNow] Failed: ${res.status} ${await res.text().catch(() => '')}`);
    } else {
      console.log(`[IndexNow] OK: ${res.status} — ${urls.join(', ')}`);
    }
  } catch {
    // Fire-and-forget — failure is non-critical
  }
}
