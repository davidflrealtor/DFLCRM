import React from 'react';
import { Contact } from '../../types/Contact';
import { Mail, Phone, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ContactHeaderProps {
  contact: Contact;
}

const ContactHeader: React.FC<ContactHeaderProps> = ({ contact }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User size={32} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="flex items-center text-gray-600">
              <Mail size={16} className="mr-2" />
              {contact.email}
            </span>
            <span className="flex items-center text-gray-600">
              <Phone size={16} className="mr-2" />
              {contact.phone}
            </span>
            <span className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              Last Contact: {formatDate(contact.lastContact)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          contact.type === 'Buyer' ? 'bg-green-100 text-green-800' :
          contact.type === 'Seller' ? 'bg-blue-100 text-blue-800' :
          contact.type === 'Agent' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {contact.type}
        </span>
      </div>
    </div>
  );
};

export default ContactHeader;