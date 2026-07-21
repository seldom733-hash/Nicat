'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Calendar, Users, DollarSign, ArrowLeft, Loader2, ImagePlus, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toursApi } from '@/lib/api';
import { getMediaUrl, getCategoryLabel } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import type { Tour } from '@/lib/api';
import Link from 'next/link';

interface PhotoItem {
  file?: File;
  previewUrl: string;
  uploadedUrl?: string;
  status: 'existing' | 'pending' | 'uploading' | 'done' | 'error';
  id?: string;
}

export default function EditTourPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('tours.create');
  const locale = useLocale();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
    city: '',
    address: '',
    basePrice: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    durationDays: '',
    category: 'adventure',
  });

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [isAuthenticated, authLoading, router, locale]);

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tour: Tour = await toursApi.getById(params.id as string);
        setFormData({
          title: tour.title || '',
          description: tour.description || '',
          country: tour.country || '',
          city: tour.city || '',
          address: tour.address || '',
          basePrice: String(tour.basePrice || ''),
          maxParticipants: String(tour.maxGroupSize || ''),
          startDate: tour.startDate ? tour.startDate.split('T')[0] : '',
          endDate: tour.endDate ? tour.endDate.split('T')[0] : '',
          durationDays: String(tour.durationDays || ''),
          category: tour.category || 'adventure',
        });
        // Load existing photos
        if (tour.media && tour.media.length > 0) {
          setPhotos(
            tour.media.map((m) => ({
              id: m.id,
              previewUrl: getMediaUrl(m.url),
              uploadedUrl: m.url,
              status: 'existing' as const,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load tour:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchTour();
  }, [params.id]);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    const newItems: PhotoItem[] = incoming.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending' as const,
    }));
    setPhotos((prev) => [...prev, ...newItems]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const copy = [...prev];
      if (copy[index].file) URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const uploadNewPhotos = async (): Promise<{ url: string; caption?: string; sortOrder: number }[]> => {
    const pending = photos.filter((p) => p.status === 'pending');
    if (pending.length === 0) {
      return photos
        .filter((p) => p.uploadedUrl)
        .map((p, i) => ({ url: p.uploadedUrl!, caption: '', sortOrder: i }));
    }

    try {
      const uploaded = await toursApi.uploadMedia(pending.map((p) => p.file!));
      // Build updated photo list directly — don't rely on stale state after setPhotos
      const updatedPhotos = photos.map((p) => {
        if (p.status !== 'pending') return p;
        const result = uploaded.shift();
        return result ? { ...p, status: 'done', uploadedUrl: result.url } : { ...p, status: 'error' };
      });
      setPhotos(updatedPhotos);
      return updatedPhotos
        .filter((p) => p.status === 'existing' || p.status === 'done')
        .map((p, i) => ({ url: p.uploadedUrl!, caption: '', sortOrder: i }));
    } catch {
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const media = await uploadNewPhotos();
      await toursApi.update(params.id as string, {
        title: formData.title,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        address: formData.address || formData.city,
        basePrice: parseFloat(formData.basePrice) || 0,
        durationDays: parseInt(formData.durationDays) || 1,
        maxGroupSize: parseInt(formData.maxParticipants) || 1,
        startDate: formData.startDate,
        endDate: formData.endDate,
        category: formData.category || undefined,
        media: media.length > 0 ? media : undefined,
      });
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/dashboard`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Tour</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" rows={4} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white">
                    {['adventure', 'cultural', 'nature', 'city', 'beach', 'food', 'photography', 'wellness', 'family', 'luxury', 'budget'].map((cat) => (
                      <option key={cat} value={cat}>{getCategoryLabel(cat, locale)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos ({photos.length})</h2>
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors mb-4">
                <ImagePlus className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">Add more photos</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = ''; }} />
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <div key={photo.previewUrl} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={photo.previewUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {photo.status === 'existing' && (
                        <div className="absolute bottom-1 right-1 bg-green-500 rounded-full"><CheckCircle2 className="h-3.5 w-3.5 text-white" /></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Participants</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
                  <Input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                  <Input type="number" value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })} required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <Input type="number" value={formData.durationDays} onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })} required />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
