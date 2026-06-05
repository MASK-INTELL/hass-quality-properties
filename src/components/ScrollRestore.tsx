'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestore() {
  const pathname = usePathname();
  const isPopState = useRef(false);

  useEffect(() => {
    const onPopState = () => { isPopState.current = true; };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const origPushState = history.pushState.bind(history);
    const origReplaceState = history.replaceState.bind(history);

    const save = () => {
      sessionStorage.setItem('scrollRestore', JSON.stringify({
        path: window.location.pathname,
        y: window.scrollY,
      }));
    };

    history.pushState = (...args) => { save(); return origPushState(...args); };
    history.replaceState = (...args) => { save(); return origReplaceState(...args); };

    return () => {
      history.pushState = origPushState;
      history.replaceState = origReplaceState;
    };
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

  return null;
}
