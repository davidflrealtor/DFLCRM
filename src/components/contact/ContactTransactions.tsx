import React from 'react';
import { Transaction } from '../../types/Transaction';
import { format } from 'date-fns';
import { Home, DollarSign } from 'lucide-react';

interface ContactTransactionsProps {
  transactions: Transaction[];
}

const ContactTransactions: React.FC<ContactTransactionsProps> = ({ transactions }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatAmount = (amount: number | null | undefined) => {
    if (amount == null) return 'N/A';
    try {
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } catch (error) {
      return 'Invalid amount';
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <p className="text-gray-500 text-center py-4">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Home size={20} className="text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.propertyAddress || 'Address not available'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.date ? formatDate(transaction.date) : 'Date not available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign size={20} className="text-green-500" />
                <span className="font-medium text-gray-900">
                  {formatAmount(transaction.amount)}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                !transaction.status ? 'bg-gray-100 text-gray-800' :
                transaction.status === 'Active' ? 'bg-green-100 text-green-800' :
                transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                transaction.status === 'Closed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {transaction.status || 'Status not available'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactTransactions;