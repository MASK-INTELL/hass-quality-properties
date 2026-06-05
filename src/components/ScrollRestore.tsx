'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = 'auto'; };
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('scroll:' + pathname);
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
    }
    return () => {
      sessionStorage.setItem('scroll:' + pathname, String(window.scrollY));
    };
  }, [pathname]);

  return null;
}
