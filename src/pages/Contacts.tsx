import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Phone, Mail, Building2, MapPin, Star, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { getStorageItem, setStorageItem } from '../utils/localStorage';
import ContactModal from '../components/ContactModal';
import { Contact } from '../types/Contact';

const CONTACTS_STORAGE_KEY = 'crm_contacts';

const fetchContacts = async (): Promise<Contact[]> => {
  return getStorageItem<Contact[]>(CONTACTS_STORAGE_KEY, []);
};

const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { data: contacts, isLoading, isError } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });

  const createContactMutation = useMutation({
    mutationFn: (newContact: Omit<Contact, 'id'>) => {
      const contacts = getStorageItem<Contact[]>(CONTACTS_STORAGE_KEY, []);
      const contact = {
        ...newContact,
        id: Date.now(),
        relatedTaskIds: [],
        relatedTransactionIds: [],
        relatedNoteIds: [],
        lastContact: new Date().toISOString()
      };
      const updatedContacts = [...contacts, contact];
      setStorageItem(CONTACTS_STORAGE_KEY, updatedContacts);
      return contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsModalOpen(false);
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: (updatedContact: Contact) => {
      const contacts = getStorageItem<Contact[]>(CONTACTS_STORAGE_KEY, []);
      const updatedContacts = contacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      );
      setStorageItem(CONTACTS_STORAGE_KEY, updatedContacts);
      return updatedContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsModalOpen(false);
      setEditingContact(null);
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (contactId: number) => {
      const contacts = getStorageItem<Contact[]>(CONTACTS_STORAGE_KEY, []);
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      setStorageItem(CONTACTS_STORAGE_KEY, updatedContacts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const handleCreateContact = (newContact: Omit<Contact, 'id'>) => {
    createContactMutation.mutate(newContact);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    updateContactMutation.mutate(updatedContact);
  };

  const handleDeleteContact = (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContactMutation.mutate(contactId);
    }
  };

  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || contact.type === filterType;
    const matchesStage = filterStage === 'all' || contact.stage === filterStage;
    const matchesSource = filterSource === 'all' || contact.source === filterSource;

    return matchesSearch && matchesType && matchesStage && matchesSource;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Buyer': return 'bg-green-100 text-green-800';
      case 'Seller': return 'bg-blue-100 text-blue-800';
      case 'Agent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New': return 'bg-yellow-100 text-yellow-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Future': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="p-6">Loading contacts...</div>;
  if (isError) return <div className="p-6">Error fetching contacts</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          Add Contact
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full px-4 py-2 rounded border border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 rounded border border-gray-300 flex items-center gap-2"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="all">All Types</option>
              <option value="Buyer">Buyers</option>
              <option value="Seller">Sellers</option>
              <option value="Agent">Agents</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="all">All Stages</option>
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Future">Future</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="zillow">Zillow</option>
              <option value="realtor">Realtor.com</option>
              <option value="social">Social Media</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts?.map((contact) => (
                <tr 
                  key={contact.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(contact.type)}`}>
                      {contact.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(contact.stage || '')}`}>
                      {contact.stage || 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.source || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.lastContact ? formatDate(contact.lastContact) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${contact.phone}`;
                      }}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Phone size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${contact.email}`;
                      }}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Mail size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingContact(contact);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContact(contact.id);
                      }}
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
      </div>

      {isModalOpen && (
        <ContactModal
          contact={editingContact}
          onClose={() => {
            setIsModalOpen(false);
            setEditingContact(null);
          }}
          onSave={editingContact ? handleUpdateContact : handleCreateContact}
          existingContacts={contacts || []}
        />
      )}
    </div>
  );
};

export default Contacts;