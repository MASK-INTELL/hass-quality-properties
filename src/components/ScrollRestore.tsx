'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestore() {
  const pathname = usePathname();
  const isPopState = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      isPopState.current = true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isPopState.current) {
      const saved = sessionStorage.getItem('scrollRestore');
      if (saved) {
        try {
          const { path, y } = JSON.parse(saved);
          if (path === pathname) {
            requestAnimationFrame(() => window.scrollTo(0, y));
          }
        } catch {
          // ignore
        }
        sessionStorage.removeItem('scrollRestore');
      }
      isPopState.current = false;
    }
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      if (!link.href || !link.href.startsWith(window.location.origin)) return;
      if (link.getAttribute('href') === '#') return;
      if (link.target === '_blank') return;

      sessionStorage.setItem('scrollRestore', JSON.stringify({
        path: window.location.pathname,
        y: window.scrollY,
      }));
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
