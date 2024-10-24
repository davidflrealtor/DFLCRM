import React from 'react';
import { PipelineItem, PipelineStage as PipelineStageType } from '../../types/Pipeline';
import PipelineStageCard from './PipelineStageCard';
import { Contact } from '../../types/Contact';
import { Plus } from 'lucide-react';

interface PipelineStageProps {
  title: string;
  stage: PipelineStageType;
  items: PipelineItem[];
  contacts: Contact[];
  count: number;
  onMoveStage: (itemId: number, newStage: PipelineStageType) => void;
  onAddNew: (stage: PipelineStageType) => void;
}

const PipelineStageView: React.FC<PipelineStageProps> = ({
  title,
  stage,
  items,
  contacts,
  count,
  onMoveStage,
  onAddNew,
}) => {
  return (
    <div className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="font-semibold text-gray-700">{title}</h2>
          <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-sm">
            {count}
          </span>
        </div>
        <button
          onClick={() => onAddNew(stage)}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => {
          const contact = contacts.find((c) => c.id === item.contactId);
          if (!contact) return null;
          
          return (
            <PipelineStageCard
              key={item.id}
              item={item}
              contact={contact}
              onMoveStage={onMoveStage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PipelineStageView;