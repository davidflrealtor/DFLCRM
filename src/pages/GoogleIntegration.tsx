import React, { useState, useEffect } from 'react';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarConnect from '../components/calendar/CalendarConnect';
import CalendarInstructions from '../components/calendar/CalendarInstructions';
import EventList from '../components/calendar/EventList';
import EventModal from '../components/calendar/EventModal';
import { isAuthenticated, signIn, signOut } from '../services/googleAuth';
import { listEvents, createEvent, deleteEvent, CalendarEvent } from '../services/googleCalendar';
import { DEV_MODE } from '../config/constants';

const GoogleIntegration: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchEvents();
    }
  }, [authenticated]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventList = await listEvents();
      setEvents(eventList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    try {
      if (authenticated) {
        await signOut();
        setAuthenticated(false);
        setEvents([]);
      } else {
        await signIn();
        setAuthenticated(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleCreateEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      await createEvent(event);
      await fetchEvents();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  return (
    <div className="p-6">
      <CalendarHeader 
        authenticated={authenticated}
        onAuth={handleAuth}
        onNewEvent={() => setIsModalOpen(true)}
      />

      {!authenticated ? (
        <CalendarConnect onConnect={handleAuth} />
      ) : (
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : (
            <EventList 
              events={events}
              onDelete={handleDeleteEvent}
              onEdit={() => setError('Event editing is not available in development mode')}
            />
          )}
        </div>
      )}

      {DEV_MODE && <CalendarInstructions />}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};

export default GoogleIntegration;