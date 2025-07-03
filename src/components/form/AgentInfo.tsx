'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, setDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCollectionName } from '@/lib/environment';

interface AgentInfoState {
  usingAgent: string;
  agentFullName: string;
  agentPhone: string;
  agentEmail: string;
  agentCompany: string;
  customerFullName: string;
}

interface AgentInfoProps {
  wireData?: any;
  onUpdate?: () => void;
  onDocumentCreated?: (docId: string) => void;
  existingDocId?: string | null;
}

export default function AgentInfo({ wireData, onUpdate, onDocumentCreated, existingDocId }: AgentInfoProps) {
  const searchParams = useSearchParams();
  const docId = existingDocId || searchParams.get('id');

  const [agentInfoState, setAgentInfoState] = useState<AgentInfoState>({
    usingAgent: 'Yes',
    agentFullName: '',
    agentPhone: '',
    agentEmail: '',
    agentCompany: '',
    customerFullName: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Show form if no wireData.usingAgent or in edit mode
  const showForm = !wireData?.usingAgent || editMode;

  // Prefill form when wireData loads or when entering edit mode
  useEffect(() => {
    if (wireData && editMode) {
      setAgentInfoState({
        usingAgent: wireData.usingAgent || 'Yes',
        agentFullName: wireData.agentFullName || '',
        agentPhone: wireData.agentPhone || '',
        agentEmail: wireData.agentEmail || '',
        agentCompany: wireData.agentCompany || '',
        customerFullName: wireData.customerFullName || '',
      });
    }
  }, [wireData, editMode]);

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!agentInfoState.agentFullName.trim()) {
      newErrors.agentFullName = 'Agent Name is required';
    }
    if (!agentInfoState.agentEmail.trim()) {
      newErrors.agentEmail = 'Agent Email is required';
    }
    if (!agentInfoState.agentPhone.trim()) {
      newErrors.agentPhone = 'Agent Phone is required';
    }

    // Email validation
    if (agentInfoState.agentEmail && !/\S+@\S+\.\S+/.test(agentInfoState.agentEmail)) {
      newErrors.agentEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit agent information
  const submitAgentInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    try {
      const dataToSave = { 
        ...agentInfoState,
        submitted: false,
        published: false,
        formCompleted: false,
        createdAt: serverTimestamp(),
      };
      
      let currentDocId = docId;
      
      if (editMode && currentDocId) {
        // Update existing document
        const wireRef = doc(db, getCollectionName('userRequests'), currentDocId);
        await updateDoc(wireRef, { ...agentInfoState });
        console.log('Agent Information Updated');
        setEditMode(false);
      } else if (!currentDocId) {
        // Create new document
        const userRequestsRef = collection(db, getCollectionName('userRequests'));
        const docRef = await addDoc(userRequestsRef, dataToSave);
        currentDocId = docRef.id;
        console.log('New document created with ID:', currentDocId);
        onDocumentCreated?.(currentDocId);
      } else {
        // Update existing document (first time submission)
        const wireRef = doc(db, getCollectionName('userRequests'), currentDocId);
        await setDoc(wireRef, dataToSave, { merge: true });
        console.log('Agent Information Saved');
      }
      
      onUpdate?.();
    } catch (error) {
      console.error('Error saving agent info:', error);
      alert('Error saving agent information');
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (!editMode && wireData) {
      setAgentInfoState({
        usingAgent: wireData.usingAgent || 'Yes',
        agentFullName: wireData.agentFullName || '',
        agentPhone: wireData.agentPhone || '',
        agentEmail: wireData.agentEmail || '',
        agentCompany: wireData.agentCompany || '',
        customerFullName: wireData.customerFullName || '',
      });
    }
    setEditMode(!editMode);
    setErrors({});
  };

  // Handle input changes
  const handleInputChange = (field: keyof AgentInfoState, value: string) => {
    setAgentInfoState(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Agent Information</h2>
      </div>

      {showForm ? (
        <form onSubmit={submitAgentInfo} className="space-y-4">
          {/* Agent Full Name */}
          <div>
            <label htmlFor="agentFullName" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="agentFullName"
              value={agentInfoState.agentFullName}
              onChange={(e) => handleInputChange('agentFullName', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.agentFullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter agent's full name"
            />
            {errors.agentFullName && (
              <p className="mt-1 text-sm text-red-600">{errors.agentFullName}</p>
            )}
          </div>

          {/* Agent Email */}
          <div>
            <label htmlFor="agentEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="agentEmail"
              value={agentInfoState.agentEmail}
              onChange={(e) => handleInputChange('agentEmail', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.agentEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter agent's email address"
            />
            {errors.agentEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.agentEmail}</p>
            )}
          </div>

          {/* Agent Phone */}
          <div>
            <label htmlFor="agentPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="agentPhone"
              value={agentInfoState.agentPhone}
              onChange={(e) => handleInputChange('agentPhone', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.agentPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter agent's phone number"
            />
            {errors.agentPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.agentPhone}</p>
            )}
          </div>

          {/* Customer Full Name */}
          <div>
            <label htmlFor="customerFullName" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span className="text-sm text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              id="customerFullName"
              value={agentInfoState.customerFullName}
              onChange={(e) => handleInputChange('customerFullName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter customer's name"
            />
          </div>

          {/* Agent Company */}
          <div>
            <label htmlFor="agentCompany" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Company Name <span className="text-sm text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              id="agentCompany"
              value={agentInfoState.agentCompany}
              onChange={(e) => handleInputChange('agentCompany', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter company name"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 flex gap-2">
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Saving...' : editMode ? 'Update' : 'Submit'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={toggleEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm space-y-2 mb-4">
            <p><span className="font-medium">Agent Name:</span> {wireData.agentFullName}</p>
            <p><span className="font-medium">Agent Email:</span> {wireData.agentEmail}</p>
            <p><span className="font-medium">Agent Phone:</span> {wireData.agentPhone}</p>
            <p><span className="font-medium">Agent Company:</span> {wireData.agentCompany}</p>
            <p><span className="font-medium">Customer Full Name:</span> {wireData.customerFullName}</p>
          </div>
          <button
            onClick={toggleEdit}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
