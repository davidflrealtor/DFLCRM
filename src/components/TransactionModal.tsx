import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Transaction, TransactionStatus, TransactionType, ClosingParty, PropertyDetails } from '../types/Transaction';
import { Contact } from '../types/Contact';
import { getStorageItem } from '../utils/localStorage';
import { Building2, DollarSign, Calendar, Users } from 'lucide-react';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> & { id?: number }) => void;
}

const initialPropertyDetails: PropertyDetails = {
  address: '',
  city: '',
  state: '',
  zipCode: '',
  propertyType: 'Single Family',
};

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);
  const [propertyAddress, setPropertyAddress] = useState(transaction?.propertyAddress || '');
  const [clientName, setClientName] = useState(transaction?.clientName || '');
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [status, setStatus] = useState<TransactionStatus>(transaction?.status || 'Active');
  const [type, setType] = useState<TransactionType>(transaction?.type || 'Listing');
  const [contactId, setContactId] = useState(transaction?.contactId?.toString() || '');
  const [closingDate, setClosingDate] = useState(transaction?.closingDate || '');
  const [contractDate, setContractDate] = useState(transaction?.contractDate || '');
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>(
    transaction?.propertyDetails || initialPropertyDetails
  );
  const [closingParties, setClosingParties] = useState<ClosingParty[]>(
    transaction?.closingParties || []
  );

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: () => getStorageItem('crm_contacts', []),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTransaction = {
      id: transaction?.id,
      date,
      propertyAddress,
      clientName,
      amount: parseFloat(amount),
      status,
      type,
      contactId: parseInt(contactId),
      closingDate,
      contractDate,
      propertyDetails,
      closingParties,
      documents: transaction?.documents || [],
      notes: transaction?.notes || '',
      relatedTaskIds: transaction?.relatedTaskIds || [],
      relatedNoteIds: transaction?.relatedNoteIds || [],
    };

    onSave(newTransaction);
  };

  const validateForm = (): boolean => {
    if (!date || !propertyAddress || !clientName || !amount) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const addClosingParty = () => {
    const newParty: ClosingParty = {
      id: Date.now(),
      name: '',
      role: 'Buyer',
      email: '',
      phone: '',
      isPrimary: false,
    };
    setClosingParties([...closingParties, newParty]);
  };

  const updateClosingParty = (id: number, updates: Partial<ClosingParty>) => {
    setClosingParties(parties =>
      parties.map(party =>
        party.id === id ? { ...party, ...updates } : party
      )
    );
  };

  const removeClosingParty = (id: number) => {
    setClosingParties(parties => parties.filter(party => party.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {transaction ? 'Edit Transaction' : 'Create Transaction'}
          </h2>
          <div className="flex gap-2">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Listing">Listing</option>
                    <option value="Closing">Closing</option>
                    <option value="Rental Listing">Rental Listing</option>
                    <option value="Lease">Lease</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Property Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Off Market">Off Market</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Property Details</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    value={propertyDetails.address}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={propertyDetails.city}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, city: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={propertyDetails.state}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, state: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    value={propertyDetails.zipCode}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, zipCode: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type</label>
                  <select
                    value={propertyDetails.propertyType}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, propertyType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Single Family">Single Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-Family">Multi-Family</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">MLS Number</label>
                  <input
                    type="text"
                    value={propertyDetails.mlsNumber || ''}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, mlsNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Closing Parties</h3>
                <button
                  type="button"
                  onClick={addClosingParty}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Party
                </button>
              </div>
              
              <div className="space-y-4">
                {closingParties.map((party) => (
                  <div key={party.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Closing Party</h4>
                      <button
                        type="button"
                        onClick={() => removeClosingParty(party.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={party.name}
                          onChange={(e) => updateClosingParty(party.id, { name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                          value={party.role}
                          onChange={(e) => updateClosingParty(party.id, { role: e.target.value as TransactionRole })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="Buyer">Buyer</option>
                          <option value="Seller">Seller</option>
                          <option value="Buyer Agent">Buyer Agent</option>
                          <option value="Seller Agent">Seller Agent</option>
                          <option value="Title Agent">Title Agent</option>
                          <option value="Lender">Lender</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={party.email}
                          onChange={(e) => updateClosingParty(party.id, { email: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          value={party.phone}
                          onChange={(e) => updateClosingParty(party.id, { phone: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                          type="text"
                          value={party.company || ''}
                          onChange={(e) => updateClosingParty(party.id, { company: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={party.isPrimary}
                          onChange={(e) => updateClosingParty(party.id, { isPrimary: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Primary Contact
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={currentStep === 1 ? onClose : () => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            <button
              type={currentStep === 3 ? 'submit' : 'button'}
              onClick={currentStep === 3 ? undefined : () => setCurrentStep(prev => prev + 1)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {currentStep === 3 ? 'Save Transaction' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;