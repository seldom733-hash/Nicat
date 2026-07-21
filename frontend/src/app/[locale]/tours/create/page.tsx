'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Calendar, Users, DollarSign, Upload, X, ImagePlus, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toursApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { serviceCategories, getLocalizedName, countries } from '@/lib/data/filters';
import { getLocalizedCityName } from '@/lib/data/city-translations';
import { getCategoryLabel } from '@/lib/utils';

interface PhotoItem {
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

export default function CreateTourPage() {
  const router = useRouter();
  const t = useTranslations('tours.create');
  const locale = useLocale();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    address: "",
    durationDays: "",
    title: '',
    description: '',
    country: '',
    city: '',
    basePrice: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    category: 'adventure',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedServiceCategories, setExpandedServiceCategories] = useState<string[]>([]);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => getLocalizedName(a, locale).localeCompare(getLocalizedName(b, locale), locale)),
    [locale]
  );
  const selectedCountry = useMemo(
    () => countries.find((c) => c.name === formData.country),
    [formData.country]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [isAuthenticated, authLoading, router, locale]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-800 border-t-transparent rounded-full" />
      </div>
    );
  }

  const MAX_PHOTOS = 10;
  const RECOMMENDED_MIN_PHOTOS = 3;

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (incoming.length === 0) return;

    const room = MAX_PHOTOS - photos.length;
    const accepted = incoming.slice(0, Math.max(room, 0));

    const newItems: PhotoItem[] = accepted.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }));
    setPhotos((prev) => [...prev, ...newItems]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  // Загружает все ещё не загруженные фото на бэкенд (/tours/upload) и
  // помечает каждое как done/error. Возвращает готовый media[] для создания тура.
  const uploadAllPhotos = async (): Promise<{ url: string; caption?: string; sortOrder: number }[]> => {
    const pending = photos.filter((p) => p.status !== 'done');
    if (pending.length === 0) {
      return photos
        .filter((p) => p.uploadedUrl)
        .map((p, i) => ({ url: p.uploadedUrl!, caption: p.file.name, sortOrder: i }));
    }

    setIsUploadingPhotos(true);

    try {
      const uploaded = await toursApi.uploadMedia(pending.map((p) => p.file));
      // Build updated photo list locally — don't rely on stale state after setPhotos
      const updatedPhotos = photos.map((p) => {
        if (p.status === 'done') return p;
        const result = uploaded.shift();
        return result
          ? { ...p, status: 'done', uploadedUrl: result.url }
          : { ...p, status: 'error' };
      });
      setPhotos(updatedPhotos);
      return updatedPhotos
        .filter((p) => p.status === 'done' && p.uploadedUrl)
        .map((p, i) => ({ url: p.uploadedUrl!, caption: p.file.name, sortOrder: i }));
    } catch (err) {
      console.error('Photo upload failed', err);
      setPhotos((prev) => prev.map((p) => (p.status !== 'done' ? { ...p, status: 'error' } : p)));
      return [];
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError('');
    try {
      const media = await uploadAllPhotos();
      const tour = await toursApi.create({
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
        services: selectedServices.length > 0 ? selectedServices : undefined,
        media: media.length > 0 ? media : undefined,
      });
      router.push(`/${locale}/tours/${tour.id}`);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || t('createError');
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('basicInfo')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('tourName')}</label>
                  <Input
                    placeholder={t('tourNamePlaceholder')}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                  <textarea
                    placeholder={t('descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {['adventure', 'cultural', 'nature', 'city', 'beach', 'food', 'photography', 'wellness', 'family', 'luxury', 'budget'].map((cat) => (
                      <option key={cat} value={cat}>{getCategoryLabel(cat, locale)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('services')}</h2>
              <div className="space-y-3">
                {serviceCategories.map((cat) => (
                  <div key={cat.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      onClick={() => setExpandedServiceCategories((prev) =>
                        prev.includes(cat.id) ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                      )}
                    >
                      <span>{getLocalizedName(cat, locale)}</span>
                      <span className="text-xs text-gray-400">
                        {cat.services.filter((s) => selectedServices.includes(s.id)).length} / {cat.services.length}
                      </span>
                    </button>
                    {expandedServiceCategories.includes(cat.id) && (
                      <div className="p-2 space-y-1 bg-white">
                        {cat.services.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                              selectedServices.includes(service.id)
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => setSelectedServices((prev) =>
                              prev.includes(service.id)
                                ? prev.filter((id) => id !== service.id)
                                : [...prev, service.id]
                            )}
                          >
                            <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                              selectedServices.includes(service.id)
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedServices.includes(service.id) && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              )}
                            </div>
                            <span>{getLocalizedName(service, locale)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {selectedServices.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">{t('selectedServices', { count: selectedServices.length })}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('media')}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  photos.length >= RECOMMENDED_MIN_PHOTOS
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {photos.length} / {t('recommendMin', { min: RECOMMENDED_MIN_PHOTOS })}
                </span>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilesSelected(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
              >
                <ImagePlus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {t('dragDrop')} <span className="text-blue-600 font-medium">{t('dragDropLink')}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{t('fileInfo', { maxSize: 8, maxPhotos: MAX_PHOTOS })}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = '';
                  }}
                />
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {photos.map((photo, index) => (
                    <div key={photo.previewUrl} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={photo.previewUrl} alt={t('photoAlt', { index: index + 1 })} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {photo.status === 'uploading' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                        </div>
                      )}
                      {photo.status === 'done' && (
                        <div className="absolute bottom-1.5 right-1.5 bg-white rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {photo.status === 'error' && (
                        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center text-[11px] text-white font-medium">
                          {t('uploadError')}
                        </div>
                      )}
                      {index === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-white/90 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          {t('cover')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isUploadingPhotos && (
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t('uploadingPhotos')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('location')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('country')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value, city: '' })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    >
                      <option value="">{t('country')}...</option>
                      {sortedCountries.map((c) => (
                        <option key={c.code} value={c.name}>{getLocalizedName(c, locale)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    disabled={!formData.country}
                    required
                  >
                    <option value="">{t('city')}...</option>
                    {selectedCountry?.cities
                      .sort((a, b) => getLocalizedCityName(a, locale).localeCompare(getLocalizedCityName(b, locale), locale))
                      .map((city) => (
                        <option key={city} value={city}>{getLocalizedCityName(city, locale)}</option>
                      ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('pricing')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('basePrice')}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('maxParticipants')}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dates')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('startDate')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('endDate')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {submitError}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '...' : t('createTour')}
          </Button>
        </form>
      </div>
    </div>
  );
}
