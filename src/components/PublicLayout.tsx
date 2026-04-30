'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOnboarding from './WelcomeOnboarding';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WelcomeOnboarding />
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
