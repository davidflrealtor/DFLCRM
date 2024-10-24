import React from 'react';
import { ListingDetails } from '../../types/Transaction';
import { Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListingInfoProps {
  listingDetails: ListingDetails;
  onUpdate: (updates: Partial<ListingDetails>) => void;
  readOnly?: boolean;
}

const TransactionListingInfo: React.FC<TransactionListingInfoProps> = ({
  listingDetails,
  onUpdate,
  readOnly = false,
}) => {
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">MLS Number</label>
          <input
            type="text"
            value={listingDetails.mlsNumber || ''}
            onChange={(e) => onUpdate({ mlsNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">List Price</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={listingDetails.listPrice}
              onChange={(e) => onUpdate({ listPrice: parseFloat(e.target.value) })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Listing Date</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={listingDetails.listingDate}
              onChange={(e) => onUpdate({ listingDate: e.target.value })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={listingDetails.expirationDate}
              onChange={(e) => onUpdate({ expirationDate: e.target.value })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Days on Market</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={listingDetails.daysOnMarket}
              onChange={(e) => onUpdate({ daysOnMarket: parseInt(e.target.value) })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Listing Term (days)</label>
          <input
            type="number"
            value={listingDetails.listingTerm}
            onChange={(e) => onUpdate({ listingTerm: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Commission (%)</label>
          <input
            type="number"
            step="0.01"
            value={listingDetails.commission || ''}
            onChange={(e) => onUpdate({ commission: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lock Box Number</label>
          <input
            type="text"
            value={listingDetails.lockBoxNumber || ''}
            onChange={(e) => onUpdate({ lockBoxNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Showing Instructions</label>
        <textarea
          value={listingDetails.showingInstructions || ''}
          onChange={(e) => onUpdate({ showingInstructions: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          readOnly={readOnly}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Terms</label>
        <textarea
          value={listingDetails.terms || ''}
          onChange={(e) => onUpdate({ terms: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          readOnly={readOnly}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={listingDetails.uploadedToMls}
          onChange={(e) => onUpdate({ uploadedToMls: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={readOnly}
        />
        <label className="ml-2 block text-sm text-gray-900">
          Uploaded to MLS
        </label>
      </div>
    </div>
  );
};

export default TransactionListingInfo;