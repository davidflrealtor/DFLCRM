export interface Activity {
  id: number;
  contactId: number;
  type: 'note' | 'transaction' | 'task' | 'email' | 'call';
  description: string;
  date: string;
  metadata?: Record<string, any>;
}