export type TransactionStatus = 'Active' | 'Pending' | 'Closed' | 'Cancelled' | 'Off Market';
export type TransactionType = 'Listing' | 'Closing' | 'Rental Listing' | 'Lease';
export type TransactionRole = 'Buyer' | 'Seller' | 'Buyer Agent' | 'Seller Agent' | 'Title Agent' | 'Lender';

export interface PropertyDetails {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  mlsNumber?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: string;
  yearBuilt?: number;
}

export interface ClosingParty {
  id: number;
  name: string;
  role: TransactionRole;
  email: string;
  phone: string;
  company?: string;
  isPrimary: boolean;
}

export interface ListingDetails {
  mlsNumber?: string;
  listPrice: number;
  minimumPrice?: number;
  maximumPrice?: number;
  commission?: number;
  listingDate: string;
  expirationDate: string;
  daysOnMarket: number;
  listingTerm: number;
  showingInstructions?: string;
  lockBoxNumber?: string;
  terms?: string;
  uploadedToMls: boolean;
}

export interface Transaction {
  id: number;
  date: string | null;
  propertyAddress: string | null;
  clientName: string | null;
  amount: number | null;
  status: TransactionStatus | null;
  type: TransactionType | null;
  contactId: number | null;
  closingDate?: string;
  contractDate?: string;
  propertyDetails?: PropertyDetails;
  listingDetails?: ListingDetails;
  closingParties: ClosingParty[];
  documents: string[];
  notes: string;
  relatedTaskIds: string[];
  relatedNoteIds: number[];
}