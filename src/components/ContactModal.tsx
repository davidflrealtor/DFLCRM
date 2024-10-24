import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Contact } from '../types/Contact';
import { PipelineStage } from '../types/Pipeline';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { User, Building2, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

interface ContactModalProps {
  contact: Contact | null;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id'>) => void;
  existingContacts: Contact[];
}

const contactTypes = [
  { value: 'Buyer', label: 'Buyer' },
  { value: 'Seller', label: 'Seller' },
  { value: 'Agent', label: 'Agent' },
  { value: 'Other', label: 'Other' },
];

const pipelineStages: { value: PipelineStage; label: string }[] = [
  { value: 'New', label: 'New Lead' },
  { value: 'Engage', label: 'Engage' },
  { value: 'Future', label: 'Future' },
  { value: 'Active', label: 'Active' },
  { value: 'Closed', label: 'Closed' },
];

const leadSources = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'zillow', label: 'Zillow' },
  { value: 'realtor', label: 'Realtor.com' },
  { value: 'social', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

const interestLevels = [
  { value: 'hot', label: 'Hot' },
  { value: 'warm', label: 'Warm' },
  { value: 'cold', label: 'Cold' },
];

const ContactModal: React.FC<ContactModalProps> = ({
  contact,
  onClose,
  onSave,
  existingContacts,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: contact?.name || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      type: contact?.type || 'Buyer',
      company: contact?.company || '',
      stage: 'New' as PipelineStage,
      source: '',
      interestLevel: '',
      budget: '',
      timeframe: '',
      notes: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const onSubmit = (data: any) => {
    const newContact = {
      ...data,
      lastContact: new Date().toISOString(),
      relatedTaskIds: [],
      relatedTransactionIds: [],
      relatedNoteIds: [],
    };
    onSave(newContact);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    step === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <div className="mt-1 relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register('company')}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register('phone', { required: 'Phone is required' })}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Lead Management</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Type</label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={contactTypes}
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pipeline Stage</label>
                  <Controller
                    name="stage"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={pipelineStages}
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Lead Source</label>
                  <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={leadSources}
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Interest Level</label>
                  <Controller
                    name="interestLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={interestLevels}
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <div className="mt-1 relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register('budget')}
                      type="number"
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                  <input
                    {...register('timeframe')}
                    type="text"
                    placeholder="e.g., 3-6 months"
                    className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register('address')}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    {...register('city')}
                    className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    {...register('state')}
                    className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    {...register('zipCode')}
                    className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={currentStep === 1 ? onClose : prevStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            <button
              type={currentStep === 3 ? 'submit' : 'button'}
              onClick={currentStep === 3 ? undefined : nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {currentStep === 3 ? 'Save Contact' : 'Next'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactModal;