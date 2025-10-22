import api from '../client';
import type { Subscription } from '../../types';

export interface CreateSubscriptionDTO {
  name: string;
  description?: string;
  price: number;
  currency: 'USD' | 'RUB';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category?: string;
  icon?: string;
  color?: string;
}

export interface UpdateSubscriptionDTO extends Partial<CreateSubscriptionDTO> {}

export interface SubscriptionStats {
  monthlyTotal: number;
  yearlyTotal: number;
  byCategory: Record<string, number>;
  nextPayment: Subscription | null;
  totalSubscriptions: number;
}

export const subscriptionApi = {
  // Get all subscriptions
  getAll: async (): Promise<Subscription[]> => {
    const response = await api.get('/subscriptions');
    return response.data.subscriptions;
  },

  // Get single subscription
  getById: async (id: string): Promise<Subscription> => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data.subscription;
  },

  // Create subscription
  create: async (data: CreateSubscriptionDTO): Promise<Subscription> => {
    const response = await api.post('/subscriptions', data);
    return response.data.subscription;
  },

  // Update subscription
  update: async (id: string, data: UpdateSubscriptionDTO): Promise<Subscription> => {
    const response = await api.patch(`/subscriptions/${id}`, data);
    return response.data.subscription;
  },

  // Delete subscription
  delete: async (id: string): Promise<void> => {
    await api.delete(`/subscriptions/${id}`);
  },

  // Get statistics
  getStats: async (): Promise<SubscriptionStats> => {
    const response = await api.get('/subscriptions/stats');
    return response.data;
  },
};
