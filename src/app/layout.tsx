import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Hass Quality Properties - Real Estate, Rentals & Vehicles',
  description: 'Find your perfect property, rental, or vehicle with Hass Quality Properties. Browse houses, apartments, land, commercial properties, cars, and motorcycles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
