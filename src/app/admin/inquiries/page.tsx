'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { Mail, Phone, MapPin, Check, X, Clock, Trash2 } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  property_title: string | null;
  read: boolean;
  created_at: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(inquiry: Inquiry) {
    if (inquiry.read) return;
    try {
      await supabase.from('inquiries').update({ read: true }).eq('id', inquiry.id);
      setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, read: true } : i));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setInquiries(prev => prev.filter(i => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      if (selectedInquiry?.id === deleteTarget.id) setSelectedInquiry(null);
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage messages from potential clients</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-48" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No inquiries yet</p>
            <p className="text-gray-400 text-sm mt-1">Messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => { setSelectedInquiry(inquiry); markAsRead(inquiry); }}
                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !inquiry.read ? 'bg-emerald-50/50' : ''
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  inquiry.read ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium truncate ${inquiry.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {inquiry.name}
                    </p>
                    {!inquiry.read && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{inquiry.email}</p>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {formatDate(inquiry.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">From</p>
                <p className="font-medium text-gray-900">{selectedInquiry.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                <a href={`mailto:${selectedInquiry.email}`} className="text-emerald-600 hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>

              {selectedInquiry.phone && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-emerald-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Received</p>
                <p className="text-gray-600 text-sm">{formatDate(selectedInquiry.created_at)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Message</p>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry`}
                className="flex-1 py-2 text-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reply via Email
              </a>
              {selectedInquiry.phone && (
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex-1 py-2 text-center bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Call
                </a>
              )}
              <button
                onClick={() => { setDeleteTarget(selectedInquiry); setSelectedInquiry(null); }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Inquiry</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Are you sure you want to delete this inquiry from <span className="font-semibold">{deleteTarget.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-75"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
