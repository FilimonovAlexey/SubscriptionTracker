import type { Currency } from '../types';

// Актуальный курс доллара к рублю (статический)
export const USD_TO_RUB_RATE = 95;

export const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) return amount;

  if (from === 'USD' && to === 'RUB') {
    return amount * USD_TO_RUB_RATE;
  }

  if (from === 'RUB' && to === 'USD') {
    return amount / USD_TO_RUB_RATE;
  }

  return amount;
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency === 'USD' ? `$${formatted}` : `${formatted} ₽`;
};

export const formatBothCurrencies = (amount: number, currency: Currency): string => {
  const primary = formatCurrency(amount, currency);
  const converted = convertCurrency(amount, currency, currency === 'USD' ? 'RUB' : 'USD');
  const secondary = formatCurrency(converted, currency === 'USD' ? 'RUB' : 'USD');

  return `${primary} (${secondary})`;
};
