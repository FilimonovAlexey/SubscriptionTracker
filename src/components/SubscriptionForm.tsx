import React, { useState } from 'react';
import type { Currency, BillingPeriod, Category, Subscription } from '../types';
import { serviceTemplates } from '../data/templates';

interface SubscriptionFormProps {
  onSubmit: (subscription: Omit<Subscription, 'id'>) => void;
  onCancel: () => void;
  initialData?: Subscription;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [cost, setCost] = useState(initialData?.cost.toString() || '');
  const [currency, setCurrency] = useState<Currency>(initialData?.currency || 'USD');
  const [nextPaymentDate, setNextPaymentDate] = useState(
    initialData?.nextPaymentDate || new Date().toISOString().split('T')[0]
  );
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
    initialData?.billingPeriod || 'month'
  );
  const [category, setCategory] = useState<Category>(initialData?.category || 'Other');
  const [icon, setIcon] = useState(initialData?.icon || '📦');
  const [color, setColor] = useState(initialData?.color || '#6366f1');

  const handleTemplateSelect = (templateName: string) => {
    const template = serviceTemplates.find(t => t.name === templateName);
    if (template) {
      setName(template.name);
      setCost(template.cost.toString());
      setCurrency(template.currency);
      setBillingPeriod(template.billingPeriod);
      setCategory(template.category);
      setIcon(template.icon);
      setColor(template.color);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      cost: parseFloat(cost),
      currency,
      nextPaymentDate,
      billingPeriod,
      category,
      icon,
      color,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? 'Редактировать подписку' : 'Новая подписка'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Шаблон сервиса</label>
          <select
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleTemplateSelect(e.target.value)}
            defaultValue=""
          >
            <option value="">Выберите сервис или создайте свой</option>
            {serviceTemplates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.icon} {template.name} - ${template.cost}/{template.billingPeriod === 'month' ? 'мес' : 'год'}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Стоимость</label>
              <input
                type="number"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Валюта</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="RUB">RUB (₽)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Дата следующего платежа</label>
            <input
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Период оплаты</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBillingPeriod('month')}
                className={`py-2 px-4 rounded-lg border ${
                  billingPeriod === 'month'
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-dark-bg border-dark-border'
                }`}
              >
                Месяц
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('year')}
                className={`py-2 px-4 rounded-lg border ${
                  billingPeriod === 'year'
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-dark-bg border-dark-border'
                }`}
              >
                Год
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AI">AI</option>
              <option value="Design">Design</option>
              <option value="Music">Music</option>
              <option value="Video">Video</option>
              <option value="Productivity">Productivity</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Иконка</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="📦"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Цвет</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 bg-dark-bg border border-dark-border rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {initialData ? 'Сохранить' : 'Добавить'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-dark-bg hover:bg-dark-border text-gray-300 font-medium py-2 px-4 rounded-lg transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
