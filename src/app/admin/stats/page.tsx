'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, BarChart3, X } from 'lucide-react';

interface Stat {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  source?: string;
}

interface StatModalProps {
  stat?: Stat | null;
  onSave: (data: { label: string; value: string }) => void;
  onClose: () => void;
}

function StatModal({ stat, onSave, onClose }: StatModalProps) {
  const [label, setLabel] = useState(stat?.label || '');
  const [value, setValue] = useState(stat?.value || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;
    onSave({ label: label.trim(), value: value.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">{stat ? 'Edit Stat' : 'Add Stat'}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Years of Experience" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 11+" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-medium disabled:opacity-50" disabled={!label.trim() || !value.trim()}>
              {stat ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalStat, setModalStat] = useState<Stat | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Stat | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSave = async (data: { label: string; value: string }) => {
    if (modalStat) {
      const res = await fetch(`/api/admin/stats/${modalStat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchStats();
      }
    } else {
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchStats();
      }
    }
    setModalStat(undefined);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/stats/${deleteTarget.id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchStats();
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Statistics</h1>
          <p className="text-gray-500 mt-1">Manage the stats shown on the About page</p>
        </div>
        <button onClick={() => setModalStat(null)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-medium shadow-sm">
          <Plus className="h-5 w-5" /> Add Stat
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : stats.length === 0 ? (
          <div className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No stats yet</p>
            <p className="text-gray-400 text-sm mt-1">Click &quot;Add Stat&quot; to create your first one.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.map((stat, index) => (
              <div key={stat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-emerald-600 font-semibold">{stat.value}</p>
                      {stat.source?.startsWith('auto_') && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium" title={stat.source === 'auto_listings' ? 'Auto-counted from properties' : 'Auto-counted from testimonials'}>
                          Auto
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!stat.source?.startsWith('auto_') && (
                    <>
                      <button onClick={() => setModalStat(stat)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(stat)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalStat !== undefined && (
        <StatModal stat={modalStat} onSave={handleSave} onClose={() => setModalStat(undefined)} />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Stat</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete &quot;{deleteTarget.label}&quot;? This cannot be undone.</p>
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
