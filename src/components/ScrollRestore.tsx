'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function restoreScroll(key: string) {
  const saved = sessionStorage.getItem('scroll:' + key);
  if (!saved) return;
  const targetY = parseInt(saved, 10);
  if (targetY <= 0) return;

  let attempts = 0;
  const maxAttempts = 50;
  const poll = () => {
    if (document.body.scrollHeight > targetY || attempts >= maxAttempts) {
      window.scrollTo(0, targetY);
    } else {
      attempts++;
      setTimeout(poll, 50);
    }
  };
  setTimeout(poll, 50);
}

export default function ScrollRestore() {
  const pathname = usePathname();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const restoreKeyRef = useRef<string | null>(null);

  useEffect(() => {
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = 'auto'; };
  }, []);

  useEffect(() => {
    const key = pathname;
    restoreKeyRef.current = key;
    requestAnimationFrame(() => {
      if (restoreKeyRef.current === key) {
        restoreScroll(key);
      }
    });

    return () => {
      sessionStorage.setItem('scroll:' + key, String(window.scrollY));
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        sessionStorage.setItem('scroll:' + pathname, String(window.scrollY));
      }, 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname]);

  return null;
}
