import React from 'react';
import { Calendar } from 'lucide-react';

interface CalendarConnectProps {
  onConnect: () => void;
}

const CalendarConnect: React.FC<CalendarConnectProps> = ({ onConnect }) => {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Connect your Google Calendar
      </h3>
      <p className="text-gray-500 mb-4">
        Sync your calendar to manage appointments and schedule meetings directly from the CRM.
      </p>
      <button
        onClick={onConnect}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Connect Calendar
      </button>
    </div>
  );
};

export default CalendarConnect;