import { DEV_MODE } from '../config/constants';

// Mock storage key for development
const AUTH_STORAGE_KEY = 'dev_google_auth_status';

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

export const isAuthenticated = (): boolean => {
  if (DEV_MODE) {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  }
  return false;
};

export const signIn = async (): Promise<void> => {
  if (DEV_MODE) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    return;
  }
  throw new Error('Google Calendar integration is not available in development environment');
};

export const signOut = async (): Promise<void> => {
  if (DEV_MODE) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  throw new Error('Google Calendar integration is not available in development environment');
};

export const initializeGoogleAuth = async (): Promise<void> => {
  if (!DEV_MODE) {
    throw new Error('Google Calendar integration is not available in development environment');
  }
};