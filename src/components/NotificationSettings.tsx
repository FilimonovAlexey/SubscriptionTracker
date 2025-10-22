import React, { useState, useEffect } from 'react';
import { userApi, type UserSettings } from '../api/services/user';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export const NotificationSettings: React.FC = () => {
  const { hapticFeedback, notificationOccurred } = useTelegramWebApp();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await userApi.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      notificationOccurred('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDaysChange = async (days: number) => {
    if (!settings) return;

    hapticFeedback('light');
    setSaving(true);

    try {
      await userApi.updateSettings({ notificationDays: days });
      setSettings({ ...settings, notificationDays: days });
      notificationOccurred('success');
    } catch (error) {
      console.error('Error updating settings:', error);
      notificationOccurred('error');
    } finally {
      setSaving(false);
    }
  };

  const handleTimeChange = async (time: string) => {
    if (!settings) return;

    setSaving(true);

    try {
      await userApi.updateSettings({ notificationTime: time });
      setSettings({ ...settings, notificationTime: time });
      notificationOccurred('success');
    } catch (error) {
      console.error('Error updating settings:', error);
      notificationOccurred('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-bg rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-dark-bg rounded mb-3"></div>
          <div className="h-10 bg-dark-bg rounded"></div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  const daysOptions = [1, 3, 7, 14];

  return (
    <div className="bg-dark-card rounded-2xl p-6 border-2 border-dark-border">
      <h2 className="text-xl font-bold mb-4">⚙️ Настройки уведомлений</h2>

      <div className="space-y-6">
        {/* Days before notification */}
        <div>
          <label className="block text-sm font-medium mb-3">
            За сколько дней уведомлять
          </label>
          <div className="grid grid-cols-4 gap-2">
            {daysOptions.map((days) => (
              <button
                key={days}
                onClick={() => handleDaysChange(days)}
                disabled={saving}
                className={`py-2 px-3 rounded-lg border font-medium transition ${
                  settings.notificationDays === days
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-dark-bg border-dark-border hover:border-blue-500'
                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {days}д
              </button>
            ))}
          </div>
        </div>

        {/* Time of notification */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Время уведомлений
          </label>
          <input
            type="time"
            value={settings.notificationTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={saving}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-2">
            Вы будете получать уведомления в Telegram в указанное время
          </p>
        </div>

        {/* Current settings summary */}
        <div className="pt-4 border-t border-dark-border">
          <p className="text-sm text-gray-300">
            📨 Вы получите уведомление за{' '}
            <span className="font-semibold text-blue-400">
              {settings.notificationDays} {getDaysWord(settings.notificationDays)}
            </span>{' '}
            до списания в{' '}
            <span className="font-semibold text-blue-400">
              {settings.notificationTime}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

function getDaysWord(days: number): string {
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
}
