'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Copy, Search, Image as ImageIcon, Loader2, Check, X, FileText, Film } from 'lucide-react';

interface MediaFile {
  key: string;
  url: string;
  size: number;
  lastModified: string | null;
  type: string;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatTime(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function getFileIcon(type: string) {
  if (type.startsWith('video/')) return Film;
  if (type.startsWith('image/')) return null;
  return FileText;
}

function getFilename(key: string): string {
  const parts = key.split('/');
  return parts[parts.length - 1] || key;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setFiles([]); setNextCursor(null); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchFiles = useCallback(async (cursor?: string | null) => {
    const isLoadMore = !!cursor;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('prefix', debouncedSearch);
      if (cursor) params.set('cursor', cursor);

      const res = await fetch(`/api/admin/media?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      if (isLoadMore) {
        setFiles(prev => [...prev, ...data.files]);
      } else {
        setFiles(data.files);
      }
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, type: file.type }),
      });
      if (!presignRes.ok) {
        const body = await presignRes.json().catch(() => ({}));
        throw new Error(body.error || `Presign failed (${presignRes.status})`);
      }
      const { presignedUrl } = await presignRes.json();
      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!uploadRes.ok) {
        throw new Error(`Upload failed (${uploadRes.status})`);
      }
      setFiles([]);
      setNextCursor(null);
      fetchFiles();
    } catch (err) {
      console.error(err);
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/media?key=${encodeURIComponent(deleteTarget.key)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setFiles(prev => prev.filter(f => f.key !== deleteTarget.key));
    } catch (err) {
      console.error(err);
    }
    setDeleteTarget(null);
  };

  const handleCopy = async (key: string) => {
    const file = files.find(f => f.key === key);
    if (!file) return;
    try {
      await navigator.clipboard.writeText(file.url);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      console.error('Copy failed');
    }
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading...' : `${files.length} file${files.length !== 1 ? 's' : ''}${nextCursor ? '+' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <label className={`flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm cursor-pointer ${uploading ? 'opacity-75 pointer-events-none' : ''}`}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4,video/webm"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </label>
            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by filename or path..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-lg mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{search ? 'No files match your filter' : 'No files uploaded yet'}</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? 'Try a different search term.' : 'Upload images and videos to use across your listings.'}
            </p>
            {!search && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
              >
                <Upload className="h-4 w-4" /> Upload your first file
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
              {files.map(file => {
                const Icon = getFileIcon(file.type);
                return (
                  <div key={file.key} className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square relative bg-gray-100">
                      {isImage(file.type) ? (
                        <Image
                          fill
                          src={file.url}
                          alt={getFilename(file.key)}
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {Icon ? <Icon className="h-10 w-10 text-gray-400" /> : <FileText className="h-10 w-10 text-gray-400" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleCopy(file.key)}
                          className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                          title="Copy URL"
                        >
                          {copiedKey === file.key ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gray-700" />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(file)}
                          className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                      {isImage(file.type) && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatSize(file.size)}
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-gray-900 truncate" title={file.key}>
                        {getFilename(file.key)}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatSize(file.size)}
                        {file.lastModified && ` · ${formatTime(file.lastModified)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {nextCursor && (
              <div className="px-6 pb-6 flex justify-center">
                <button
                  onClick={() => fetchFiles(nextCursor)}
                  disabled={loadingMore}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : null}
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete File</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{getFilename(deleteTarget.key)}</span>? This action cannot be undone.
            </p>
            <p className="text-xs text-gray-400 text-center mb-6 break-all bg-gray-50 p-2 rounded">{deleteTarget.key}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
