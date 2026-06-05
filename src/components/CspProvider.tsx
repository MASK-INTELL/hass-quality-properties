'use client';

import { CspNonceContext } from '@/lib/csp';

export function CspProvider({ nonce, children }: { nonce: string; children: React.ReactNode }) {
  return <CspNonceContext.Provider value={nonce}>{children}</CspNonceContext.Provider>;
}
