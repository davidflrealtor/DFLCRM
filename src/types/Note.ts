export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  contactId?: number; // Reference to a contact
  taskId?: string; // Reference to a task
  transactionId?: number; // Reference to a transaction
}