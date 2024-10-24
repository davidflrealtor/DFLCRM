import { DEV_MODE } from '../config/constants';
import { addDays, addHours, formatISO } from 'date-fns';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: { email: string }[];
  location?: string;
  colorId?: string;
}

export const EVENT_COLORS = [
  { id: '1', name: 'Lavender', hex: '#7986cb' },
  { id: '2', name: 'Sage', hex: '#33b679' },
  { id: '3', name: 'Grape', hex: '#8e24aa' },
  { id: '4', name: 'Flamingo', hex: '#e67c73' },
  { id: '5', name: 'Banana', hex: '#f6c026' },
  { id: '6', name: 'Tangerine', hex: '#f5511d' },
  { id: '7', name: 'Peacock', hex: '#039be5' },
  { id: '8', name: 'Graphite', hex: '#616161' },
  { id: '9', name: 'Blueberry', hex: '#3f51b5' },
  { id: '10', name: 'Basil', hex: '#0b8043' },
  { id: '11', name: 'Tomato', hex: '#d60000' }
];

// Mock storage key for development
const EVENTS_STORAGE_KEY = 'dev_calendar_events';

// Mock events for development
const getMockEvents = (): CalendarEvent[] => {
  const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const now = new Date();
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      summary: 'Property Viewing',
      description: 'Show 123 Main St to potential buyers',
      start: {
        dateTime: formatISO(addHours(now, 2)),
        timeZone: 'UTC'
      },
      end: {
        dateTime: formatISO(addHours(now, 3)),
        timeZone: 'UTC'
      },
      location: '123 Main St',
      colorId: '2'
    },
    {
      id: '2',
      summary: 'Client Meeting',
      description: 'Discuss listing strategy',
      start: {
        dateTime: formatISO(addDays(now, 1)),
        timeZone: 'UTC'
      },
      end: {
        dateTime: formatISO(addDays(addHours(now, 1), 1)),
        timeZone: 'UTC'
      },
      colorId: '7'
    }
  ];

  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(mockEvents));
  return mockEvents;
};

export const listEvents = async (): Promise<CalendarEvent[]> => {
  if (DEV_MODE) {
    return getMockEvents();
  }
  throw new Error('Google Calendar integration is not available in development environment');
};

export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  if (DEV_MODE) {
    const events = getMockEvents();
    const newEvent = {
      ...event,
      id: Date.now().toString()
    };
    events.push(newEvent);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  }
  throw new Error('Google Calendar integration is not available in development environment');
};

export const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  if (DEV_MODE) {
    const events = getMockEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    const updatedEvent = { ...events[eventIndex], ...updates };
    events[eventIndex] = updatedEvent;
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return updatedEvent;
  }
  throw new Error('Google Calendar integration is not available in development environment');
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  if (DEV_MODE) {
    const events = getMockEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
    return;
  }
  throw new Error('Google Calendar integration is not available in development environment');
};