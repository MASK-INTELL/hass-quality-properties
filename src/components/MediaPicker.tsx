'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Search, Upload, Loader2, Check, Film, FileText, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  key: string;
  url: string;
  size: number;
  lastModified: string | null;
  type: string;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (item: MediaItem) => void;
  onSelectMultiple?: (items: MediaItem[]) => void;
  selectedUrls?: string[];
  accept?: ('image' | 'video')[];
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, Math.floor((now - then) / 1000));
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function MediaPicker({
  isOpen,
  onClose,
  mode,
  onSelect,
  onSelectMultiple,
  selectedUrls = [],
  accept,
}: MediaPickerProps) {
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  function matchesAccept(item: MediaItem): boolean {
    if (!accept || accept.length === 0) return true;
    const isImage = item.type.startsWith('image/');
    const isVideo = item.type.startsWith('video/');
    return (accept.includes('image') && isImage) || (accept.includes('video') && isVideo);
  }

  async function fetchFiles(cursor?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('prefix', debouncedSearch);
      if (cursor) params.set('cursor', cursor);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/media?${params}`);
      const data = await res.json();

      const filtered = (data.files || []).filter(matchesAccept);

      if (cursor) {
        setFiles(prev => [...prev, ...filtered]);
      } else {
        setFiles(filtered);
      }
      setNextCursor(data.nextCursor);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setFiles([]);
      setNextCursor(null);
      setSelected(new Set(selectedUrls));
      setSearch('');
      setDebouncedSearch('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setFiles([]);
    setNextCursor(null);
    fetchFiles();
  }, [debouncedSearch, isOpen]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      await fetch('/api/upload', { method: 'POST', body: form });
      setFiles([]);
      setNextCursor(null);
      await fetchFiles();
    } catch {
      // ignore
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function toggleSelect(url: string) {
    if (mode === 'single') {
      setSelected(new Set([url]));
      return;
    }
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  function handleConfirm() {
    if (mode === 'single') {
      const item = files.find(f => f.url === [...selected][0]);
      if (item) onSelect(item);
      onClose();
      return;
    }
    const items = files.filter(f => selected.has(f.url));
    onSelectMultiple?.(items);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'single' ? 'Select Media' : 'Select Media'}
          </h2>
          <div className="flex items-center gap-3">
            <label
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                uploading
                  ? 'bg-gray-100 text-gray-400 pointer-events-none'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4,video/webm"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading</>
              ) : (
                <><Upload className="h-4 w-4" /> Upload</>
              )}
            </label>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && files.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No files found</p>
              <p className="text-gray-400 text-xs mt-1">Upload a file to get started</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map(item => {
                  const isSelected = selected.has(item.url);
                  const isImage = item.type.startsWith('image/');
                  const isVideo = item.type.startsWith('video/');

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleSelect(item.url)}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square relative bg-gray-100">
                        {isImage ? (
                          <Image
                            fill
                            src={item.url}
                            alt=""
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        ) : isVideo ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="h-10 w-10 text-gray-400" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                            <div className="bg-emerald-500 text-white rounded-full p-1">
                              <Check className="h-5 w-5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-xs text-gray-500 truncate">
                        <p className="truncate font-medium text-gray-700">
                          {item.key.split('/').pop()}
                        </p>
                        <p className="mt-0.5">{formatSize(item.size)} &middot; {timeAgo(item.lastModified)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {nextCursor && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => fetchFiles(nextCursor)}
                    disabled={loading}
                    className="px-6 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin inline mr-1" /> Loading...</>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 shrink-0">
          <p className="text-sm text-gray-500">
            {mode === 'single'
              ? selected.size === 1
                ? '1 file selected'
                : 'Click a file to select'
              : `${selected.size} file${selected.size !== 1 ? 's' : ''} selected`}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'single' ? 'Select' : `Add Selected (${selected.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
