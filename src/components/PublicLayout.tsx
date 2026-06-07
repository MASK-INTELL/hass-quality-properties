'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOnboarding from './WelcomeOnboarding';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname === '/contact' || pathname.startsWith('/properties');

  return (
    <>
      <WelcomeOnboarding />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
}
