import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export const useTelegramWebApp = () => {
  const [user, setUser] = useState<TelegramUser | undefined>(WebApp.initDataUnsafe.user);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Initialize Telegram Web App
    WebApp.ready();
    WebApp.expand();
    setIsExpanded(true);

    // Set theme colors
    WebApp.setBackgroundColor('#0f172a');
    WebApp.setHeaderColor('#0f172a');

    // Enable closing confirmation
    WebApp.enableClosingConfirmation();

    // Update user if available
    if (WebApp.initDataUnsafe.user) {
      setUser(WebApp.initDataUnsafe.user as TelegramUser);
    }

    // Cleanup
    return () => {
      WebApp.disableClosingConfirmation();
    };
  }, []);

  const showAlert = (message: string) => {
    WebApp.showAlert(message);
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      WebApp.showConfirm(message, resolve);
    });
  };

  const showPopup = (params: {
    title?: string;
    message: string;
    buttons?: { id?: string; type?: string; text?: string }[];
  }): Promise<string> => {
    return new Promise((resolve) => {
      WebApp.showPopup(params, resolve);
    });
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    WebApp.HapticFeedback.impactOccurred(type);
  };

  const notificationOccurred = (type: 'error' | 'success' | 'warning') => {
    WebApp.HapticFeedback.notificationOccurred(type);
  };

  const openLink = (url: string, options?: { try_instant_view?: boolean }) => {
    WebApp.openLink(url, options);
  };

  const openTelegramLink = (url: string) => {
    WebApp.openTelegramLink(url);
  };

  const close = () => {
    WebApp.close();
  };

  return {
    user,
    initData: WebApp.initData,
    initDataUnsafe: WebApp.initDataUnsafe,
    themeParams: WebApp.themeParams,
    colorScheme: WebApp.colorScheme,
    isExpanded,
    viewportHeight: WebApp.viewportHeight,
    viewportStableHeight: WebApp.viewportStableHeight,
    platform: WebApp.platform,
    version: WebApp.version,
    showAlert,
    showConfirm,
    showPopup,
    hapticFeedback,
    notificationOccurred,
    openLink,
    openTelegramLink,
    close,
    WebApp,
  };
};
