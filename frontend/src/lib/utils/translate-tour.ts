import { getLocalizedName, countries } from '@/lib/data/filters';
import { getLocalizedCityName } from '@/lib/data/city-translations';

// Tour content translation map for common tour titles and descriptions
const tourTranslations: Record<string, { ru: string; az: string }> = {
  // Adventure tours
  'Safari in Tanzania': { ru: 'Сафари в Танзании', az: 'Tanzaniyada Safari' },
  'Trekking in Himalayas': { ru: 'Треккинг в Гималаях', az: 'Himalaylarda Trekking' },
  'Scuba Diving Maldives': { ru: 'Дайвинг на Мальдивах', az: 'Maldiv adalarında Dalış' },
  'Cultural Tour Japan': { ru: 'Культурный тур по Японии', az: 'Yaponiya Mədəni Tur' },
  'Photography Iceland': { ru: 'Фототур по Исландии', az: 'İslandiya Foto Tur' },
  'Gastro Tour Italy': { ru: 'Гастротур по Италии', az: 'İtaliya Qastronomiya Turu' },
  
  // Common tour descriptions
  'Incredible journey through mountain trails of Nepal with Everest views': { 
    ru: 'Невероятное путешествие по горным тропам Непала с видом на Эверест', 
    az: 'Nepal dağ yollarında Everest mənzərələri ilə inanılmaz səyahət' 
  },
  'Immerse in ancient Japanese culture: from Kyoto temples to Tokyo neon lights': { 
    ru: 'Погрузитесь в древнюю японскую культуру: от храмов Киото до неоновых огней Токио', 
    az: 'Qədim Yapon mədəniyyətinə qərq olun: Kioto məbədlərindən Tokio neon işıqlarına' 
  },
  'See the Big Five in their natural habitat in Serengeti National Park': { 
    ru: 'Увидьте Большую пятёрку в естественной среде обитания в национальном парке Серенгети', 
    az: 'Serengeti Milli Parkında təbii mühitində Böyük Beşliyi görün' 
  },
  'Explore the underwater world of Maldives with experienced instructors': { 
    ru: 'Исследуйте подводный мир Мальдив с опытными инструкторами', 
    az: 'Təcrübəli instruktorlarla Maldiv adalarının su altı dünyasını kəşf edin' 
  },
  'Wine tasting and Italian cuisine in Tuscany': { 
    ru: 'Дегустация вин и итальянская кухня в Тоскане', 
    az: 'Toskana şərab dadı və İtaliya mətbəxi' 
  },
  'Capture northern lights and dramatic landscapes of Iceland': { 
    ru: 'Запечатлейте северное сияние и драматичные пейзажи Исландии', 
    az: 'İslandiyanın şimal işığını və dramatik mənzərələrini çəkin' 
  },
};

// Translate tour title based on locale
export function translateTourTitle(title: string, locale: string): string {
  if (locale === 'en') return title;
  const translation = tourTranslations[title];
  if (translation) {
    return locale === 'ru' ? translation.ru : translation.az;
  }
  // Return original if no translation found
  return title;
}

// Translate tour description based on locale
export function translateTourDescription(description: string, locale: string): string {
  if (locale === 'en') return description;
  const translation = tourTranslations[description];
  if (translation) {
    return locale === 'ru' ? translation.ru : translation.az;
  }
  return description;
}

// Find country data from filters.ts by name
function findCountryData(countryName: string) {
  return countries.find(c => c.name === countryName || c.nameRu === countryName || c.nameAz === countryName);
}

// Get localized tour location (country + city)
export function getTourLocation(country: string, city: string, locale: string): { country: string; city: string } {
  const countryData = findCountryData(country);
  return {
    country: countryData ? getLocalizedName(countryData, locale) : country,
    city: getLocalizedCityName(city, locale),
  };
}

// Full tour localization
export function getLocalizedTour(tour: {
  title: string;
  description?: string;
  country: string;
  city: string;
}, locale: string) {
  const countryData = findCountryData(tour.country);
  return {
    ...tour,
    title: translateTourTitle(tour.title, locale),
    description: tour.description ? translateTourDescription(tour.description, locale) : tour.description,
    country: countryData ? getLocalizedName(countryData, locale) : tour.country,
    city: getLocalizedCityName(tour.city, locale),
  };
}
