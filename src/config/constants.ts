export const DEV_MODE = import.meta.env.MODE === 'development';

export const APP_CONFIG = {
  name: 'CRM System',
  version: '1.0.0',
  googleCalendar: {
    enabled: true,
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ]
  }
};