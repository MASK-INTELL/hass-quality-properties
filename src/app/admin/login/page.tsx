'use client';

import { SignIn } from '@clerk/nextjs';
import CompanyLogo from '@/components/CompanyLogo';

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CompanyLogo className="h-16 w-auto object-contain" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your properties and content
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <SignIn
            fallbackRedirectUrl="/admin"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none p-0',
                socialButtons: 'hidden',
                dividerRow: 'hidden',
                formButtonPrimary: 'bg-emerald-700 hover:bg-emerald-800 text-sm font-medium rounded-lg',
                footerActionLink: 'text-emerald-600 hover:text-emerald-700',
                identityPreviewEditButton: 'text-emerald-600',
                formFieldInput: 'rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm',
                formFieldLabel: 'text-sm font-medium text-gray-700',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
