import type { Metadata } from 'next';
import ContactPage from './_ContactPage';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Hass Quality Properties. Call, email, WhatsApp, or visit us in Fort Portal Tourism City, Uganda.',
  openGraph: {
    title: 'Contact Hass Quality Properties',
    description: 'Get in touch with Hass Quality Properties. Call, email, WhatsApp, or visit us in Fort Portal Tourism City.',
    url: '/contact',
  },
  twitter: {
    title: 'Contact Hass Quality Properties',
    description: 'Get in touch with us in Fort Portal Tourism City, Uganda.',
  },
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
