# Subscription Tracker Backend

Backend для Telegram Mini App "Трекер Подписок" на основе Fastify, Prisma и Grammy.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Настройка переменных окружения
```bash
cp .env.example .env
```

Заполните `.env` файл:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/subscription_tracker"
BOT_TOKEN="your_bot_token_from_botfather"
WEB_APP_URL="https://your-app.vercel.app"
PORT=3000
ALLOWED_ORIGINS="https://your-app.vercel.app,http://localhost:5173"
```

### Инициализация базы данных
```bash
# Генерация Prisma клиента
npm run prisma:generate

# Создание миграций
npm run prisma:migrate

# (Опционально) Открыть Prisma Studio
npm run prisma:studio
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для production
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Subscriptions
- `GET /api/subscriptions` - Получить все подписки
- `GET /api/subscriptions/:id` - Получить подписку
- `POST /api/subscriptions` - Создать подписку
- `PATCH /api/subscriptions/:id` - Обновить подписку
- `DELETE /api/subscriptions/:id` - Удалить подписку
- `GET /api/subscriptions/stats` - Получить статистику

### Users
- `GET /api/users/me` - Получить текущего пользователя
- `PATCH /api/users/me` - Обновить настройки
- `GET /api/users/me/settings` - Получить настройки уведомлений

## 🤖 Telegram Bot

Бот автоматически запускается вместе с сервером и обрабатывает:
- `/start` - Приветствие и ссылка на Web App
- `/settings` - Настройка уведомлений
- `/help` - Справка

## ⏰ Cron Jobs

- Каждый час: проверка предстоящих платежей
- Каждый день в 9:00: уведомления о сегодняшних платежах

## 🚢 Деплой

### Railway
1. Создайте проект на [Railway](https://railway.app)
2. Добавьте PostgreSQL plugin
3. Подключите GitHub репозиторий
4. Укажите root directory: `backend`
5. Настройте переменные окружения
6. Railway автоматически запустит `npm run build && npm start`

### Render
1. Создайте Web Service на [Render](https://render.com)
2. Выберите PostgreSQL как базу данных
3. Root Directory: `backend`
4. Build Command: `npm install && npm run prisma:generate && npm run build`
5. Start Command: `npm run prisma:deploy && npm start`

## 📦 Структура проекта
```
backend/
├── src/
│   ├── bot/              # Telegram бот
│   ├── routes/           # API маршруты
│   ├── services/         # Сервисы (Prisma)
│   ├── middleware/       # Middleware
│   ├── jobs/             # Cron задачи
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Prisma схема
└── package.json
```
