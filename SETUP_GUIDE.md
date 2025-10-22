# 📘 Полное руководство по настройке Subscription Tracker

Telegram Mini App для управления подписками с push-уведомлениями.

## 📋 Оглавление
1. [Создание Telegram бота](#1-создание-telegram-бота)
2. [Настройка базы данных](#2-настройка-базы-данных)
3. [Деплой Backend](#3-деплой-backend)
4. [Деплой Frontend](#4-деплой-frontend)
5. [Настройка Web App URL](#5-настройка-web-app-url)
6. [Тестирование](#6-тестирование)

---

## 1. Создание Telegram бота

### Шаг 1.1: Создайте бота через @BotFather

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Введите имя бота (например, "Subscription Tracker")
4. Введите username бота (должен заканчиваться на `bot`, например `subscription_tracker_bot`)
5. Сохраните **токен бота** (например, `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Шаг 1.2: Настройте Web App

1. Отправьте команду `/mybots` боту @BotFather
2. Выберите своего бота
3. Нажмите "Bot Settings" → "Menu Button"
4. Выберите "Configure menu button"
5. Введите URL вашего приложения (временно можно указать `https://example.com`, обновим позже)
6. Введите текст кнопки (например, "Открыть приложение")

---

## 2. Настройка базы данных

### Вариант A: Railway (рекомендуется)

1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Создайте новый проект
3. Добавьте PostgreSQL из плагинов
4. Скопируйте `DATABASE_URL` из переменных окружения

### Вариант B: Supabase

1. Зарегистрируйтесь на [Supabase.com](https://supabase.com)
2. Создайте новый проект
3. Перейдите в Settings → Database
4. Скопируйте Connection String (URI)

---

## 3. Деплой Backend

### Шаг 3.1: Подготовка кода

```bash
cd backend
npm install
```

### Шаг 3.2: Деплой на Railway

1. Зайдите на [Railway.app](https://railway.app)
2. Создайте новый проект → Deploy from GitHub repo
3. Выберите репозиторий `FilimonovAlexey/SubscriptionTracker`
4. В настройках проекта:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run prisma:deploy && npm start`

### Шаг 3.3: Настройте переменные окружения

В Railway добавьте следующие переменные:

```
DATABASE_URL=<ваша_database_url_из_шага_2>
BOT_TOKEN=<ваш_токен_из_шага_1.1>
WEB_APP_URL=https://your-app.vercel.app (обновим позже)
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Шаг 3.4: Деплой

Railway автоматически запустит деплой. Дождитесь завершения и скопируйте URL вашего backend (например, `https://your-backend.railway.app`).

---

## 4. Деплой Frontend

### Шаг 4.1: Настройте переменные окружения

Создайте файл `.env`:

```bash
VITE_API_URL=https://your-backend.railway.app
VITE_BOT_USERNAME=your_bot_username
```

### Шаг 4.2: Деплой на Vercel

1. Зайдите на [Vercel.com](https://vercel.com)
2. Импортируйте GitHub репозиторий
3. Настройки проекта:
   - **Root Directory**: `.` (корень)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Добавьте переменные окружения:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_BOT_USERNAME=your_bot_username
   ```

5. Нажмите "Deploy"

### Шаг 4.3: Получите URL

После деплоя скопируйте URL (например, `https://your-app.vercel.app`).

---

## 5. Настройка Web App URL

### Шаг 5.1: Обновите backend переменные

В Railway обновите переменную окружения:
```
WEB_APP_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Шаг 5.2: Обновите бота

1. Откройте [@BotFather](https://t.me/botfather)
2. Отправьте `/mybots`
3. Выберите своего бота → Bot Settings → Menu Button
4. Configure menu button
5. Введите ваш Vercel URL: `https://your-app.vercel.app`

---

## 6. Тестирование

### Шаг 6.1: Откройте бота

1. Найдите своего бота в Telegram по username
2. Отправьте `/start`
3. Нажмите на кнопку "Открыть приложение"

### Шаг 6.2: Проверьте функционал

- ✅ Создайте тестовую подписку
- ✅ Отредактируйте подписку
- ✅ Удалите подписку
- ✅ Проверьте календарь
- ✅ Проверьте статистику
- ✅ Настройте уведомления

### Шаг 6.3: Тестирование уведомлений

Создайте подписку с датой платежа = сегодня + 3 дня (или количество дней из ваших настроек).
В указанное время вы должны получить уведомление в Telegram.

---

## 🎉 Готово!

Ваше приложение полностью настроено и готово к использованию!

## 🆘 Помощь

Если что-то не работает:

1. Проверьте логи в Railway (Backend)
2. Проверьте логи в Vercel (Frontend)
3. Убедитесь, что все переменные окружения правильно настроены
4. Проверьте, что база данных доступна

## 📝 Дополнительные команды бота

- `/start` - Начать работу с ботом
- `/settings` - Настройки уведомлений
- `/help` - Справка

---

**Создано с помощью Claude Code** 🤖
