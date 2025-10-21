import { useState, useEffect, useMemo } from 'react';
import type { Subscription, MonthlyStats, SortOption, SortOrder, FilterOptions, Category } from '../types';
import { loadSubscriptions, saveSubscriptions } from '../utils/storage';
import { convertCurrency } from '../utils/currency';
import { getDaysUntil } from '../utils/dates';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    const loaded = loadSubscriptions();
    setSubscriptions(loaded);
  }, []);

  useEffect(() => {
    saveSubscriptions(subscriptions);
  }, [subscriptions]);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: crypto.randomUUID(),
    };
    setSubscriptions([...subscriptions, newSubscription]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (filters.category) {
      result = result.filter(sub => sub.category === filters.category);
    }

    if (filters.currency) {
      result = result.filter(sub => sub.currency === filters.currency);
    }

    return result;
  }, [subscriptions, filters]);

  const sortedSubscriptions = useMemo(() => {
    const sorted = [...filteredSubscriptions].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          const costA = convertCurrency(a.cost, a.currency, 'USD');
          const costB = convertCurrency(b.cost, b.currency, 'USD');
          comparison = costA - costB;
          break;
        case 'date':
          comparison = new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredSubscriptions, sortBy, sortOrder]);

  const stats: MonthlyStats = useMemo(() => {
    const totalUSD = subscriptions.reduce((sum, sub) => {
      const monthly = sub.billingPeriod === 'year' ? sub.cost / 12 : sub.cost;
      return sum + convertCurrency(monthly, sub.currency, 'USD');
    }, 0);

    const totalRUB = subscriptions.reduce((sum, sub) => {
      const monthly = sub.billingPeriod === 'year' ? sub.cost / 12 : sub.cost;
      return sum + convertCurrency(monthly, sub.currency, 'RUB');
    }, 0);

    const byCategory: Record<Category, number> = {
      AI: 0,
      Design: 0,
      Music: 0,
      Video: 0,
      Productivity: 0,
      Other: 0,
    };

    subscriptions.forEach(sub => {
      const monthly = sub.billingPeriod === 'year' ? sub.cost / 12 : sub.cost;
      const amountUSD = convertCurrency(monthly, sub.currency, 'USD');
      byCategory[sub.category] += amountUSD;
    });

    const upcomingPayments = subscriptions
      .map(sub => ({
        subscription: sub,
        daysUntil: getDaysUntil(sub.nextPaymentDate),
      }))
      .filter(p => p.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    const nextPayment = upcomingPayments.length > 0 ? upcomingPayments[0] : undefined;

    return {
      totalUSD,
      totalRUB,
      byCategory,
      nextPayment,
    };
  }, [subscriptions]);

  const getUpcomingPayments = (days: number = 7) => {
    return subscriptions.filter(sub => {
      const daysUntil = getDaysUntil(sub.nextPaymentDate);
      return daysUntil >= 0 && daysUntil <= days;
    });
  };

  const getPaymentNotifications = () => {
    return subscriptions.filter(sub => {
      const daysUntil = getDaysUntil(sub.nextPaymentDate);
      return daysUntil >= 0 && daysUntil <= 3;
    });
  };

  return {
    subscriptions: sortedSubscriptions,
    allSubscriptions: subscriptions,
    stats,
    sortBy,
    sortOrder,
    filters,
    setSortBy,
    setSortOrder,
    setFilters,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getUpcomingPayments,
    getPaymentNotifications,
  };
};
