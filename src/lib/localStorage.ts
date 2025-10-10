import { User } from '@supabase/supabase-js';

export interface CachedUserData {
  user: User;
  profile: {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    city?: string;
    user_type?: string;
    onboarded?: boolean;
  };
  timestamp: number;
}

const STORAGE_KEY = 'wervice_auth_data';
const CACHE_DURATION = 60 * 1000; // 15 minutes

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

export const authStorage = {
  set: (data: Omit<CachedUserData, 'timestamp'>) => {
    if (!isClient) return;

    try {
      const cachedData: CachedUserData = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedData));
    } catch (error) {
      console.warn('Failed to save auth data to localStorage:', error);
    }
  },

  get: (): CachedUserData | null => {
    if (!isClient) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data: CachedUserData = JSON.parse(stored);

      // Check if cache is expired
      if (Date.now() - data.timestamp > CACHE_DURATION) {
        authStorage.clear();
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to read auth data from localStorage:', error);
      authStorage.clear();
      return null;
    }
  },

  clear: () => {
    if (!isClient) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear auth data from localStorage:', error);
    }
  },

  isExpired: (): boolean => {
    if (!isClient) return true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return true;

      const data: CachedUserData = JSON.parse(stored);
      return Date.now() - data.timestamp > CACHE_DURATION;
    } catch {
      return true;
    }
  }
};
