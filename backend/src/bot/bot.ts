import { Bot, InlineKeyboard } from 'grammy';

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not defined in environment variables');
}

if (!WEB_APP_URL) {
  throw new Error('WEB_APP_URL is not defined in environment variables');
}

export const bot = new Bot(BOT_TOKEN);

// Start command
bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    '🚀 Открыть приложение',
    WEB_APP_URL
  );

  await ctx.reply(
    `👋 Привет, ${ctx.from?.first_name}!

🔔 *Трекер Подписок* - твой персональный помощник для управления подписками.

✨ Функции:
• Отслеживание всех подписок
• Напоминания о платежах
• Статистика расходов
• Календарь платежей

Нажми кнопку ниже, чтобы начать! 👇`,
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    }
  );
});

// Settings command
bot.command('settings', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('За 1 день', 'notify_1')
    .text('За 3 дня', 'notify_3')
    .row()
    .text('За 7 дней', 'notify_7')
    .text('За 14 дней', 'notify_14')
    .row()
    .text('⏰ Изменить время', 'change_time')
    .row()
    .webApp('🌐 Открыть приложение', WEB_APP_URL);

  await ctx.reply(
    `⚙️ *Настройки уведомлений*

Выберите, за сколько дней до списания вы хотите получать уведомления:`,
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    }
  );
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.reply(
    `📚 *Справка*

Доступные команды:
/start - Начать работу с ботом
/settings - Настройки уведомлений
/help - Показать эту справку

💡 Используйте веб-приложение для полного управления подписками!`,
    { parse_mode: 'Markdown' }
  );
});

// Handle callback queries from inline buttons
bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data.startsWith('notify_')) {
    const days = parseInt(data.split('_')[1]);
    // Here you would update the user's settings in the database
    // For now, just acknowledge the selection

    await ctx.answerCallbackQuery({
      text: `✅ Установлено: уведомления за ${days} ${getDaysWord(days)}`,
    });

    await ctx.editMessageText(
      `✅ Настройка сохранена!

Вы будете получать уведомления за ${days} ${getDaysWord(days)} до списания.

Изменить настройки: /settings`,
      { parse_mode: 'Markdown' }
    );
  } else if (data === 'change_time') {
    await ctx.answerCallbackQuery({
      text: 'Откройте приложение для настройки времени',
    });

    const keyboard = new InlineKeyboard().webApp(
      '🌐 Открыть настройки',
      `${WEB_APP_URL}#settings`
    );

    await ctx.editMessageText(
      `⏰ *Настройка времени уведомлений*

Для выбора времени уведомлений откройте приложение:`,
      {
        reply_markup: keyboard,
        parse_mode: 'Markdown',
      }
    );
  }
});

// Handle errors
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Helper function
function getDaysWord(days: number): string {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'дней';
  }

  if (lastDigit === 1) {
    return 'день';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  }

  return 'дней';
}

export async function startBot() {
  console.log('🤖 Starting Telegram bot...');
  await bot.start();
  console.log('✅ Bot is running');
}
