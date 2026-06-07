'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, Trash2, FolderOpen, Video } from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  category: string;
  type: string;
  status: string;
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
  additionalImages: string[];
  additionalAlts: string[];
  videoUrl: string;
  beds: string;
  baths: string;
  area: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  transmission: string;
  fuelType: string;
}

const CATEGORY_TYPES: Record<string, string[]> = {
  'Homes': ['House', 'Apartment', 'Commercial'],
  'Lands': ['Land'],
  'Plots': ['Plot'],
  'Rentals': ['House', 'Apartment', 'Land', 'Commercial', 'Plot'],
  'Cars': ['Car', 'Truck', 'Bus', 'Van', 'Mini-bus', 'Pickup', 'Lorry'],
  'Motorcycles': ['Motorcycle'],
};

export default function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<PropertyFormData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'single' | 'multiple' | 'video'>('single');

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      try {
        const res = await fetch(`/api/admin/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data) {
          const meta = data.image_metadata || [];
          const mainMeta = meta[0] || {};
          const addAlts = meta.slice(1).map((m: any) => m.alt || '');
          setFormData({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            location: data.location || '',
            category: data.category || 'Homes',
            type: data.type || 'House',
            status: data.status || 'For Sale',
            imageUrl: data.image_url || '',
            imageAlt: mainMeta.alt || '',
            featured: data.featured ?? false,
            additionalImages: data.images || [],
            additionalAlts: addAlts.length === (data.images || []).length ? addAlts : (data.images || []).map(() => ''),
            videoUrl: data.video_url || '',
            beds: data.beds?.toString() || '',
            baths: data.baths?.toString() || '',
            area: data.area || '',
            make: data.make || '',
            model: data.model || '',
            year: data.year?.toString() || '',
            mileage: data.mileage || '',
            transmission: data.transmission || 'Automatic',
            fuelType: data.fuel_type || 'Petrol',
          });
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setFetching(false);
      }
    }
    fetchProperty();
  }, [id]);

  const set = (field: keyof PropertyFormData, value: string | string[] | boolean) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      if (field === 'category' && typeof value === 'string') next.type = (CATEGORY_TYPES[value] || [])[0] || '';
      return next;
    });
  };

  const openPicker = (mode: 'single' | 'multiple' | 'video') => {
    setPickerMode(mode);
    setIsPickerOpen(true);
  };

  const handlePickerSelect = (item: { url: string }) => {
    if (!formData) return;
    set('imageUrl', item.url);
  };

  const handlePickerSelectMultiple = (items: { url: string }[]) => {
    if (!formData) return;
    set('additionalImages', [...formData.additionalImages, ...items.map(i => i.url)]);
    set('additionalAlts', [...formData.additionalAlts, ...items.map(() => '')]);
  };

  const handleVideoSelect = (item: { url: string }) => {
    if (!formData) return;
    set('videoUrl', item.url);
  };

  const removeAdditionalImage = (index: number) => {
    if (!formData) return;
    set('additionalImages', formData.additionalImages.filter((_, i) => i !== index));
    set('additionalAlts', formData.additionalAlts.filter((_, i) => i !== index));
  };

  const setAdditionalAlt = (index: number, alt: string) => {
    if (!formData) return;
    const alts = [...formData.additionalAlts];
    alts[index] = alt;
    set('additionalAlts', alts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;
    if (!formData.imageUrl) {
      setValidationError('Please select a main image.');
      return;
    }
    setValidationError(null);
    setLoading(true);

    try {
      const imageMetadata: { url: string; alt: string; filename: string }[] = [];
      const filenameFromUrl = (u: string) => u.split('/').pop()?.replace(/-\w{4}\.\w+$/, '') || '';
      if (formData.imageUrl) {
        imageMetadata.push({ url: formData.imageUrl, alt: formData.imageAlt, filename: filenameFromUrl(formData.imageUrl) });
      }
      formData.additionalImages.forEach((url, i) => {
        imageMetadata.push({ url, alt: formData.additionalAlts[i] || '', filename: filenameFromUrl(url) });
      });

      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          location: formData.location,
          category: formData.category,
          type: formData.type,
          status: formData.status,
          image_url: formData.imageUrl,
          featured: formData.featured,
          images: formData.additionalImages.length > 0 ? formData.additionalImages : null,
          image_metadata: imageMetadata,
          video_url: formData.videoUrl || null,
          beds: formData.beds ? parseInt(formData.beds) : null,
          baths: formData.baths ? parseInt(formData.baths) : null,
          area: formData.area || null,
          make: formData.make || null,
          model: formData.model || null,
          year: formData.year ? parseInt(formData.year) : null,
          mileage: formData.mileage || null,
          transmission: formData.transmission || null,
          fuel_type: formData.fuelType || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to update property');
      router.push('/admin/properties');
    } catch (error: any) {
      setValidationError(error.message || 'Error updating property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Property not found</p>
        <button onClick={() => router.push('/admin/properties')} className="mt-4 text-emerald-600 hover:underline">
          Back to Properties
        </button>
      </div>
    );
  }

  const isVehicle = formData.category === 'Cars' || formData.category === 'Motorcycles';
  const isRealEstate = ['Homes', 'Lands', 'Plots', 'Rentals'].includes(formData.category);
  const showRoomDetails = isRealEstate && !['Land', 'Commercial', 'Plot'].includes(formData.type);

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all max-sm:text-base sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const sectionClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => router.push('/admin/properties')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-500 mt-1 text-sm">Update an existing listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {validationError}
          </div>
        )}

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-900 mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Property Title *</label>
              <input type="text" required value={formData.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Luxury 4 Bedroom Villa in Boma" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea required rows={4} value={formData.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the property in detail..." className={inputClass + ' resize-none'} />
            </div>
            <div>
              <label className={labelClass}>Price *</label>
              <input type="text" required value={formData.price} onChange={e => set('price', e.target.value)}
                placeholder="e.g. UGX 450,000,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location *</label>
              <input type="text" required value={formData.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g. Boma, Fort Portal" className={inputClass} />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-900 mb-5">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Category</label>
              <select value={formData.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                {Object.keys(CATEGORY_TYPES).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select value={formData.type} onChange={e => set('type', e.target.value)} className={inputClass}>
                {(CATEGORY_TYPES[formData.category] || []).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={formData.status} onChange={e => set('status', e.target.value)} className={inputClass}>
                <option>For Sale</option><option>For Rent</option><option>Sold</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={e => set('featured', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                Featured on homepage
              </label>
            </div>
          </div>
        </div>

        {isRealEstate && (
          <div className={sectionClass}>
            <h2 className="text-base font-semibold text-gray-900 mb-5">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {showRoomDetails && (
                <>
                  <div><label className={labelClass}>Bedrooms</label><input type="number" min="0" value={formData.beds} onChange={e => set('beds', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Bathrooms</label><input type="number" min="0" value={formData.baths} onChange={e => set('baths', e.target.value)} className={inputClass} /></div>
                </>
              )}
              <div><label className={labelClass}>Area</label><input type="text" value={formData.area} onChange={e => set('area', e.target.value)} placeholder="e.g. 2,500 sq ft" className={inputClass} /></div>
            </div>
          </div>
        )}

        {isVehicle && (
          <div className={sectionClass}>
            <h2 className="text-base font-semibold text-gray-900 mb-5">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className={labelClass}>Make</label><input type="text" value={formData.make} onChange={e => set('make', e.target.value)} placeholder="e.g. Toyota" className={inputClass} /></div>
              <div><label className={labelClass}>Model</label><input type="text" value={formData.model} onChange={e => set('model', e.target.value)} placeholder="e.g. Land Cruiser Prado" className={inputClass} /></div>
              <div><label className={labelClass}>Year</label><input type="number" value={formData.year} onChange={e => set('year', e.target.value)} placeholder="e.g. 2020" className={inputClass} /></div>
              <div><label className={labelClass}>Mileage</label><input type="text" value={formData.mileage} onChange={e => set('mileage', e.target.value)} placeholder="e.g. 85,000 km" className={inputClass} /></div>
              <div>
                <label className={labelClass}>Transmission</label>
                <select value={formData.transmission} onChange={e => set('transmission', e.target.value)} className={inputClass}>
                  <option>Automatic</option><option>Manual</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Fuel Type</label>
                <select value={formData.fuelType} onChange={e => set('fuelType', e.target.value)} className={inputClass}>
                  <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-900 mb-6">Media</h2>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Main Image *</label>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => openPicker('single')}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <FolderOpen className="h-5 w-5 text-gray-500" />
                  Browse Media Library
                </button>
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => set('imageUrl', '')}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors align-middle"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Alt text (for SEO)</label>
                <input
                  type="text"
                  value={formData.imageAlt}
                  onChange={e => set('imageAlt', e.target.value)}
                  placeholder="e.g. Front view of the 4 bedroom villa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
              {formData.imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 h-48 relative">
                  <Image fill src={formData.imageUrl} alt={formData.imageAlt || 'Preview'} className="object-cover" sizes="600px" />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Additional Images</label>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => openPicker('multiple')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <FolderOpen className="h-5 w-5 text-gray-500" />
                  Browse Media Library
                </button>
              </div>
              {formData.additionalImages.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.additionalImages.map((url, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="relative group rounded-lg overflow-hidden border border-gray-200 h-24">
                        <Image fill src={url} alt={formData.additionalAlts[idx] || ''} className="object-cover" sizes="150px" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.additionalAlts[idx] || ''}
                        onChange={e => setAdditionalAlt(idx, e.target.value)}
                        placeholder="Alt text (SEO)"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Video URL</label>
              <div className="mt-1 flex gap-2">
                <input type="url" value={formData.videoUrl} onChange={e => set('videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..." className={inputClass + ' flex-1'} />
                <button
                  type="button"
                  onClick={() => openPicker('video')}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors shrink-0"
                >
                  <Video className="h-5 w-5 text-gray-500" />
                  Browse
                </button>
                {formData.videoUrl && (
                  <button
                    type="button"
                    onClick={() => set('videoUrl', '')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <button type="button" onClick={() => router.push('/admin/properties')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed text-sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Saving...' : 'Update Property'}
          </button>
        </div>
      </form>

      <MediaPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        mode={pickerMode === 'video' ? 'single' : pickerMode}
        onSelect={pickerMode === 'video' ? handleVideoSelect : handlePickerSelect}
        onSelectMultiple={handlePickerSelectMultiple}
        selectedUrls={
          pickerMode === 'single'
            ? formData.imageUrl ? [formData.imageUrl] : []
            : formData.additionalImages
        }
        accept={pickerMode === 'video' ? ['video'] : ['image']}
      />
    </div>
  );
}
