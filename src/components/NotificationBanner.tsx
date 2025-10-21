import React from 'react';
import type { Subscription } from '../types';
import { getDaysUntil } from '../utils/dates';
import { formatCurrency } from '../utils/currency';

interface NotificationBannerProps {
  notifications: Subscription[];
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 md:p-6 text-white mb-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Предстоящие платежи!</h3>
          <div className="space-y-2">
            {notifications.map(sub => {
              const days = getDaysUntil(sub.nextPaymentDate);
              return (
                <div key={sub.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{sub.icon}</span>
                    <span className="font-medium">{sub.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatCurrency(sub.cost, sub.currency)}
                    </div>
                    <div className="text-sm opacity-90">
                      {days === 0 ? 'Сегодня!' : `Через ${days} ${getDaysWord(days)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const getDaysWord = (days: number): string => {
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
};
