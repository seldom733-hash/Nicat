import { DataSource } from 'typeorm';
import { Tour } from './modules/tours/entities/tour.entity';
import { TourStatus } from './common/constants';
import { User } from './modules/users/entities/user.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { Passenger } from './modules/bookings/entities/passenger.entity';
import { Review } from './modules/reviews/entities/review.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { ChatRoom } from './modules/chat/entities/chat-room.entity';
import { ChatMember } from './modules/chat/entities/chat-member.entity';
import { Message } from './modules/chat/entities/message.entity';
import { ItineraryItem } from './modules/tours/entities/itinerary-item.entity';
import { TourMedia } from './modules/tours/entities/tour-media.entity';
import { Payout } from './modules/payments/entities/payout.entity';
import { StripeEvent } from './modules/payments/entities/stripe-event.entity';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.join(__dirname, '..', '.env') });

// Map our service categories to valid DB TourCategory enum values
const validCategories = [
  'adventure', 'cultural', 'nature', 'city', 'beach',
  'food', 'wine', 'photography', 'wellness', 'family',
  'luxury', 'budget',
];

function mapCategory(raw: string): string {
  return validCategories.includes(raw) ? raw : 'cultural';
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nicat',
  synchronize: false,
  entities: [
    Tour, User, Booking, Passenger, Review, Payment,
    ChatRoom, ChatMember, Message, ItineraryItem, TourMedia,
    Payout, StripeEvent,
  ],
});

const tours = [
  // Adventure
  { title: 'Safari в Серенгети', description: 'Незабываемое сафари по национальному парку Серенгети. Наблюдение за Большой Пятёркой, ночёвка в лагере под звёздами.', country: 'Tanzania', city: 'Arusha', category: 'adventure', difficulty: 'moderate', basePrice: 2500, durationDays: 7, services: ['safari', 'camping', 'nature-tours', 'wildlife-tours', 'photography-tours'] },
  { title: 'Треккинг к Эвересту', description: 'Классический треккинг к базовому лагерю Эвереста через долину Кумбу. Виды на высочайшие пики мира.', country: 'Nepal', city: 'Kathmandu', category: 'adventure', difficulty: 'challenging', basePrice: 1800, durationDays: 14, services: ['trekking', 'hiking', 'camping', 'mountaineering'] },
  { title: 'Рафтинг по реке', description: 'Экстремальный рафтинг по бурной реке. Сплав V и VI категории сложности.', country: 'Argentina', city: 'Bariloche', category: 'adventure', difficulty: 'difficult', basePrice: 350, durationDays: 3, services: ['rafting', 'adventure', 'camping'] },
  { title: 'Прыжки с парашютом в Дубае', description: 'Прыжок с парашютом с высоты 4000 метров с видом на Пальмовый остров и Бурдж-Халифа.', country: 'United Arab Emirates', city: 'Dubai', category: 'adventure', difficulty: 'moderate', basePrice: 600, durationDays: 1, services: ['skydiving', 'luxury-travel'] },
  { title: 'Скалолазание в Йосемити', description: 'Классические маршруты скалолазания в Йосемитском национальном парке.', country: 'United States', city: 'San Francisco', category: 'adventure', difficulty: 'challenging', basePrice: 450, durationDays: 5, services: ['rock-climbing', 'camping', 'national-parks', 'nature-tours'] },
  { title: 'Каякинг в хрустальных пещерах', description: 'Каякинг через ледниковые пещеры и лагуны Патагонии.', country: 'Chile', city: 'Punta Arenas', category: 'adventure', difficulty: 'moderate', basePrice: 800, durationDays: 4, services: ['kayaking', 'nature-tours', 'photography-tours'] },
  { title: 'Банджи-джампинг в Новой Зеландии', description: 'Прыжок с моста Каварау высотой 43 метра.', country: 'New Zealand', city: 'Queenstown', category: 'adventure', difficulty: 'easy', basePrice: 200, durationDays: 1, services: ['bungee-jumping', 'adventure'] },
  { title: 'Велотур по Тоскане', description: 'Покатайтесь на велосипеде по живописным холмам Тосканы.', country: 'Italy', city: 'Florence', category: 'adventure', difficulty: 'easy', basePrice: 900, durationDays: 7, services: ['cycling-tours', 'wine-tours', 'cultural-tours', 'food-tours'] },
  { title: 'Сноуборд в Ниско', description: 'Лучшие трассы для сноуборда в Японии. Порошковый снег и онсены.', country: 'Japan', city: 'Sapporo', category: 'adventure', difficulty: 'moderate', basePrice: 1500, durationDays: 7, services: ['snowboard-trips', 'ski-trips', 'spa-tours', 'food-tours'] },
  { title: 'Джип-туры по Сахаре', description: 'Экспедиция на джипах по бескрайним пескам Сахары.', country: 'Morocco', city: 'Marrakech', category: 'adventure', difficulty: 'moderate', basePrice: 400, durationDays: 3, services: ['jeep-tours', 'safari', 'camping'] },

  // Beach & Maritime
  { title: 'Пляжный отдых на Бали', description: 'Райские пляжи, храмы, рисовые террасы и сёрфинг.', country: 'Indonesia', city: 'Bali', category: 'beach', difficulty: 'easy', basePrice: 1200, durationDays: 10, services: ['beach-holidays', 'surfing', 'yoga-retreats', 'cultural-tours', 'spa-tours'] },
  { title: 'Круиз по Греции', description: 'Круиз по островам Санторини, Миконос, Крит и Родос.', country: 'Greece', city: 'Athens', category: 'beach', difficulty: 'easy', basePrice: 2000, durationDays: 10, services: ['cruise-trips', 'island-hopping', 'beach-holidays', 'food-tours'] },
  { title: 'Дайвинг на Мальдивах', description: 'Лучшие дайвинг-споты мира. Коралловые рифы и скаты манты.', country: 'Maldives', city: 'Malé', category: 'beach', difficulty: 'easy', basePrice: 3000, durationDays: 8, services: ['scuba-diving', 'snorkeling', 'beach-holidays', 'luxury-travel'] },
  { title: 'Парусный круиз по Хорватии', description: 'Парусная яхта через Adriatic море. Дубровник, Хвар, Коркула.', country: 'Croatia', city: 'Dubrovnik', category: 'beach', difficulty: 'easy', basePrice: 1800, durationDays: 7, services: ['sailing', 'island-hopping', 'beach-holidays', 'cultural-tours'] },
  { title: 'Сёрфинг в Никарагуа', description: 'Сёрфинг-отпуск в Пуэрто-Сомбреро. Тёплые волны и лёгкая атмосфера.', country: 'Nicaragua', city: 'San Juan del Sur', category: 'beach', difficulty: 'easy', basePrice: 600, durationDays: 7, services: ['surfing', 'beach-holidays', 'backpacking'] },
  { title: 'Рыбалка в Норвегии', description: 'Морская рыбалка на треску и палтус вдоль фьордов.', country: 'Norway', city: 'Bergen', category: 'beach', difficulty: 'easy', basePrice: 1200, durationDays: 5, services: ['fishing-trips', 'nature-tours', 'cruise-trips'] },

  // Cultural
  { title: 'Культурный тур по Японии', description: 'Храмы Киото, самурайские замки, чайная церемония.', country: 'Japan', city: 'Kyoto', category: 'cultural', difficulty: 'easy', basePrice: 2500, durationDays: 12, services: ['cultural-tours', 'historical-tours', 'food-tours', 'museum-tours'] },
  { title: 'Золотой треугольник Индии', description: 'Дели, Агра, Джайпур. Тадж-Махал и Красный форт.', country: 'India', city: 'New Delhi', category: 'cultural', difficulty: 'easy', basePrice: 800, durationDays: 8, services: ['cultural-tours', 'historical-tours', 'archaeology-tours', 'food-tours'] },
  { title: 'Тур по замкам Шотландии', description: 'Средневековые замки Шотландии. Эдинбург, Стерлинг.', country: 'United Kingdom', city: 'Edinburgh', category: 'cultural', difficulty: 'easy', basePrice: 1500, durationDays: 5, services: ['historical-tours', 'cultural-tours'] },
  { title: 'Путешествие по Шёлковому пути', description: 'Маршрут Шёлкового пути через Узбекистан. Самарканд, Бухара, Хива.', country: 'Uzbekistan', city: 'Tashkent', category: 'cultural', difficulty: 'moderate', basePrice: 1100, durationDays: 10, services: ['cultural-tours', 'historical-tours', 'archaeology-tours'] },
  { title: 'Паломничество в Иерусалим', description: 'Священные места Иерусалима: Храмовая гора, Гроб Господень.', country: 'Israel', city: 'Jerusalem', category: 'cultural', difficulty: 'easy', basePrice: 1800, durationDays: 6, services: ['pilgrimage-tours', 'religious-tours', 'historical-tours'] },
  { title: 'Тур по местам ЮНЕСКО в Перу', description: 'Мачу-Пикчу, Куско, Священная Долина инков.', country: 'Peru', city: 'Cusco', category: 'cultural', difficulty: 'moderate', basePrice: 1400, durationDays: 8, services: ['unesco-tours', 'historical-tours', 'trekking'] },

  // City
  { title: 'Городской уикенд в Париже', description: 'Эйфелева башня, Лувр, Монмартр и французская кухня.', country: 'France', city: 'Paris', category: 'city', difficulty: 'easy', basePrice: 1200, durationDays: 3, services: ['city-breaks', 'food-tours', 'museum-tours', 'shopping-tours'] },
  { title: 'Ночной тур по Берлину', description: 'Легендарные клубы, бары и культурная сцена Берлина.', country: 'Germany', city: 'Berlin', category: 'city', difficulty: 'easy', basePrice: 500, durationDays: 4, services: ['nightlife-tours', 'street-art-tours', 'urban-exploration'] },
  { title: 'Шоппинг-тур по Милану', description: 'Мода, дизайн и итальянский стиль.', country: 'Italy', city: 'Milan', category: 'city', difficulty: 'easy', basePrice: 1000, durationDays: 3, services: ['shopping-tours', 'food-tours', 'city-breaks'] },
  { title: 'Гастрономический тур по Барселоне', description: 'Готический квартал, рынки и тапас. Каталонская кухня.', country: 'Spain', city: 'Barcelona', category: 'city', difficulty: 'easy', basePrice: 800, durationDays: 4, services: ['food-tours', 'cultural-tours', 'architecture-tours'] },
  { title: 'Исследование Стамбула', description: 'Два континента, одна столица. Святая София и Босфор.', country: 'Turkey', city: 'Istanbul', category: 'city', difficulty: 'easy', basePrice: 700, durationDays: 5, services: ['cultural-tours', 'food-tours', 'shopping-tours', 'spa-tours'] },

  // Luxury
  { title: 'VIP-отдых на Мальдивах', description: 'Вилла на воде, персональный дворецкий и SPA.', country: 'Maldives', city: 'Malé', category: 'luxury', difficulty: 'easy', basePrice: 8000, durationDays: 7, services: ['luxury-travel', 'scuba-diving', 'spa-tours', 'beach-holidays'] },
  { title: 'Яхтенный круиз по Карибам', description: 'Роскошная яхта через Багамы и Барбадос.', country: 'Bahamas', city: 'Nassau', category: 'luxury', difficulty: 'easy', basePrice: 12000, durationDays: 10, services: ['luxury-travel', 'sailing', 'beach-holidays'] },
  { title: 'Премиум-курорт в Альпах', description: 'Пятизвёздочный курорт в Швейцарии. Спа и мишленовская кухня.', country: 'Switzerland', city: 'Zermatt', category: 'luxury', difficulty: 'easy', basePrice: 5000, durationDays: 5, services: ['luxury-travel', 'spa-tours', 'ski-trips'] },

  // Budget
  { title: 'Бэкпекинг по Юго-Восточной Азии', description: 'Таиланд → Лаос → Вьетнам → Камбоджа. Хостелы и уличная еда.', country: 'Thailand', city: 'Bangkok', category: 'budget', difficulty: 'easy', basePrice: 500, durationDays: 30, services: ['backpacking', 'budget-travel', 'street-food-tours'] },
  { title: 'Студенческий тур по Европе', description: 'Бюджетный тур по 5 столицам Европы.', country: 'Hungary', city: 'Budapest', category: 'budget', difficulty: 'easy', basePrice: 400, durationDays: 14, services: ['budget-travel', 'hostel-trips', 'city-breaks'] },
  { title: 'Дешёвый отдых в Болгарии', description: 'Солнечный берег и болгарская кухня по доступным ценам.', country: 'Bulgaria', city: 'Varna', category: 'budget', difficulty: 'easy', basePrice: 350, durationDays: 7, services: ['budget-travel', 'beach-holidays', 'food-tours'] },

  // Wellness
  { title: 'Йога-ретрит на Бали', description: 'Исцеляющий ретрит среди рисовых террас.', country: 'Indonesia', city: 'Bali', category: 'wellness', difficulty: 'easy', basePrice: 1500, durationDays: 10, services: ['yoga-retreats', 'meditation-retreats', 'detox-retreats'] },
  { title: 'СПА-тур в Будапеште', description: 'Лечебные термальные ванны Будапешта.', country: 'Hungary', city: 'Budapest', category: 'wellness', difficulty: 'easy', basePrice: 800, durationDays: 4, services: ['spa-tours', 'wellness-retreats', 'cultural-tours'] },
  { title: 'Детокс в Коста-Рике', description: 'Детокс-программа в тропическом лесу.', country: 'Costa Rica', city: 'Arenal', category: 'wellness', difficulty: 'easy', basePrice: 2000, durationDays: 7, services: ['detox-retreats', 'healing-retreats', 'eco-tourism'] },

  // Food & Gastronomy
  { title: 'Гастрономический тур по Италии', description: 'Паста в Риме, пицца в Неаполе и вино в Тоскане.', country: 'Italy', city: 'Rome', category: 'food', difficulty: 'easy', basePrice: 2000, durationDays: 10, services: ['food-tours', 'wine-tours', 'cooking-classes'] },
  { title: 'Кофе-тур по Колумбии', description: 'От фермы до чашки. Кофейные плантации региона Эже.', country: 'Colombia', city: 'Salento', category: 'food', difficulty: 'easy', basePrice: 600, durationDays: 5, services: ['coffee-tours', 'food-tours', 'eco-tourism'] },
  { title: 'Пивной тур по Чехии', description: 'Лучшие пивоварни Пльзени и Ческе-Будеёвице.', country: 'Czech Republic', city: 'Plzeň', category: 'food', difficulty: 'easy', basePrice: 500, durationDays: 4, services: ['brewery-tours', 'food-tours', 'cultural-tours'] },
  { title: 'Тур по уличной еде в Бангкоке', description: 'Пад-тай, том-ям и Mango Sticky Rice.', country: 'Thailand', city: 'Bangkok', category: 'food', difficulty: 'easy', basePrice: 300, durationDays: 3, services: ['street-food-tours', 'food-tours', 'cooking-classes'] },

  // Nature
  { title: 'Наблюдение за птицами в Коста-Рике', description: 'Более 900 видов птиц в тропических лесах.', country: 'Costa Rica', city: 'San José', category: 'nature', difficulty: 'easy', basePrice: 900, durationDays: 8, services: ['bird-watching', 'eco-tourism', 'nature-tours'] },
  { title: 'Эко-тур в Амазонию', description: 'Экспедиция в сердце амазонских джунглей.', country: 'Brazil', city: 'Manaus', category: 'nature', difficulty: 'moderate', basePrice: 1200, durationDays: 7, services: ['eco-tourism', 'jungle-expedition', 'wildlife-tours'] },
  { title: 'Национальные парки США', description: 'Гранд-Каньон, Йеллоустоун, Йосемити.', country: 'United States', city: 'Denver', category: 'nature', difficulty: 'moderate', basePrice: 2000, durationDays: 14, services: ['national-parks', 'road-trips', 'camping', 'hiking'] },
  { title: 'Северное сияние в Исландии', description: 'Охота за авророй бореалис и ледниковые лагуны.', country: 'Iceland', city: 'Reykjavik', category: 'nature', difficulty: 'easy', basePrice: 2500, durationDays: 6, services: ['nature-tours', 'photography-tours'] },

  // Photography
  { title: 'Фото-тур по Исландии', description: 'Водопады, ледники, вулканы и Северное сияние.', country: 'Iceland', city: 'Reykjavik', category: 'photography', difficulty: 'moderate', basePrice: 2800, durationDays: 8, services: ['photography-tours', 'nature-tours', 'drone-photography-tours'] },
  { title: 'Фотография дикой природы в Танзании', description: 'Фотосафари в Серенгети с профессиональными фотографами.', country: 'Tanzania', city: 'Arusha', category: 'photography', difficulty: 'moderate', basePrice: 3200, durationDays: 10, services: ['wildlife-photography', 'safari', 'nature-tours'] },

  // Family
  { title: 'Семейный тур в Диснейленд', description: 'Волшебный отдых для всей семьи.', country: 'France', city: 'Paris', category: 'family', difficulty: 'easy', basePrice: 2000, durationDays: 5, services: ['kids-friendly-tours', 'family-trips'] },
  { title: 'Семейное сафари в Кении', description: 'Сафари для всей семьи в Масаи-Мара.', country: 'Kenya', city: 'Nairobi', category: 'family', difficulty: 'easy', basePrice: 3500, durationDays: 8, services: ['family-trips', 'safari', 'kids-friendly-tours'] },

  // Solo
  { title: 'Социальный тур по Вьетнаму', description: 'Групповой тур для одиночек.', country: 'Vietnam', city: 'Ho Chi Minh City', category: 'budget', difficulty: 'easy', basePrice: 700, durationDays: 14, services: ['social-travel', 'meet-new-people-trips', 'solo-travel'] },
  { title: 'Solo Female — Португалия', description: 'Безопасный тур для путешественниц.', country: 'Portugal', city: 'Lisbon', category: 'budget', difficulty: 'easy', basePrice: 900, durationDays: 10, services: ['solo-female-travel', 'solo-travel', 'food-tours'] },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const tourRepo = AppDataSource.getRepository(Tour);
    const userRepo = AppDataSource.getRepository(User);

    const host = await userRepo.findOne({ where: { email: 'seldom733@gmail.com' } });
    if (!host) {
      console.log('Host user not found. Please register first: seldom733@gmail.com');
      await AppDataSource.destroy();
      process.exit(1);
    }
    console.log(`Using host: ${host.id} (${host.firstName} ${host.lastName})`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const t of tours) {
      try {
        const existing = await tourRepo.findOne({ where: { title: t.title } });
        if (existing) { skipped++; continue; }

        const now = Date.now();
        const tour = tourRepo.create({
          title: t.title,
          description: t.description,
          shortDescription: t.description.substring(0, 100),
          hostId: host.id,
          country: t.country,
          city: t.city,
          address: `Central ${t.city}`,
          category: mapCategory(t.category) as any,
          difficulty: t.difficulty as any,
          language: 'en',
          minGroupSize: 2,
          maxGroupSize: 15,
          basePrice: t.basePrice,
          currency: 'USD',
          commissionRate: 15,
          startDate: new Date(now + 30 * 86400000).toISOString().split('T')[0],
          endDate: new Date(now + (30 + t.durationDays) * 86400000).toISOString().split('T')[0],
          durationDays: t.durationDays,
          status: TourStatus.ACTIVE,
          isFeatured: Math.random() > 0.7,
          services: t.services,
        });

        await tourRepo.save(tour);
        created++;
        console.log(`✓ [${created}] ${t.title} (${t.country}, ${t.city}) [${t.services.length} services]`);
      } catch (err: any) {
        errors++;
        console.error(`✗ ${t.title}: ${err.message}`);
      }
    }

    const total = await tourRepo.count();
    console.log(`\nDone! Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);
    console.log(`Total tours in database: ${total}`);

    await AppDataSource.destroy();
  } catch (error: any) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
