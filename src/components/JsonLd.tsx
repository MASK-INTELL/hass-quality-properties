'use client';

import { useCspNonce } from '@/lib/csp';

export function JsonLd({ data }: { data: object }) {
  const nonce = useCspNonce();
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
