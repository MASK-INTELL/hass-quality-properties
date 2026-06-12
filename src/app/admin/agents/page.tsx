'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Loader2, X, Upload, Users } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  title: string;
  photo_url: string;
  sort_order: number;
}

interface AgentForm {
  name: string;
  title: string;
  photo_url: string;
}

const EMPTY_FORM: AgentForm = { name: '', title: '', photo_url: '' };

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AgentForm>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchAgents() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/agents');
      const data = await res.json();
      setAgents(data);
    } catch {
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAgents(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(agent: Agent) {
    setForm({ name: agent.name, title: agent.title, photo_url: agent.photo_url });
    setEditingId(agent.id);
    setShowModal(true);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, type: file.type }),
      });
      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.error || 'Presign failed');
      await fetch(presignData.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      setForm(prev => ({ ...prev, photo_url: presignData.publicUrl }));
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name || !form.title || !form.photo_url) return;
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/agents/${editingId}` : '/api/admin/agents';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      await fetchAgents();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/agents/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchAgents();
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  async function moveAgent(id: string, direction: 'up' | 'down') {
    const idx = agents.findIndex(a => a.id === id);
    if (idx === -1) return;
    const swap = direction === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= agents.length) return;

    const current = agents[idx];
    const target = agents[swap];
    await Promise.all([
      fetch(`/api/admin/agents/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: target.sort_order }),
      }),
      fetch(`/api/admin/agents/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: current.sort_order }),
      }),
    ]);
    await fetchAgents();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your team gallery</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-800 transition-colors text-sm shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Agent
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No agents yet</p>
          <p className="text-gray-400 text-sm mt-1">Add your first team member to get started.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agents.map((agent, idx) => (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          {agent.photo_url ? (
                            <Image className="h-10 w-10 object-cover" src={agent.photo_url} alt={agent.name} width={40} height={40} />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500 w-4">{agent.sort_order}</span>
                        <button
                          onClick={() => moveAgent(agent.id, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveAgent(agent.id, 'down')}
                          disabled={idx === agents.length - 1}
                          className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(agent)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(agent)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {agents.map((agent, idx) => (
              <div key={agent.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    {agent.photo_url ? (
                      <Image className="h-12 w-12 object-cover" src={agent.photo_url} alt={agent.name} width={48} height={48} />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                    <p className="text-xs text-gray-500 truncate">{agent.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 mr-1">Order:</span>
                    <span className="text-sm text-gray-500 w-4">{agent.sort_order}</span>
                    <button
                      onClick={() => moveAgent(agent.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveAgent(agent.id, 'down')}
                      disabled={idx === agents.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(agent)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(agent)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit Agent' : 'Add Agent'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Hassan Kintu"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg max-sm:text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Founder & CEO"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg max-sm:text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo *</label>
                <div className="flex items-center gap-4">
                  <label className={`flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="hidden" />
                    {uploading ? <><Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Uploading</> : <><Upload className="h-5 w-5 text-gray-500" /> Choose Photo</>}
                  </label>
                  {form.photo_url && (
                    <button onClick={() => setForm(prev => ({ ...prev, photo_url: '' }))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {form.photo_url && (
                  <div className="mt-3 w-20 h-20 rounded-full overflow-hidden border border-gray-200 relative">
                    <Image fill src={form.photo_url} alt="Preview" className="object-cover" sizes="80px" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.title || !form.photo_url || saving}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin inline mr-1" /> Saving</> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Agent</h3>
              <p className="text-sm text-gray-500 mb-2">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteTarget.name}</span>?
              </p>
              <p className="text-xs text-gray-400">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? <><Loader2 className="h-4 w-4 animate-spin inline mr-1" /> Deleting</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
