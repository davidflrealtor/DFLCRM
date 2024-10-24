import React from 'react';
import { Calendar, Plus, Check, X } from 'lucide-react';

interface CalendarHeaderProps {
  authenticated: boolean;
  onAuth: () => void;
  onNewEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  authenticated,
  onAuth,
  onNewEvent,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Google Calendar Integration</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={onAuth}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              authenticated
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Calendar size={20} />
            <span>{authenticated ? 'Disconnect Calendar' : 'Connect Calendar'}</span>
          </button>
          {authenticated && (
            <button
              onClick={onNewEvent}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Event</span>
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-sm text-gray-600">Status:</span>
        {authenticated ? (
          <span className="flex items-center text-green-600">
            <Check size={16} className="mr-1" />
            Connected
          </span>
        ) : (
          <span className="flex items-center text-red-600">
            <X size={16} className="mr-1" />
            Not Connected
          </span>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;