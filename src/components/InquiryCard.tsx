'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Loader2, CheckCircle, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { gtagEvent } from '@/lib/analytics';

interface PropertyInfo {
  title: string;
  location: string;
  price: string;
  type: string;
  category: string;
}

interface InquiryCardProps {
  property: PropertyInfo;
  defaultExpanded?: boolean;
}

function buildInspectionMessage(p: PropertyInfo): string {
  return [
    'I would like to request an inspection for this property:',
    '',
    `Title: ${p.title}`,
    `Location: ${p.location}`,
    `Price: ${p.price}`,
    `Type: ${p.type}`,
    `Category: ${p.category}`,
    '',
    'Please contact me to schedule. Thank you.',
  ].join('\n');
}

export default function InquiryCard({ property, defaultExpanded = false }: InquiryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  function handlePhoneChange(val: string) {
    setPhone(val);
    setPhoneError(validatePhone(val));
  }
  const [message, setMessage] = useState(() => buildInspectionMessage(property));
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function validatePhone(val: string): string | null {
    if (!val.trim()) return 'Phone is required';
    if (!/^(\+256|0)\d{9}$/.test(val.replace(/[\s\-\(\)]/g, ''))) {
      return 'Enter a valid phone number (e.g., +256 791 715 573)';
    }
    return null;
  }

  useEffect(() => {
    if (defaultExpanded && window.innerWidth >= 1024) {
      setExpanded(true);
    }
  }, [defaultExpanded]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), message: message.trim(), property_title: property.title }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to send request');
      }
      setSubmitted(true);
      gtagEvent('request_inspection', { property_title: property.title });
      setName('');
      setPhone('');
      setMessage(buildInspectionMessage(property));
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function toggle() {
    setExpanded(prev => !prev);
    setError(null);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors lg:cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-full text-emerald-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="font-semibold text-gray-900 text-left">Request Inspection</span>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>

      {expanded && (
        <div ref={formRef} className="px-4 sm:px-6 pb-6">
          {submitted ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="font-semibold text-gray-900">Inspection Request Sent!</p>
              <p className="text-sm text-gray-500 mt-1">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="Phone Number"
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${phoneError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {phoneError && (
                  <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                )}
              </div>
              <div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting || !name.trim() || !phone.trim() || !!phoneError}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                {submitting ? 'Sending...' : 'Request Inspection'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Or call us directly: <a href="tel:+256791715573" className="text-emerald-600 hover:underline font-medium inline-flex items-center gap-1"><Phone className="h-3 w-3" /> +256 791 715 573</a>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}