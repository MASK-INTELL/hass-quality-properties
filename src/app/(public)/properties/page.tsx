import type { Metadata } from 'next';
import PropertiesPage from './_PropertiesPage';

export const metadata: Metadata = {
  title: 'Browse Properties',
  description: 'Explore our portfolio of houses, apartments, land, commercial properties, vehicles and motorcycles for sale or rent in Fort Portal, Uganda.',
  openGraph: {
    title: 'Properties for Sale & Rent | Hass Quality Properties',
    description: 'Browse our complete listings of real estate and vehicles in Fort Portal.',
    url: '/properties',
  },
  twitter: {
    title: 'Properties for Sale & Rent | Hass Quality Properties',
    description: 'Browse our complete listings of real estate and vehicles in Fort Portal.',
  },
  alternates: { canonical: '/properties' },
};

export default function Page() {
  return <PropertiesPage />;
}
