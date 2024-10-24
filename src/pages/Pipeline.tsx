import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PipelineItem, PipelineStage, PipelineStats } from '../types/Pipeline';
import { Contact } from '../types/Contact';
import PipelineStageView from '../components/pipeline/PipelineStage';
import { getStorageItem, setStorageItem } from '../utils/localStorage';
import { ListFilter, Search } from 'lucide-react';

const PIPELINE_STORAGE_KEY = 'crm_pipeline';

const Pipeline: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: pipelineItems = [] } = useQuery<PipelineItem[]>({
    queryKey: ['pipeline'],
    queryFn: () => getStorageItem(PIPELINE_STORAGE_KEY, []),
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: () => getStorageItem('crm_contacts', []),
  });

  const stats: PipelineStats = {
    new: pipelineItems.filter(item => item.stage === 'New').length,
    engage: pipelineItems.filter(item => item.stage === 'Engage').length,
    future: pipelineItems.filter(item => item.stage === 'Future').length,
    active: pipelineItems.filter(item => item.stage === 'Active').length,
    closed: pipelineItems.filter(item => item.stage === 'Closed').length,
  };

  const updatePipelineMutation = useMutation({
    mutationFn: (items: PipelineItem[]) => {
      setStorageItem(PIPELINE_STORAGE_KEY, items);
      return items;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] });
    },
  });

  const handleMoveStage = (itemId: number, newStage: PipelineStage) => {
    const updatedItems = pipelineItems.map(item =>
      item.id === itemId ? { ...item, stage: newStage } : item
    );
    updatePipelineMutation.mutate(updatedItems);
  };

  const handleAddNew = (stage: PipelineStage) => {
    // This would typically open a modal to create a new pipeline item
    console.log('Add new item to stage:', stage);
  };

  const filteredItems = pipelineItems.filter(item => {
    const contact = contacts.find(c => c.id === item.contactId);
    if (!contact) return false;

    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Pipeline</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search pipeline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Buyer">Buyers</option>
            <option value="Seller">Sellers</option>
            <option value="Agent">Agents</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6">
        <PipelineStageView
          title="New"
          stage="New"
          items={filteredItems.filter(item => item.stage === 'New')}
          contacts={contacts}
          count={stats.new}
          onMoveStage={handleMoveStage}
          onAddNew={handleAddNew}
        />
        <PipelineStageView
          title="Engage"
          stage="Engage"
          items={filteredItems.filter(item => item.stage === 'Engage')}
          contacts={contacts}
          count={stats.engage}
          onMoveStage={handleMoveStage}
          onAddNew={handleAddNew}
        />
        <PipelineStageView
          title="Future"
          stage="Future"
          items={filteredItems.filter(item => item.stage === 'Future')}
          contacts={contacts}
          count={stats.future}
          onMoveStage={handleMoveStage}
          onAddNew={handleAddNew}
        />
        <PipelineStageView
          title="Active"
          stage="Active"
          items={filteredItems.filter(item => item.stage === 'Active')}
          contacts={contacts}
          count={stats.active}
          onMoveStage={handleMoveStage}
          onAddNew={handleAddNew}
        />
        <PipelineStageView
          title="Closed"
          stage="Closed"
          items={filteredItems.filter(item => item.stage === 'Closed')}
          contacts={contacts}
          count={stats.closed}
          onMoveStage={handleMoveStage}
          onAddNew={handleAddNew}
        />
      </div>
    </div>
  );
};

export default Pipeline;