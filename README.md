# 🌍 Nicat — Social Travel Marketplace

Платформа для социальных путешествий с мульти-пассажирским бронированием, Stripe Connect и реалтайм чатом.

## 🏗️ Архитектура

```
nicat/
├── src/                    # NestJS бэкенд
│   ├── modules/
│   │   ├── auth/           # JWT аутентификация
│   │   ├── users/          # Управление пользователями
│   │   ├── tours/          # CRUD туров
│   │   ├── bookings/       # Мульти-пассажирское бронирование
│   │   ├── payments/       # Stripe Connect интеграция
│   │   ├── chat/           # WebSocket чат
│   │   ├── reviews/        # Отзывы и рейтинги
│   │   ├── dashboard/      # Панель хозяина
│   │   ├── admin/          # Админ панель
│   │   ├── search/         # Поиск туров
│   │   ├── health/         # Health checks
│   │   └── queue/          # BullMQ фоновые задачи
│   ├── core/
│   │   ├── cache/          # Redis кэширование
│   │   └── config/         # Конфигурация (DB, Redis, Queue)
│   └── common/             # Общие сервисы (Encryption, Filters)
├── frontend/               # Next.js фронтенд
│   └── src/
│       ├── app/            # Страницы (App Router)
│       ├── components/     # React компоненты
│       └── lib/            # API клиент, Store, Утилиты
├── nginx/                  # Nginx конфигурация
├── docker-compose.yml      # Разработка
└── docker-compose.prod.yml # Продакшн
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Stripe аккаунт (для платежей)

### 1. Клонирование и установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd nicat

# Установить зависимости бэкенда
npm install

# Установить зависимости фронтенда
cd frontend && npm install && cd ..
```

### 2. Настройка переменных окружения

```bash
# Бэкенд
cp .env.example .env

# Фронтенд
cd frontend
cp .env.example .env.local
cd ..
```

Заполните `.env`:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=nicat

# JWT (сгенерируйте: openssl rand -hex 32)
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Stripe (получите в dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS
CORS_ORIGIN=http://localhost:3001

# Шифрование (сгенерируйте: openssl rand -hex 32)
ENCRYPTION_KEY=your_64_char_hex_key
ENCRYPTION_IV=your_32_char_hex_iv
```

Заполните `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Запуск базы данных

```bash
# Docker (рекомендуется)
docker run -d --name nicat-postgres \
  -e POSTGRES_DB=nicat \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine

docker run -d --name nicat-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 4. Запуск приложения

```bash
# Терминал 1: Бэкенд
npm run start:dev

# Терминал 2: Фронтенд
cd frontend && npm run dev
```

Откройте:
- **Фронтенд**: http://localhost:3001
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs
- **Health**: http://localhost:3000/health

## 📡 API Endpoints

### Auth
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/v1/auth/register` | Регистрация |
| POST | `/api/v1/auth/login` | Вход |
| GET | `/api/v1/auth/profile` | Профиль |
| POST | `/api/v1/auth/refresh` | Обновление токена |

### Tours
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/v1/tours` | Список туров (поиск) |
| GET | `/api/v1/tours/:id` | Детали тура |
| POST | `/api/v1/tours` | Создать тур (Host) |
| PUT | `/api/v1/tours/:id` | Обновить тур |
| DELETE | `/api/v1/tours/:id` | Удалить тур |

### Bookings
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/v1/bookings` | Создать бронирование |
| GET | `/api/v1/bookings` | Мои бронирования |
| POST | `/api/v1/bookings/:id/passengers` | Добавить пассажира |
| PUT | `/api/v1/bookings/:id/cancel` | Отменить бронирование |

### Payments
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/v1/payments/initiate` | Инициализировать платёж |
| POST | `/api/v1/payments/stripe/connect` | Подключить Stripe |
| POST | `/api/v1/payments/payout` | Запросить выплату |
| POST | `/api/v1/payments/stripe/webhook` | Stripe webhook |

### Chat
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/v1/chat/rooms` | Список чатов |
| GET | `/api/v1/chat/rooms/:id/messages` | Сообщения |
| POST | `/api/v1/chat/rooms/:id/messages` | Отправить сообщение |

## 🔧 Технологии

### Бэкенд
- **Framework**: NestJS 11
- **База данных**: PostgreSQL + TypeORM
- **Кэш**: Redis + ioredis
- **Очереди**: BullMQ
- **Платежи**: Stripe Connect
- **Чат**: WebSocket (Socket.IO)
- **Безопасность**: JWT, Helmet, Rate Limiting, AES-256 шифрование

### Фронтенд
- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS 4
- **State**: Zustand
- **Формы**: React Hook Form + Zod
- **HTTP**: Axios

## 🔐 Безопасность

- JWT access + refresh токены
- Шифрование паспортов (AES-256-CBC)
- Rate limiting (100 req/min)
- CORS настройки
- Helmet security headers
- Валидация входных данных (class-validator)

## 📊 Масштабирование

- **Redis кэширование** с TTL
- **BullMQ** для фоновых задач
- **PostgreSQL connection pooling** (20 соединений)
- **Nginx** reverse proxy + load balancing
- **Docker Compose** для продакшна (3 replicas)

## 🐳 Docker

```bash
# Разработка
docker-compose up -d

# Продакшн
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Лицензия

MIT License
