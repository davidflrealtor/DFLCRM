import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task, TaskType, TaskPriority } from '../types/Task';
import { Contact } from '../types/Contact';
import { Transaction } from '../types/Transaction';
import { getStorageItem } from '../utils/localStorage';
import { Calendar, Clock, User, Building2, Mail } from 'lucide-react';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
}

const taskTypes: { value: TaskType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'followUp', label: 'Follow Up' },
  { value: 'showing', label: 'Showing' },
  { value: 'other', label: 'Other' }
];

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 1, label: 'High' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Low' }
];

const emailTemplates = [
  { id: 'initial-followup', name: 'Initial Follow-up' },
  { id: 'meeting-confirmation', name: 'Meeting Confirmation' },
  { id: 'showing-followup', name: 'Showing Follow-up' },
  { id: 'listing-update', name: 'Listing Update' }
];

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [type, setType] = useState<TaskType>(task?.type || 'followUp');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 2);
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [contactId, setContactId] = useState(task?.contactId?.toString() || '');
  const [transactionId, setTransactionId] = useState(task?.transactionId?.toString() || '');
  const [automated, setAutomated] = useState(task?.automated || false);
  const [emailTemplate, setEmailTemplate] = useState(task?.emailTemplate || '');
  const [category, setCategory] = useState(task?.category || '');

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: () => getStorageItem('crm_contacts', [])
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => getStorageItem('crm_transactions', [])
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newTask: Omit<Task, 'id'> = {
      title,
      description,
      type,
      priority,
      status: 'todo',
      dueDate,
      assignee,
      contactId: contactId ? parseInt(contactId) : undefined,
      transactionId: transactionId ? parseInt(transactionId) : undefined,
      automated,
      emailTemplate,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newTask);
  };

  const calculateAutomatedDueDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleTemplateChange = (templateId: string) => {
    setEmailTemplate(templateId);
    if (templateId === 'initial-followup') {
      setTitle('Initial Follow-up Email');
      setDescription('Send initial follow-up email to new lead');
      setType('email');
      setPriority(1);
      setDueDate(calculateAutomatedDueDate(2));
      setAutomated(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-2xl font-bold mb-6">
          {task ? 'Edit Task' : 'Create Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {taskTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {type === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Template</label>
              <select
                value={emailTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a template</option>
                {emailTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value) as TaskPriority)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assignee</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Related Contact</label>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={automated}
              onChange={(e) => setAutomated(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Automate this task
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;