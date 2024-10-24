import React, { useState } from 'react';
import { CalendarEvent, EVENT_COLORS } from '../../services/googleCalendar';
import { Calendar, Clock, MapPin, Users, FileText, Palette } from 'lucide-react';

interface EventFormProps {
  onSubmit: (event: CalendarEvent) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CalendarEvent>;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState(initialData?.location || '');
  const [attendees, setAttendees] = useState<string>('');
  const [colorId, setColorId] = useState(initialData?.colorId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const eventDetails: CalendarEvent = {
      summary,
      description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location,
      attendees: attendees.split(',').map(email => ({ email: email.trim() })).filter(a => a.email),
      colorId
    };

    await onSubmit(eventDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Title</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Event Color</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={colorId}
            onChange={(e) => setColorId(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Default</option>
            {EVENT_COLORS.map(color => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Attendees (comma-separated emails)</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save Event
        </button>
      </div>
    </form>
  );
};

export default EventForm;