import React from 'react';
import { format } from 'date-fns';
import { Activity } from '../../types/Activity';
import { Calendar, MessageSquare, DollarSign } from 'lucide-react';

interface ContactActivityProps {
  activities: Activity[];
}

const ContactActivity: React.FC<ContactActivityProps> = ({ activities }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'transaction':
        return <DollarSign size={16} className="text-green-500" />;
      default:
        return <Calendar size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactActivity;