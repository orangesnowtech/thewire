'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCollectionName } from '@/lib/environment';
import { Wire } from '@/types';

interface CustomerInfoProps {
  wireData: Wire | null;
  onDocumentCreated?: (docId: string) => void;
  existingDocId: string | null;
}

interface FormData {
  usingAgent: string;
  customerFullName: string;
  customerPhone: string;
  customerEmail: string;
}

export default function CustomerInfo({ wireData, onDocumentCreated, existingDocId }: CustomerInfoProps) {
  const [formData, setFormData] = useState<FormData>({
    usingAgent: 'No',
    customerFullName: '',
    customerPhone: '',
    customerEmail: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Update form data when wireData changes
  useEffect(() => {
    if (wireData) {
      setFormData({
        usingAgent: 'No',
        customerFullName: wireData.customerFullName || '',
        customerPhone: wireData.customerPhone || '',
        customerEmail: wireData.customerEmail || '',
      });
      
      // Check if form is already completed
      if (wireData.customerEmail && wireData.customerFullName && wireData.customerPhone) {
        setFormCompleted(true);
      }
    }
  }, [wireData]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.customerFullName.trim()) {
      newErrors.customerFullName = 'Full name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (formData.customerPhone.length < 8) {
      newErrors.customerPhone = 'Phone number must not be less than 8 numbers';
    } else if (formData.customerPhone.length > 11) {
      newErrors.customerPhone = 'Phone number must not be longer than 11 numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Create new document if needed
  const createDocument = async (): Promise<string> => {
    try {
      const userRequestsRef = collection(db, getCollectionName('userRequests'));
      const docData = {
        ...formData,
        submitted: false,
        published: false,
        formCompleted: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(userRequestsRef, docData);
      console.log('New document created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      let docId = existingDocId;
      
      // Create document if it doesn't exist
      if (!docId) {
        docId = await createDocument();
        onDocumentCreated?.(docId);
      } else {
        // Update existing document
        const wireRef = doc(db, getCollectionName('userRequests'), docId);
        await setDoc(wireRef, formData, { merge: true });
      }
      
      setFormCompleted(true);
      setIsEditing(false);
      console.log('Customer info submitted successfully');
    } catch (error) {
      console.error('Error submitting customer info:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setFormCompleted(false);
  };

  // Determine if form should be shown
  const shouldShowForm = (!formCompleted && !wireData?.customerEmail) || isEditing;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
      
      <div className="flex flex-col gap-4 pb-10">
        {shouldShowForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Customer Full Name */}
            <div>
              <label htmlFor="customerFullName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerFullName"
                value={formData.customerFullName}
                onChange={(e) => handleInputChange('customerFullName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerFullName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer full name"
              />
              {errors.customerFullName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerFullName}</p>
              )}
            </div>

            {/* Customer Email */}
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="customerEmail"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer email"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
              )}
            </div>

            {/* Customer Phone */}
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer phone number"
              />
              {errors.customerPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Loading...' : (isEditing ? 'Update' : 'Submit')}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          // Display saved information
          <div>
            <div className="text-sm pb-4 space-y-1">
              <p><span className="font-medium">Customer Name:</span> {wireData?.customerFullName}</p>
              <p><span className="font-medium">Customer Email:</span> {wireData?.customerEmail}</p>
              <p><span className="font-medium">Customer Phone:</span> {wireData?.customerPhone}</p>
            </div>
            <button
              onClick={toggleEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
