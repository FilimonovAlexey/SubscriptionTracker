import React from 'react';
import type { Subscription } from '../types';
import { formatBothCurrencies } from '../utils/currency';
import { formatDateShort, getDaysUntil } from '../utils/dates';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
}) => {
  const daysUntil = getDaysUntil(subscription.nextPaymentDate);
  const isUrgent = daysUntil >= 0 && daysUntil <= 3;

  return (
    <div
      className={`bg-dark-card rounded-xl p-4 border-2 transition-all hover:scale-[1.02] ${
        isUrgent ? 'border-red-500' : 'border-dark-border'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: subscription.color + '20' }}
        >
          {subscription.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{subscription.name}</h3>
          <p className="text-gray-400 text-sm">{subscription.category}</p>

          <div className="mt-2">
            <p className="text-xl font-bold" style={{ color: subscription.color }}>
              {formatBothCurrencies(subscription.cost, subscription.currency)}
            </p>
            <p className="text-sm text-gray-400">
              за {subscription.billingPeriod === 'month' ? 'месяц' : 'год'}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-400">Следующий платеж:</span>
            <span className={`text-sm font-medium ${isUrgent ? 'text-red-400' : 'text-gray-200'}`}>
              {formatDateShort(subscription.nextPaymentDate)}
              {daysUntil >= 0 && (
                <span className="ml-1">
                  ({daysUntil === 0 ? 'сегодня' : `через ${daysUntil} ${getDaysWord(daysUntil)}`})
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(subscription)}
            className="p-2 hover:bg-dark-bg rounded-lg transition"
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(subscription.id)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition"
            title="Удалить"
          >
            🗑️
          </button>
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
