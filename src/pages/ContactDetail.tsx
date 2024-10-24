import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStorageItem } from '../utils/localStorage';
import { Contact } from '../types/Contact';
import { Transaction } from '../types/Transaction';
import { Activity } from '../types/Activity';
import ContactHeader from '../components/contact/ContactHeader';
import ContactActivity from '../components/contact/ContactActivity';
import ContactTransactions from '../components/contact/ContactTransactions';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: contact, isLoading: isLoadingContact } = useQuery<Contact>({
    queryKey: ['contact', id],
    queryFn: async () => {
      const contacts = await getStorageItem<Contact[]>('crm_contacts', []);
      const contact = contacts.find(c => c.id === parseInt(id!));
      if (!contact) throw new Error('Contact not found');
      return contact;
    },
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions', id],
    queryFn: async () => {
      const allTransactions = await getStorageItem<Transaction[]>('crm_transactions', []);
      return allTransactions.filter(t => t.contactId === parseInt(id!));
    },
    enabled: !!contact,
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['activities', id],
    queryFn: async () => {
      const allActivities = await getStorageItem<Activity[]>('crm_activities', []);
      return allActivities.filter(a => a.contactId === parseInt(id!));
    },
    enabled: !!contact,
  });

  if (isLoadingContact) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Contact not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ContactHeader contact={contact} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactActivity activities={activities} />
        <ContactTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default ContactDetail;