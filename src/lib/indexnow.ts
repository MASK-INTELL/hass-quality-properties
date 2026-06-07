const BASE_URL = 'https://hass-quality-properties.vercel.app';
const INDEXNOW_URL = 'https://www.bing.com/indexnow';

export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  try {
    await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: new URL(BASE_URL).host,
        key,
        keyLocation: `${BASE_URL}/${key}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Fire-and-forget — failure is non-critical
  }
}
