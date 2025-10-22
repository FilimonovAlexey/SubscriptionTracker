import axios, { AxiosError } from 'axios';
import WebApp from '@twa-dev/sdk';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add Telegram init data
api.interceptors.request.use(
  (config) => {
    const initData = WebApp.initData;
    if (initData) {
      config.headers['X-Telegram-Init-Data'] = initData;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const message = (error.response.data as any)?.message || 'Произошла ошибка';
      console.error('API Error:', message);

      if (error.response.status === 401) {
        WebApp.showAlert('Ошибка аутентификации. Пожалуйста, перезапустите приложение.');
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.message);
      WebApp.showAlert('Ошибка сети. Проверьте подключение к интернету.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
