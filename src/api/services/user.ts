import api from '../client';

export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  notificationDays: number;
  notificationTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSettingsDTO {
  notificationDays?: number;
  notificationTime?: string;
  timezone?: string;
}

export interface UserSettings {
  notificationDays: number;
  notificationTime: string;
  timezone: string;
}

export const userApi = {
  // Get current user
  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data.user;
  },

  // Update user settings
  updateSettings: async (data: UpdateUserSettingsDTO): Promise<User> => {
    const response = await api.patch('/users/me', data);
    return response.data.user;
  },

  // Get user notification settings
  getSettings: async (): Promise<UserSettings> => {
    const response = await api.get('/users/me/settings');
    return response.data;
  },
};
