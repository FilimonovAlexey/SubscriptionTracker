import cron from 'node-cron';
import { bot } from '../bot/bot';
import { prisma } from '../services/prisma';

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  } else if (currency === 'RUB') {
    return `${amount.toFixed(2)} ₽`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}

// Helper function for days word
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

// Check and send notifications
async function checkAndSendNotifications() {
  console.log('🔔 Checking for notifications...');

  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: {
          where: { isActive: true },
        },
      },
    });

    for (const user of users) {
      const now = new Date();
      const notificationDate = new Date();
      notificationDate.setDate(now.getDate() + user.notificationDays);
      notificationDate.setHours(0, 0, 0, 0);

      // Find subscriptions that are due on the notification date
      const upcomingSubscriptions = user.subscriptions.filter((sub) => {
        const billingDate = new Date(sub.nextBillingDate);
        billingDate.setHours(0, 0, 0, 0);
        return billingDate.getTime() === notificationDate.getTime();
      });

      if (upcomingSubscriptions.length > 0) {
        // Check if it's the right time to send notification
        const [hours, minutes] = user.notificationTime.split(':').map(Number);
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Send notification if current time matches user's preferred time (within 1 hour window)
        if (currentHour === hours && currentMinute < 60) {
          await sendNotification(user, upcomingSubscriptions);
        }
      }
    }

    console.log('✅ Notification check completed');
  } catch (error) {
    console.error('❌ Error checking notifications:', error);
  }
}

// Send notification to user
async function sendNotification(
  user: any,
  subscriptions: any[]
) {
  try {
    const telegramId = Number(user.telegramId);
    const daysWord = getDaysWord(user.notificationDays);

    if (subscriptions.length === 1) {
      const sub = subscriptions[0];
      const message = `⚠️ *Напоминание о платеже*

${sub.icon || '📦'} *${sub.name}*
💰 ${formatCurrency(sub.price, sub.currency)}

Списание через ${user.notificationDays} ${daysWord}
📅 ${new Date(sub.nextBillingDate).toLocaleDateString('ru-RU')}`;

      await bot.api.sendMessage(telegramId, message, {
        parse_mode: 'Markdown',
      });
    } else {
      let message = `⚠️ *Напоминание о платежах*\n\nЧерез ${user.notificationDays} ${daysWord} будет списано:\n\n`;

      subscriptions.forEach((sub) => {
        message += `${sub.icon || '📦'} *${sub.name}*\n💰 ${formatCurrency(sub.price, sub.currency)}\n\n`;
      });

      const total = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
      message += `📊 Всего: ${formatCurrency(total, subscriptions[0].currency)}`;

      await bot.api.sendMessage(telegramId, message, {
        parse_mode: 'Markdown',
      });
    }

    console.log(`📨 Notification sent to user ${user.telegramId}`);
  } catch (error) {
    console.error(`❌ Error sending notification to user ${user.telegramId}:`, error);
  }
}

// Send immediate notification for subscriptions due today
async function checkTodayPayments() {
  console.log('📅 Checking for today\'s payments...');

  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: {
          where: { isActive: true },
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const user of users) {
      const todaySubscriptions = user.subscriptions.filter((sub) => {
        const billingDate = new Date(sub.nextBillingDate);
        billingDate.setHours(0, 0, 0, 0);
        return billingDate.getTime() === today.getTime();
      });

      if (todaySubscriptions.length > 0) {
        await sendTodayNotification(user, todaySubscriptions);
      }
    }

    console.log('✅ Today\'s payment check completed');
  } catch (error) {
    console.error('❌ Error checking today\'s payments:', error);
  }
}

// Send notification for today's payments
async function sendTodayNotification(user: any, subscriptions: any[]) {
  try {
    const telegramId = Number(user.telegramId);

    if (subscriptions.length === 1) {
      const sub = subscriptions[0];
      const message = `🔴 *Платеж сегодня!*

${sub.icon || '📦'} *${sub.name}*
💰 ${formatCurrency(sub.price, sub.currency)}

Сегодня будет списание средств.`;

      await bot.api.sendMessage(telegramId, message, {
        parse_mode: 'Markdown',
      });
    } else {
      let message = `🔴 *Платежи сегодня!*\n\nСегодня будет списано:\n\n`;

      subscriptions.forEach((sub) => {
        message += `${sub.icon || '📦'} *${sub.name}*\n💰 ${formatCurrency(sub.price, sub.currency)}\n\n`;
      });

      const total = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
      message += `📊 Всего: ${formatCurrency(total, subscriptions[0].currency)}`;

      await bot.api.sendMessage(telegramId, message, {
        parse_mode: 'Markdown',
      });
    }

    console.log(`📨 Today notification sent to user ${user.telegramId}`);
  } catch (error) {
    console.error(`❌ Error sending today notification to user ${user.telegramId}:`, error);
  }
}

// Schedule cron jobs
export function startCronJobs() {
  console.log('⏰ Starting cron jobs...');

  // Run every hour to check for notifications
  cron.schedule('0 * * * *', checkAndSendNotifications);

  // Run at 9 AM every day to check for today's payments
  cron.schedule('0 9 * * *', checkTodayPayments);

  console.log('✅ Cron jobs started');
}
