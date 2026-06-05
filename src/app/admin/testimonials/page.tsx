'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, MessageCircle, X, Star, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
}

interface TestimonialModalProps {
  testimonial?: Testimonial | null;
  onSave: (data: { name: string; role: string; quote: string; rating: number }) => void;
  onClose: () => void;
}

function TestimonialModal({ testimonial, onSave, onClose }: TestimonialModalProps) {
  const [name, setName] = useState(testimonial?.name || '');
  const [role, setRole] = useState(testimonial?.role || '');
  const [quote, setQuote] = useState(testimonial?.quote || '');
  const [rating, setRating] = useState(testimonial?.rating || 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !quote.trim()) return;
    onSave({ name: name.trim(), role: role.trim(), quote: quote.trim(), rating });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. First-Time Homeowner" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
            <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} type="button" onClick={() => setRating(r)} className="p-1 transition-colors">
                  <Star className={`h-6 w-6 ${r <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50" disabled={!name.trim() || !role.trim() || !quote.trim()}>
              {testimonial ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [modalTestimonial, setModalTestimonial] = useState<Testimonial | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        setTestimonials(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filtered = testimonials.filter(t => {
    if (tab === 'pending') return !t.approved;
    if (tab === 'approved') return t.approved;
    return true;
  });

  const pendingCount = testimonials.filter(t => !t.approved).length;

  const handleSave = async (data: { name: string; role: string; quote: string; rating: number }) => {
    if (modalTestimonial) {
      const res = await fetch(`/api/admin/testimonials/${modalTestimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchTestimonials();
      }
    } else {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchTestimonials();
      }
    }
    setModalTestimonial(undefined);
  };

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    });
    if (res.ok) {
      await fetchTestimonials();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/testimonials/${deleteTarget.id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchTestimonials();
    }
    setDeleteTarget(null);
  };

  const tabs = [
    { key: 'all', label: 'All', count: testimonials.length },
    { key: 'pending', label: 'Pending', count: pendingCount },
    { key: 'approved', label: 'Approved', count: testimonials.length - pendingCount },
  ] as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 mt-1">
            {pendingCount > 0 ? `${pendingCount} pending approval` : 'All testimonials approved'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <button
              onClick={async () => {
                await fetch('/api/admin/testimonials/approve-all', { method: 'POST' });
                await fetchTestimonials();
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-medium text-sm"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve All ({pendingCount})
            </button>
          )}
          <button onClick={() => setModalTestimonial(null)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm">
            <Plus className="h-5 w-5" /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === t.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              {tab === 'pending' ? 'No pending testimonials' : tab === 'approved' ? 'No approved testimonials' : 'No testimonials yet'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {tab === 'pending' ? 'All testimonials have been reviewed.' : 'Click "Add Testimonial" to create your first one.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-start justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <span className="text-xs text-gray-400">|</span>
                    <p className="text-xs text-emerald-600 font-medium">{t.role}</p>
                    {!t.approved && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Pending</span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">&quot;{t.quote}&quot;</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!t.approved && (
                    <button onClick={() => handleApprove(t.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => setModalTestimonial(t)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(t)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalTestimonial !== undefined && (
        <TestimonialModal testimonial={modalTestimonial} onSave={handleSave} onClose={() => setModalTestimonial(undefined)} />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Testimonial</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete the testimonial from &quot;{deleteTarget.name}&quot;? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
