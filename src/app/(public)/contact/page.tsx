import type { Metadata } from 'next';
import ContactPage from './_ContactPage';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Hass Properties in Fort Portal Tourism City, Uganda. Call +256791715573, email info@hassproperties.com, WhatsApp, or visit our office to find your dream property.',
  openGraph: {
    title: 'Contact Hass Properties',
    description: 'Get in touch with Hass Properties. Call, email, WhatsApp, or visit us in Fort Portal Tourism City.',
    url: '/contact',
  },
  twitter: {
    title: 'Contact Hass Properties',
    description: 'Get in touch with us in Fort Portal Tourism City, Uganda.',
  },
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
      <ContactPage />
    </>
  );
}
