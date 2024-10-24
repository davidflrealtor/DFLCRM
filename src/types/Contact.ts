export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'Buyer' | 'Seller' | 'Agent' | 'Other';
  company?: string;
  stage?: string;
  source?: string;
  interestLevel?: string;
  budget?: string;
  timeframe?: string;
  notes?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  lastContact: string;
  relatedTaskIds: string[];
  relatedTransactionIds: number[];
  relatedNoteIds: number[];
}