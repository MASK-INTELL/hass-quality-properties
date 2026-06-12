'use client';

import { useState } from 'react';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';

export default function TestimonialForm() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [quote, setQuote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !role || !quote) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, rating, quote }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
      setName('');
      setRole('');
      setRating(5);
      setQuote('');
    } catch {
      setError('Something went wrong. Please try again or send us a message on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm";

  if (!showForm) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Share Your Experience</h2>
        <p className="text-gray-500 mb-6 max-w-xl mx-auto">
          Have you worked with us? Let others know how we helped you find your perfect property.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-full font-bold hover:bg-emerald-800 transition-colors shadow-sm"
        >
          Write a Testimonial
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 md:p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-emerald-800 mb-2">Thank You!</h3>
        <p className="text-emerald-700">
          Your testimonial has been submitted for review and will appear once approved.
        </p>
        <button
          onClick={() => { setSubmitted(false); setShowForm(true); }}
          className="mt-6 text-emerald-600 font-semibold hover:text-emerald-800 underline text-sm"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
      <p className="text-gray-500 mb-8">Tell us about your experience with Hass Properties.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="test-name" className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
            <input id="test-name" type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClass} placeholder="e.g. John Doe" />
          </div>
          <div>
            <label htmlFor="test-role" className="block text-sm font-medium text-gray-700 mb-1.5">Role / Property Type *</label>
            <input id="test-role" type="text" value={role} onChange={e => setRole(e.target.value)} required className={inputClass} placeholder="e.g. Home Buyer, Landlord" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="test-quote" className="block text-sm font-medium text-gray-700 mb-1.5">Your Testimonial *</label>
          <textarea
            id="test-quote" value={quote} onChange={e => setQuote(e.target.value)} required rows={4}
            className={inputClass + ' resize-none'} placeholder="Share your experience..."
          />
        </div>

        <button
          type="submit" disabled={submitting}
          className="w-full py-3.5 px-6 rounded-lg text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {submitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</> : 'Submit Testimonial'}
        </button>

        <p className="text-xs text-gray-400 text-center">Your testimonial will appear on this page after admin approval.</p>
      </form>
    </div>
  );
}
