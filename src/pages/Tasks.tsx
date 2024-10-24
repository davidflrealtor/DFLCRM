import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, User, Edit, Trash2, Link, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import { Task, TaskPriority } from '../types/Task';
import { getStorageItem, setStorageItem } from '../utils/localStorage';
import { Contact } from '../types/Contact';
import { Transaction } from '../types/Transaction';

const TASKS_STORAGE_KEY = 'crm_tasks';

const Tasks: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => getStorageItem(TASKS_STORAGE_KEY, [])
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: () => getStorageItem('crm_contacts', [])
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => getStorageItem('crm_transactions', [])
  });

  const createTaskMutation = useMutation({
    mutationFn: (newTask: Omit<Task, 'id'>) => {
      const tasks = getStorageItem<Task[]>(TASKS_STORAGE_KEY, []);
      const task = { ...newTask, id: Date.now().toString() };
      const updatedTasks = [...tasks, task];
      setStorageItem(TASKS_STORAGE_KEY, updatedTasks);
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: Task) => {
      const tasks = getStorageItem<Task[]>(TASKS_STORAGE_KEY, []);
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      setStorageItem(TASKS_STORAGE_KEY, updatedTasks);
      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => {
      const tasks = getStorageItem<Task[]>(TASKS_STORAGE_KEY, []);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setStorageItem(TASKS_STORAGE_KEY, updatedTasks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || task.priority.toString() === filterPriority;
        const matchesType = filterType === 'all' || task.type === filterType;
        return matchesStatus && matchesPriority && matchesType;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'dueDate':
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'priority':
            return a.priority - b.priority;
          case 'type':
            return a.type.localeCompare(b.type);
          default:
            return 0;
        }
      });
  }, [tasks, filterStatus, filterPriority, filterType, sortBy]);

  const handleCreateTask = (newTask: Omit<Task, 'id'>) => {
    createTaskMutation.mutate(newTask);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 1: return 'text-red-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'inProgress':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          Add Task
        </button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded border border-gray-300 p-2"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded border border-gray-300 p-2"
        >
          <option value="all">All Priorities</option>
          <option value="1">High</option>
          <option value="2">Medium</option>
          <option value="3">Low</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded border border-gray-300 p-2"
        >
          <option value="all">All Types</option>
          <option value="email">Email</option>
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="followUp">Follow Up</option>
          <option value="showing">Showing</option>
          <option value="other">Other</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded border border-gray-300 p-2"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusIcon(task.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-500">{task.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {task.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{task.dueDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{task.assignee}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
        />
      )}
    </div>
  );
};

export default Tasks;