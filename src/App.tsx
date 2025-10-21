import { useState } from 'react';
import type { Subscription } from './types';
import { useSubscriptions } from './hooks/useSubscriptions';
import { exportToJSON } from './utils/storage';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionCard } from './components/SubscriptionCard';
import { StatsWidget } from './components/StatsWidget';
import { PaymentCalendar } from './components/PaymentCalendar';
import { NotificationBanner } from './components/NotificationBanner';
import { FilterControls } from './components/FilterControls';

function App() {
  const {
    subscriptions,
    allSubscriptions,
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
    getPaymentNotifications,
  } = useSubscriptions();

  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');

  const notifications = getPaymentNotifications();

  const handleAddSubscription = (subscription: Omit<Subscription, 'id'>) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, subscription);
      setEditingSubscription(null);
    } else {
      addSubscription(subscription);
    }
    setShowForm(false);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleDeleteSubscription = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту подписку?')) {
      deleteSubscription(id);
    }
  };

  const handleExport = () => {
    exportToJSON(allSubscriptions);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">💳 Трекер Подписок</h1>
              <p className="text-gray-400">Управляйте своими подписками в одном месте</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-dark-card hover:bg-dark-border border-2 border-dark-border rounded-lg transition font-medium"
              >
                📥 Экспорт
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
              >
                + Добавить подписку
              </button>
            </div>
          </div>
        </header>

        <NotificationBanner notifications={notifications} />

        <div className="mb-6">
          <StatsWidget stats={stats} />
        </div>

        <div className="mb-4">
          <div className="flex gap-2 border-b-2 border-dark-border">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'list'
                  ? 'border-b-2 border-blue-500 text-blue-500 -mb-0.5'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              📋 Список
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'calendar'
                  ? 'border-b-2 border-blue-500 text-blue-500 -mb-0.5'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              📅 Календарь
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          <>
            <FilterControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              filters={filters}
              onSortChange={setSortBy}
              onSortOrderChange={setSortOrder}
              onFilterChange={setFilters}
            />

            {subscriptions.length === 0 ? (
              <div className="bg-dark-card rounded-2xl p-12 text-center border-2 border-dashed border-dark-border">
                <p className="text-xl text-gray-400 mb-4">
                  {allSubscriptions.length === 0
                    ? 'У вас пока нет подписок'
                    : 'Нет подписок, соответствующих выбранным фильтрам'}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
                >
                  Добавить первую подписку
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onEdit={handleEditSubscription}
                    onDelete={handleDeleteSubscription}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <PaymentCalendar subscriptions={allSubscriptions} />
        )}

        {showForm && (
          <SubscriptionForm
            onSubmit={handleAddSubscription}
            onCancel={() => {
              setShowForm(false);
              setEditingSubscription(null);
            }}
            initialData={editingSubscription || undefined}
          />
        )}
      </div>

      <footer className="mt-12 pb-6 text-center text-gray-500 text-sm">
        <p>Сделано с помощью React + TypeScript + Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
