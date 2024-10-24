export type PipelineStage = 'New' | 'Engage' | 'Future' | 'Active' | 'Closed';

export interface PipelineItem {
  id: number;
  contactId: number;
  stage: PipelineStage;
  source: string;
  type: 'Buyer' | 'Seller' | 'Agent';
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
  notes: string;
}

export interface PipelineStats {
  new: number;
  engage: number;
  future: number;
  active: number;
  closed: number;
}