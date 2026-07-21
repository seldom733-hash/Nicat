'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Search, Filter, MapPin, Star, Compass, X, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toursApi } from '@/lib/api';
import { formatPrice, getCategoryLabel, getMediaUrl } from '@/lib/utils';
import { getLocalizedTour } from '@/lib/utils/translate-tour';
import { serviceCategories, getLocalizedName } from '@/lib/data/filters';
import type { Tour } from '@/lib/api';
import Link from 'next/link';
import FilterSidebar from '@/components/filters/FilterSidebar';
import TourChatWidget from '@/components/chat/TourChatWidget';

export default function ExploreContent() {
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  const t = useTranslations('explore');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  const fetchTours = async (page: number) => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: PAGE_SIZE };
      if (searchQuery) params.q = searchQuery;
      if (selectedCountries.length) params.countries = selectedCountries.join(',');
      if (selectedCities.length) params.cities = selectedCities.join(',');
      if (selectedServices.length) params.services = selectedServices.join(',');
      if (selectedDuration) {
        const [min, max] = selectedDuration.split('-');
        params.minDuration = parseInt(min);
        if (max && max !== '+') params.maxDuration = parseInt(max);
      }
      if (selectedPrice) {
        const [min, max] = selectedPrice.split('-');
        params.minPrice = parseInt(min);
        params.maxPrice = parseInt(max);
      }

      const result = await toursApi.search(params);
      setTours(result.tours);
      setTotalResults(result.total);
    } catch (err) {
      console.error(err);
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to page 1 when filters change, then fetch
  const filtersKey = `${searchQuery}|${selectedCountries.join(',')}|${selectedCities.join(',')}|${selectedServices.join(',')}|${selectedDuration}|${selectedPrice}`;
  const prevFiltersKeyRef = useRef(filtersKey);

  useEffect(() => {
    if (prevFiltersKeyRef.current !== filtersKey) {
      prevFiltersKeyRef.current = filtersKey;
      setCurrentPage(1);
      fetchTours(1);
      return;
    }
    fetchTours(currentPage);
  }, [filtersKey, currentPage]);

  const clearFilters = () => {
    setSelectedCountries([]);
    setSelectedCities([]);
    setSelectedServices([]);
    setSelectedDuration(null);
    setSelectedPrice(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button variant="outline" className="w-full" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {t('filters.title')} ({selectedCountries.length + selectedCities.length + selectedServices.length})
            </Button>
          </div>

          {/* Mobile filter sidebar */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <FilterSidebar
                selectedCountries={selectedCountries}
                onCountriesChange={setSelectedCountries}
                selectedCities={selectedCities}
                onCitiesChange={setSelectedCities}
                selectedServices={selectedServices}
                onServicesChange={setSelectedServices}
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
                selectedPrice={selectedPrice}
                onPriceChange={setSelectedPrice}
                onReset={clearFilters}
              />
            </div>
          )}

          <aside className="lg:w-72 hidden lg:block">
            <FilterSidebar
              selectedCountries={selectedCountries}
              onCountriesChange={setSelectedCountries}
              selectedCities={selectedCities}
              onCitiesChange={setSelectedCities}
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
              selectedPrice={selectedPrice}
              onPriceChange={setSelectedPrice}
              onReset={clearFilters}
            />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
              <p className="text-gray-600">
                {totalResults} {t('results')}
              </p>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={tCommon('search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedServices.map((serviceId) => {
                  let serviceName = serviceId;
                  for (const cat of serviceCategories) {
                    const found = cat.services.find((s) => s.id === serviceId);
                    if (found) { serviceName = getLocalizedName(found, locale); break; }
                  }
                  return (
                    <Badge key={serviceId} variant="secondary" className="gap-1">
                      {serviceName}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedServices(selectedServices.filter((s) => s !== serviceId))} />
                    </Badge>
                  );
                })}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl h-48" />
                    <div className="mt-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => {
                  const localized = getLocalizedTour(tour, locale);
                  return (
                  <Link key={tour.id} href={`/${locale}/tours/${tour.id}`}>
                    <Card className="overflow-hidden cursor-pointer group">
                      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
                        {tour.media && tour.media.length > 0 ? (
                          <img
                            src={getMediaUrl(tour.media[0].url)}
                            alt={localized.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Compass className="h-16 w-16 text-white/50" />
                          </div>
                        )}
                        {tour.media && tour.media.length > 1 && (
                          <span className="absolute bottom-2 left-2 bg-black/55 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                            +{tour.media.length} {t('photosUnit')}
                          </span>
                        )}
                        <div className="absolute top-2 right-2">
                          <TourChatWidget tour={tour} variant="icon" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {localized.city}, {localized.country}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-[11px]">
                            {getCategoryLabel(tour.category, locale)}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {localized.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{tour.averageRating || 'New'}</span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(tour.basePrice)}
                            <span className="text-sm font-normal text-gray-500">
                              {t('featured.perPerson')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Compass className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">{t('noResults')}</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ←
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push('...');
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    typeof item === 'string' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <Button
                        key={item}
                        variant={currentPage === item ? 'default' : 'outline'}
                        size="sm"
                        className={currentPage === item ? 'bg-primary-800 text-white' : ''}
                        onClick={() => setCurrentPage(item)}
                      >
                        {item}
                      </Button>
                    )
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  →
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
