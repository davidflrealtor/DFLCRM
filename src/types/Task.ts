export type TaskPriority = 1 | 2 | 3;
export type TaskStatus = 'todo' | 'inProgress' | 'done';
export type TaskType = 'email' | 'call' | 'meeting' | 'followUp' | 'showing' | 'other';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  dueInDays: number;
  priority: TaskPriority;
  category: string;
  emailTemplate?: string;
  automated: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  contactId?: number;
  transactionId?: number;
  category?: string;
  emailTemplate?: string;
  automated: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}