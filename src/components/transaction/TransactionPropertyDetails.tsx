import React from 'react';
import { PropertyDetails } from '../../types/Transaction';
import { Building2, Home, Ruler, Calendar } from 'lucide-react';

interface TransactionPropertyDetailsProps {
  propertyDetails: PropertyDetails;
  onUpdate: (updates: Partial<PropertyDetails>) => void;
  readOnly?: boolean;
}

const TransactionPropertyDetails: React.FC<TransactionPropertyDetailsProps> = ({
  propertyDetails,
  onUpdate,
  readOnly = false,
}) => {
  const propertyTypes = [
    'Single Family',
    'Condo',
    'Townhouse',
    'Multi-Family',
    'Land',
    'Commercial',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={propertyDetails.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={propertyDetails.city}
            onChange={(e) => onUpdate({ city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={propertyDetails.state}
            onChange={(e) => onUpdate({ state: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            value={propertyDetails.zipCode}
            onChange={(e) => onUpdate({ zipCode: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Property Type</label>
          <select
            value={propertyDetails.propertyType}
            onChange={(e) => onUpdate({ propertyType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={readOnly}
          >
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <input
            type="number"
            value={propertyDetails.bedrooms || ''}
            onChange={(e) => onUpdate({ bedrooms: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <input
            type="number"
            step="0.5"
            value={propertyDetails.bathrooms || ''}
            onChange={(e) => onUpdate({ bathrooms: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Square Feet</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={propertyDetails.squareFeet || ''}
              onChange={(e) => onUpdate({ squareFeet: parseInt(e.target.value) })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lot Size</label>
          <input
            type="text"
            value={propertyDetails.lotSize || ''}
            onChange={(e) => onUpdate({ lotSize: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year Built</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={propertyDetails.yearBuilt || ''}
              onChange={(e) => onUpdate({ yearBuilt: parseInt(e.target.value) })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPropertyDetails;