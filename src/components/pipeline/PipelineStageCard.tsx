import React from 'react';
import { PipelineItem } from '../../types/Pipeline';
import { Contact } from '../../types/Contact';
import { format } from 'date-fns';
import { Phone, Mail, MessageSquare, Clock } from 'lucide-react';

interface PipelineStageCardProps {
  item: PipelineItem;
  contact: Contact;
  onMoveStage: (itemId: number, newStage: string) => void;
}

const PipelineStageCard: React.FC<PipelineStageCardProps> = ({ item, contact, onMoveStage }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-3 cursor-move hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{contact.name}</h3>
        <span className="text-sm text-gray-500">
          {format(new Date(item.createdAt), 'MMM d, yyyy')}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {item.type}
        </span>
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
          {item.source}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3 text-gray-600">
        <button className="hover:text-blue-600">
          <Phone size={16} />
        </button>
        <button className="hover:text-blue-600">
          <Mail size={16} />
        </button>
        <button className="hover:text-blue-600">
          <MessageSquare size={16} />
        </button>
        <div className="flex items-center ml-auto text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>
            {format(new Date(item.lastActivity), 'MMM d')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PipelineStageCard;