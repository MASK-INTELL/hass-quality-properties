'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOnboarding from './WelcomeOnboarding';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname === '/properties' || pathname === '/contact';

  return (
    <>
      <WelcomeOnboarding />
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
}
