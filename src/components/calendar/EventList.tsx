import React from 'react';
import { Calendar, MapPin, Users, Trash2, Edit } from 'lucide-react';
import { EVENT_COLORS } from '../../services/googleCalendar';

interface Event {
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
  location?: string;
  attendees?: { email: string }[];
  colorId?: string;
}

interface EventListProps {
  events: Event[];
  onDelete: (eventId: string) => Promise<void>;
  onEdit: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onDelete, onEdit }) => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getEventColor = (colorId?: string) => {
    if (!colorId) return 'bg-gray-100';
    const color = EVENT_COLORS.find(c => c.id === colorId);
    return color ? `bg-[${color.hex}]` : 'bg-gray-100';
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
            event.colorId ? `border-l-4 border-l-[${EVENT_COLORS.find(c => c.id === event.colorId)?.hex}]` : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{event.summary}</h3>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-2" />
                {formatDateTime(event.start.dateTime)}
              </div>
              {event.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-2" />
                  {event.location}
                </div>
              )}
              {event.attendees && event.attendees.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Users size={16} className="mr-2" />
                  {event.attendees.map(a => a.email).join(', ')}
                </div>
              )}
              {event.colorId && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Color:</span>
                  <span>{EVENT_COLORS.find(c => c.id === event.colorId)?.name}</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;