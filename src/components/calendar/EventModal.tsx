import React from 'react';
import EventForm from './EventForm';
import { CalendarEvent } from '../../services/googleCalendar';
import { X } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: CalendarEvent) => Promise<void>;
  initialData?: Partial<CalendarEvent>;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        <EventForm
          onSubmit={onSubmit}
          onCancel={onClose}
          initialData={initialData}
        />
      </div>
    </div>
  );
};

export default EventModal;