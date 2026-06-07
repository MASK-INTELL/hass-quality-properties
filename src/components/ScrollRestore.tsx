'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function restoreScroll(key: string) {
  const saved = sessionStorage.getItem('scroll:' + key);
  if (!saved) return;
  const targetY = parseInt(saved, 10);
  if (targetY <= 0) return;

  let attempts = 0;
  const maxAttempts = 30;
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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    history.scrollRestoration = 'manual';

    const onPageShow = () => {
      restoreScroll(window.location.pathname);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
      history.scrollRestoration = 'auto';
    };
  }, [pathname]);

  useEffect(() => {
    restoreScroll(pathname);
    return () => {
      sessionStorage.setItem('scroll:' + pathname, String(window.scrollY));
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
