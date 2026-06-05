'use client';

import { createContext, useContext } from 'react';

export const CspNonceContext = createContext<string>('');

export function useCspNonce() {
  return useContext(CspNonceContext);
}
