const store = new Map<string, { count: number; reset: number }>();

const ONE_MINUTE = 60_000;

export function rateLimit(key: string, maxRequests: number, windowMs: number = ONE_MINUTE): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - entry.count };
}

// Periodic cleanup to prevent memory leaks (runs every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.reset) store.delete(key);
    }
  }, 5 * ONE_MINUTE);
}
