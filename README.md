# 💳 Трекер Подписок - Telegram Mini App

Полнофункциональное Telegram Mini App для управления подписками с push-уведомлениями, мультипользовательской базой данных и статистикой.

## ✨ Особенности

### 🎯 Основной функционал
- ✅ CRUD операции для подписок
- ✅ Шаблоны популярных сервисов (ChatGPT, Claude, Midjourney, Netflix и др.)
- ✅ Автоматическая конвертация USD ↔ RUB
- ✅ Интерактивный календарь платежей
- ✅ Статистика и аналитика расходов
- ✅ Экспорт данных в JSON

### 📱 Telegram Integration
- ✅ Telegram Web App SDK
- ✅ Push-уведомления в Telegram
- ✅ Настраиваемое время уведомлений
- ✅ Настраиваемый период (за сколько дней уведомлять)
- ✅ Аутентификация через Telegram
- ✅ Безопасная валидация initData

### 🗄️ Backend возможности
- ✅ Мультипользовательская PostgreSQL база
- ✅ RESTful API
- ✅ Автоматические напоминания (cron)
- ✅ Безопасная аутентификация
- ✅ Rate limiting

## 🛠️ Технологический стек

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (темная тема)
- **@twa-dev/sdk** (Telegram Web App)
- **Axios** (HTTP клиент)

### Backend
- **Node.js** + **Fastify**
- **PostgreSQL** + **Prisma ORM**
- **Grammy** (Telegram Bot API)
- **node-cron** (планировщик задач)

### Деплой
- **Frontend**: Vercel
- **Backend**: Railway/Render
- **Database**: Railway/Supabase

## 🚀 Быстрый старт

### 📖 Полное руководство
См. [SETUP_GUIDE.md](./SETUP_GUIDE.md) для пошаговой инструкции по настройке.

### Локальная разработка

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Настройте .env файл
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

#### Frontend
```bash
npm install
cp .env.example .env
# Настройте .env файл  
npm run dev
```

## 📁 Структура проекта

```
SubscriptionTracker/
├── backend/                  # Backend приложение
│   ├── src/
│   │   ├── bot/             # Telegram бот (Grammy)
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Сервисы (Prisma)
│   │   ├── middleware/      # Middleware (auth)
│   │   ├── jobs/            # Cron задачи
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── src/                      # Frontend приложение
│   ├── api/
│   │   ├── client.ts        # Axios client
│   │   └── services/        # API services
│   ├── components/          # React компоненты
│   ├── hooks/
│   │   └── useTelegramWebApp.ts  # Telegram SDK hook
│   ├── types/               # TypeScript типы
│   ├── utils/               # Утилиты
│   └── App.tsx              # Main component
├── SETUP_GUIDE.md           # Руководство по настройке
└── README.md                # Этот файл
```

## 📡 API Endpoints

### Subscriptions
```
GET    /api/subscriptions         # Получить все подписки
GET    /api/subscriptions/:id     # Получить подписку
POST   /api/subscriptions         # Создать подписку
PATCH  /api/subscriptions/:id     # Обновить подписку
DELETE /api/subscriptions/:id     # Удалить подписку
GET    /api/subscriptions/stats   # Получить статистику
```

### Users
```
GET    /api/users/me              # Получить текущего пользователя
PATCH  /api/users/me              # Обновить настройки
GET    /api/users/me/settings     # Получить настройки уведомлений
```

## 🤖 Команды бота

- `/start` - Приветствие и запуск Web App
- `/settings` - Настройка уведомлений
- `/help` - Справка по использованию

## 🔔 Система уведомлений

### Как это работает

1. **Cron задачи проверяют базу данных каждый час**
2. **Находят подписки, до которых осталось N дней** (настраивается пользователем)
3. **Отправляют уведомление в указанное время** (настраивается)
4. **Дополнительно: уведомления о сегодняшних платежах в 9:00**

### Настройка

Пользователь может настроить:
- **За сколько дней уведомлять**: 1, 3, 7 или 14 дней
- **Время уведомлений**: любое время в формате HH:mm
- **Часовой пояс**: автоматически определяется

## 🔒 Безопасность

- ✅ Валидация Telegram initData через HMAC-SHA256
- ✅ Все API запросы требуют аутентификации
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js для безопасности заголовков
- ✅ CORS настроен только для разрешенных доменов

## 🌐 Переменные окружения

### Backend (.env)
```env
DATABASE_URL=postgresql://...
BOT_TOKEN=your_bot_token
WEB_APP_URL=https://your-app.vercel.app
PORT=3000
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app
VITE_BOT_USERNAME=your_bot_username
```

## 📦 Деплой

### Автоматический деплой

1. **Frontend (Vercel)**:
   - Подключите GitHub репозиторий
   - Vercel автоматически задетектит Vite
   - Добавьте переменные окружения
   - Deploy!

2. **Backend (Railway)**:
   - Подключите GitHub репозиторий
   - Root directory: `backend`
   - Добавьте PostgreSQL plugin
   - Настройте переменные окружения
   - Deploy!

### Подробные инструкции

См. [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🧪 Тестирование

```bash
# Backend
cd backend
npm run dev

# Frontend
npm run dev
```

Откройте https://web.telegram.org/k/#@your_bot_username для тестирования в Telegram Web.

## 📈 Roadmap

- [ ] Импорт данных из CSV/JSON
- [ ] Мультивалютность (больше валют)
- [ ] Интеграция с банковскими API
- [ ] Семейные подписки (shared subscriptions)
- [ ] Аналитика за период
- [ ] Экспорт в PDF
- [ ] Темы оформления
- [ ] Локализация (EN/RU)

## 🤝 Вклад

Приветствуются Pull Requests! Пожалуйста, убедитесь, что:
- Код следует стилю проекта
- Все типы TypeScript корректны
- Добавлена документация для новых функций

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE)

## 🙏 Благодарности

- Создано с помощью **Claude Code** 🤖
- **React** + **TypeScript** + **Tailwind CSS**
- **Telegram Bot API** + **Grammy**
- **Fastify** + **Prisma**

---

**Разработано для Telegram Mini Apps Contest** 🏆
