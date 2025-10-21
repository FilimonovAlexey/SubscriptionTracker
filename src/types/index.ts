export type Currency = 'USD' | 'RUB';

export type BillingPeriod = 'month' | 'year';

export type Category = 'AI' | 'Design' | 'Music' | 'Video' | 'Productivity' | 'Other';

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: Currency;
  nextPaymentDate: string; // ISO date string
  billingPeriod: BillingPeriod;
  category: Category;
  icon?: string;
  color?: string;
}

export interface ServiceTemplate {
  name: string;
  cost: number;
  currency: Currency;
  billingPeriod: BillingPeriod;
  category: Category;
  icon: string;
  color: string;
  description?: string;
}

export interface MonthlyStats {
  totalUSD: number;
  totalRUB: number;
  byCategory: Record<Category, number>;
  nextPayment?: {
    subscription: Subscription;
    daysUntil: number;
  };
}

export type SortOption = 'name' | 'cost' | 'date';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  category?: Category;
  currency?: Currency;
}
