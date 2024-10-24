import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Home, DollarSign, Edit, Trash2, Link, TrendingUp, TrendingDown, AlertCircle, CheckSquare, XCircle } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import { Transaction } from '../types/Transaction';
import { getStorageItem, setStorageItem } from '../utils/localStorage';
import { Contact } from '../types/Contact';
import { Task } from '../types/Task';
import { Note } from '../types/Note';
import { useLocation } from 'react-router-dom';

const TRANSACTIONS_STORAGE_KEY = 'crm_transactions';

const fetchTransactions = async (): Promise<Transaction[]> => {
  return getStorageItem<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
};

const formatAmount = (amount: number | null | undefined): string => {
  if (amount == null) return 'N/A';
  try {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }).replace('$', '');
  } catch (error) {
    console.error('Error formatting amount:', error);
    return 'Error';
  }
};

const Transactions: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: transactions = [], isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: () => getStorageItem('crm_contacts', []),
  });

  const createTransactionMutation = useMutation({
    mutationFn: (newTransaction: Omit<Transaction, 'id'>) => {
      const transactions = getStorageItem<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
      const transaction = { ...newTransaction, id: Date.now() };
      const updatedTransactions = [...transactions, transaction];
      setStorageItem(TRANSACTIONS_STORAGE_KEY, updatedTransactions);
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsModalOpen(false);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: (updatedTransaction: Transaction) => {
      const transactions = getStorageItem<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      );
      setStorageItem(TRANSACTIONS_STORAGE_KEY, updatedTransactions);
      return updatedTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsModalOpen(false);
      setEditingTransaction(null);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (transactionId: number) => {
      const transactions = getStorageItem<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
      const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
      setStorageItem(TRANSACTIONS_STORAGE_KEY, updatedTransactions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleCreateTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    createTransactionMutation.mutate(newTransaction);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    updateTransactionMutation.mutate(updatedTransaction);
  };

  const handleDeleteTransaction = (transactionId: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransactionMutation.mutate(transactionId);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    }
  }, [location]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const statusMatch = filterStatus === 'all' || transaction.status === filterStatus;
      const typeMatch = filterType === 'all' || transaction.type === filterType;
      return statusMatch && typeMatch;
    });
  }, [transactions, filterStatus, filterType]);

  if (isLoading) return <div className="p-6">Loading transactions...</div>;
  if (isError) return <div className="p-6">Error fetching transactions</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          Add Transaction
        </button>
      </div>
      <div className="mb-4 flex space-x-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Off Market">Off Market</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="Listing">Listing</option>
          <option value="Closing">Closing</option>
          <option value="Rental Listing">Rental Listing</option>
          <option value="Lease">Lease</option>
        </select>
      </div>
      {filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <Home size={16} className="inline mr-2" />
                    {transaction.propertyAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    {transaction.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <DollarSign size={16} className="inline mr-2" />
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    {transaction.status === 'Active' && <TrendingUp size={16} className="inline mr-2 text-green-500" />}
                    {transaction.status === 'Pending' && <AlertCircle size={16} className="inline mr-2 text-yellow-500" />}
                    {transaction.status === 'Closed' && <CheckSquare size={16} className="inline mr-2 text-blue-500" />}
                    {transaction.status === 'Cancelled' && <XCircle size={16} className="inline mr-2 text-red-500" />}
                    {transaction.status === 'Off Market' && <TrendingDown size={16} className="inline mr-2 text-gray-500" />}
                    {transaction.status}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <Link size={16} className="inline mr-2" />
                    {contacts.find(c => c.id === transaction.contactId)?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <button
                      onClick={() => {
                        setEditingTransaction(transaction);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No transactions found. Create a new transaction to get started.</p>
      )}
      {isModalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;