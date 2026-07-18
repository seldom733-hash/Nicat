'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  countries,
  serviceCategories,
  getLocalizedName,
} from '@/lib/data/filters';
import { getLocalizedCityName } from '@/lib/data/city-translations';

interface FilterSidebarProps {
  selectedCountries: string[];
  selectedCities: string[];
  selectedServices: string[];
  onCountriesChange: (countries: string[]) => void;
  onCitiesChange: (cities: string[]) => void;
  onServicesChange: (services: string[]) => void;
  onReset: () => void;
}

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, count, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        className="flex items-center justify-between w-full py-3 px-1 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900">{title}</span>
          {count !== undefined && count > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              {count}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pb-3 px-1">{children}</div>}
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
        checked
          ? 'bg-blue-600 border-blue-600'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </button>
  );
}

export default function FilterSidebar({
  selectedCountries,
  selectedCities,
  selectedServices,
  onCountriesChange,
  onCitiesChange,
  onServicesChange,
  onReset,
}: FilterSidebarProps) {
  const t = useTranslations('explore.filters');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [countrySearch, setCountrySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['adventure', 'maritime', 'cultural']);
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    const query = countrySearch.toLowerCase();
    return countries.filter(
      (c) => getLocalizedName(c, locale).toLowerCase().includes(query)
    );
  }, [countrySearch, locale]);

  const filteredServiceCategories = useMemo(() => {
    if (!serviceSearch) return serviceCategories;
    const query = serviceSearch.toLowerCase();
    return serviceCategories
      .map((cat) => ({
        ...cat,
        services: cat.services.filter(
          (s) => getLocalizedName(s, locale).toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.services.length > 0);
  }, [serviceSearch, locale]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleService = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];
    onServicesChange(newServices);
  };

  // Toggle country: add/remove from selectedCountries, manage its cities
  const toggleCountry = (countryCode: string, countryName: string) => {
    const isSelected = selectedCountries.includes(countryName);

    if (isSelected) {
      // Remove country and all its cities
      const country = countries.find(c => c.code === countryCode);
      const citiesToRemove = country?.cities || [];
      onCountriesChange(selectedCountries.filter(c => c !== countryName));
      onCitiesChange(selectedCities.filter(city => !citiesToRemove.includes(city)));
    } else {
      // Add country
      onCountriesChange([...selectedCountries, countryName]);
    }
  };

  // Toggle city: add/remove from selectedCities
  const toggleCity = (countryCode: string, cityName: string) => {
    // Ensure parent country is selected
    const country = countries.find(c => c.code === countryCode);
    if (!country) return;

    const isSelected = selectedCities.includes(cityName);

    if (isSelected) {
      onCitiesChange(selectedCities.filter(c => c !== cityName));
    } else {
      // Auto-select parent country if not already
      if (!selectedCountries.includes(country.name)) {
        onCountriesChange([...selectedCountries, country.name]);
      }
      onCitiesChange([...selectedCities, cityName]);
    }
  };

  const toggleCountryExpand = (code: string) => {
    setExpandedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const activeFiltersCount =
    selectedCountries.length + selectedCities.length + selectedServices.length;

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{t('title')}</h3>
              {activeFiltersCount > 0 && (
                <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={onReset}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                {tCommon('clear')}
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="px-4 py-2 border-b border-gray-200 bg-blue-50">
            <div className="flex flex-wrap gap-1.5">
              {selectedCountries.map(name => {
                const country = countries.find(c => c.name === name);
                return (
                  <Badge
                    key={name}
                    variant="outline"
                    className="bg-white text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleCountry(country?.code || '', name)}
                  >
                    {country?.name || name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
              {selectedCities.map(city => (
                <Badge
                  key={city}
                  variant="outline"
                  className="bg-white text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100"
                  onClick={() => onCitiesChange(selectedCities.filter(c => c !== city))}
                >
                  {city}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {selectedServices.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-white text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100"
                  onClick={() => onServicesChange([])}
                >
                  {selectedServices.length} services
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Country + City Filter with Checkboxes */}
        <CollapsibleSection
          title={t('countriesAndCities')}
          count={selectedCountries.length + selectedCities.length}
          defaultOpen={true}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchCountry')}
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          <div className="mt-2 max-h-80 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-gray-300">
            {filteredCountries.map((country) => {
              const isCountrySelected = selectedCountries.includes(country.name);
              const isExpanded = expandedCountries.includes(country.code) || isCountrySelected;
              // Count how many cities of this country are selected
              const selectedCitiesCount = country.cities.filter(c => selectedCities.includes(c)).length;

              return (
                <div key={country.code}>
                  {/* Country row with checkbox */}
                  <div className="flex items-center">
                    <Checkbox
                      checked={isCountrySelected}
                      onChange={() => toggleCountry(country.code, country.name)}
                    />
                    <button
                      className="flex-1 text-left px-2 py-1.5 text-sm rounded-lg transition-colors hover:bg-gray-50 text-gray-700 flex items-center justify-between"
                      onClick={() => toggleCountryExpand(country.code)}
                    >                       <span className="ml-2 font-medium">{getLocalizedName(country, locale)}</span>
                      <div className="flex items-center gap-1">
                        {selectedCitiesCount > 0 && (
                          <span className="text-xs text-blue-600 font-medium">
                            {selectedCitiesCount} {t('citiesUnit')}
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Cities nested under country */}
                  {isExpanded && (
                    <div className="ml-6 mt-0.5 mb-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
                      {country.cities.map((city) => {
                        const isCitySelected = selectedCities.includes(city);
                        return (
                          <div
                            key={city}
                            className="flex items-center"
                          >
                            <Checkbox
                              checked={isCitySelected}
                              onChange={() => toggleCity(country.code, city)}
                            />
                            <button
                              className={`flex-1 text-left px-2 py-1 text-xs rounded transition-colors ${
                                isCitySelected
                                  ? 'text-blue-600 font-medium bg-blue-50'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              onClick={() => toggleCity(country.code, city)}
                            >
                              <span className="ml-2">{getLocalizedCityName(city, locale)}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Services Filter */}
        <CollapsibleSection
          title={t('services')}
          count={selectedServices.length}
          defaultOpen={true}
        >
          {filteredServiceCategories.length === 0 && serviceSearch && (              <p className="text-sm text-gray-500 italic text-center py-2">{t('noResults')}</p>
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchServices')}
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          <div className="mt-2 max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
            {filteredServiceCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  onClick={() => toggleCategory(category.id)}
                >                   <span>{getLocalizedName(category, locale)}</span>
                  {expandedCategories.includes(category.id) ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                {expandedCategories.includes(category.id) && (
                  <div className="p-2 space-y-1 bg-white">
                    {category.services.map((service) => (
                      <button
                        key={service.id}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                          selectedServices.includes(service.id)
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => toggleService(service.id)}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                            selectedServices.includes(service.id)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedServices.includes(service.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>                         <span>{getLocalizedName(service, locale)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              className="w-full"
              onClick={onReset}
            >
              <X className="h-4 w-4 mr-2" />
              {t('clearAllFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
