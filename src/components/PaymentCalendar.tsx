import React, { useState } from 'react';
import type { Subscription } from '../types';
import { getMonthDays, isSameDay } from '../utils/dates';
import { formatCurrency } from '../utils/currency';

interface PaymentCalendarProps {
  subscriptions: Subscription[];
}

export const PaymentCalendar: React.FC<PaymentCalendarProps> = ({ subscriptions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();

  const getPaymentsForDate = (date: Date) => {
    return subscriptions.filter(sub => {
      const paymentDate = new Date(sub.nextPaymentDate);
      return isSameDay(date, paymentDate);
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const monthName = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const selectedPayments = selectedDate ? getPaymentsForDate(selectedDate) : [];

  return (
    <div className="bg-dark-card rounded-2xl p-4 md:p-6 border-2 border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold capitalize">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-dark-bg rounded-lg transition"
          >
            ◀
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-dark-bg rounded-lg transition"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {monthDays.map((date, index) => {
          const payments = getPaymentsForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const hasPayments = payments.length > 0;

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
                aspect-square p-1 md:p-2 rounded-lg text-xs md:text-sm transition-all relative
                ${!isCurrentMonth ? 'text-gray-600' : ''}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                ${isSelected ? 'bg-blue-600' : 'hover:bg-dark-bg'}
                ${hasPayments && isCurrentMonth ? 'font-bold' : ''}
              `}
            >
              <div>{date.getDate()}</div>
              {hasPayments && isCurrentMonth && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {payments.slice(0, 3).map((payment, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: payment.color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedPayments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-border">
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            Платежи на {selectedDate?.getDate()}{' '}
            {new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(selectedDate!)}:
          </h3>
          <div className="space-y-2">
            {selectedPayments.map(payment => (
              <div
                key={payment.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-dark-bg"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: payment.color + '20' }}
                >
                  {payment.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{payment.name}</p>
                  <p className="text-xs text-gray-400">{payment.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm" style={{ color: payment.color }}>
                    {formatCurrency(payment.cost, payment.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
