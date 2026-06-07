import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-bold text-emerald-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
