import React from 'react';
import type { MonthlyStats } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatDateShort } from '../utils/dates';

interface StatsWidgetProps {
  stats: MonthlyStats;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ stats }) => {
  const yearlyUSD = stats.totalUSD * 12;
  const yearlyRUB = stats.totalRUB * 12;

  const topCategories = Object.entries(stats.byCategory)
    .filter(([_, amount]) => amount > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-sm font-medium opacity-90 mb-2">Ежемесячные расходы</h3>
        <div className="text-4xl font-bold mb-1">
          {formatCurrency(stats.totalRUB, 'RUB')}
        </div>
        <div className="text-lg opacity-90">
          {formatCurrency(stats.totalUSD, 'USD')}
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm opacity-90">В год:</p>
          <p className="text-xl font-semibold">
            {formatCurrency(yearlyRUB, 'RUB')} ({formatCurrency(yearlyUSD, 'USD')})
          </p>
        </div>
      </div>

      <div className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Следующий платеж</h3>
        {stats.nextPayment ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: stats.nextPayment.subscription.color + '20' }}
              >
                {stats.nextPayment.subscription.icon}
              </div>
              <div>
                <p className="font-semibold">{stats.nextPayment.subscription.name}</p>
                <p className="text-sm text-gray-400">
                  {formatDateShort(stats.nextPayment.subscription.nextPaymentDate)}
                </p>
              </div>
            </div>
            <p className="text-2xl font-bold mt-3" style={{ color: stats.nextPayment.subscription.color }}>
              {formatCurrency(
                stats.nextPayment.subscription.cost,
                stats.nextPayment.subscription.currency
              )}
            </p>
            <p className={`text-sm mt-2 ${stats.nextPayment.daysUntil <= 3 ? 'text-red-400' : 'text-gray-400'}`}>
              {stats.nextPayment.daysUntil === 0
                ? 'Сегодня!'
                : `Через ${stats.nextPayment.daysUntil} ${getDaysWord(stats.nextPayment.daysUntil)}`}
            </p>
          </>
        ) : (
          <p className="text-gray-400">Нет активных подписок</p>
        )}
      </div>

      {topCategories.length > 0 && (
        <div className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border md:col-span-2">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Расходы по категориям</h3>
          <div className="space-y-3">
            {topCategories.map(([category, amount]) => {
              const percentage = (amount / stats.totalUSD) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{getCategoryName(category)}</span>
                    <span className="text-sm font-semibold">{formatCurrency(amount, 'USD')}</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    AI: 'Искусственный интеллект',
    Design: 'Дизайн',
    Music: 'Музыка',
    Video: 'Видео',
    Productivity: 'Продуктивность',
    Other: 'Другое',
  };
  return names[category] || category;
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
