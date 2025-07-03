'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, collection, updateDoc, deleteDoc, addDoc, serverTimestamp, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Wire } from '@/types';
import { getCollectionName } from '@/lib/environment';
import AgentInfo from '../../../components/form/AgentInfo';
import CustomerInfo from '../../../components/form/CustomerInfo';

interface RequesterInfo {
  email: string;
  name: string;
}

export default function RequestFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingDocId = searchParams.get('id'); // Check if we have an existing ID

  // State management
  const [docId, setDocId] = useState<string | null>(existingDocId);
  const [userType, setUserType] = useState<string>(''); // Changed from formUsingAgent
  const [requesterInfo, setRequesterInfo] = useState<RequesterInfo>({
    email: '',
    name: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wireData, setWireData] = useState<Wire | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Firebase refs
  const mailRef = collection(db, getCollectionName('sentMails'));
  
  // Set up document listener only if we have a docId
  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupListener = () => {
      console.log('Setting up listener for document:', docId);
      const wireRef = doc(db, getCollectionName('userRequests'), docId);
      
      setLoading(true);
      unsubscribe = onSnapshot(
        wireRef,
        (docSnapshot) => {
          console.log('Document snapshot received, exists:', docSnapshot.exists());
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log('Document data:', data);
            setWireData({ id: docSnapshot.id, ...data } as Wire);
            setError(null);
          } else {
            console.log('Document does not exist');
            setWireData(null);
            setError('Document not found');
          }
          setLoading(false);
        },
        (err) => {
          console.error('Firestore listener error:', err);
          setError(err.message);
          setLoading(false);
        }
      );
    };

    setupListener();
    
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up listener');
        unsubscribe();
      }
    };
  }, [docId]);

  // Callback for when AgentInfo creates a new document
  const handleDocumentCreated = (newDocId: string) => {
    console.log('Document created with ID:', newDocId);
    setDocId(newDocId);
    
    // Update URL with the new document ID
    const newUrl = `/request/form?id=${newDocId}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Computed values
  const isAgent = userType === 'Yes' || wireData?.usingAgent === 'Yes';
  const isCustomer = userType === 'No' || wireData?.usingAgent === 'No';

  // Update requester info when wire data changes
  useEffect(() => {
    if (wireData) {
      if (wireData.usingAgent === 'Yes') {
        setRequesterInfo({
          email: wireData.agentEmail || '',
          name: wireData.agentFullName || '',
        });
      } else if (wireData.usingAgent === 'No') {
        setRequesterInfo({
          email: wireData.customerEmail || '',
          name: wireData.customerFullName || '',
        });
      } else {
        setRequesterInfo({ email: '', name: '' });
      }
    }
  }, [wireData]);

  // Generate random ID for wire request
  const generateRandomId = () => {
    const textCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberCharacters = '0123456789';
    let randomId = '';

    // Generate 3 random text characters
    for (let i = 0; i < 3; i++) {
      randomId += textCharacters.charAt(
        Math.floor(Math.random() * textCharacters.length)
      );
    }

    // Generate 6 random number characters
    for (let i = 0; i < 6; i++) {
      randomId += numberCharacters.charAt(
        Math.floor(Math.random() * numberCharacters.length)
      );
    }

    return randomId;
  };

  const wireRequestID = generateRandomId();

  // Delete wire
  const deleteWire = async () => {
    try {
      if (docId) {
        const wireRef = doc(db, getCollectionName('userRequests'), docId);
        await deleteDoc(wireRef);
      }
      router.push('/');
      // TODO: Add toast notification
      console.log('Request Cancelled');
    } catch (error) {
      console.error('Error deleting wire:', error);
    }
  };

  // Send email
  const sendEmail = async () => {
    try {
      await addDoc(mailRef, {
        template: {
          name: 'userRequest',
          data: {
            id: wireRequestID,
            name: requesterInfo.name,
            email: requesterInfo.email,
          },
        },
        to: [requesterInfo.email, 'chris@corporatelandlords.com'],
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // TODO: Add toast notification
    }
  };

  // Submit form
  const submitForm = async () => {
    try {
      setIsSubmitting(true);
      if (docId) {
        const wireRef = doc(db, getCollectionName('userRequests'), docId);
        await updateDoc(wireRef, {
          submitted: true,
          published: false,
          formSubmitted: true,
          time: serverTimestamp(),
          requestID: wireRequestID,
        });
      }
      setShowAlert(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowAlert(false);
      // TODO: Add toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete submission
  const completeSubmission = async () => {
    try {
      await submitForm();
      await sendEmail();
    } catch (error) {
      console.error('Error completing submission:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading form: {error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Success Modal
  const SuccessModal = () => (
    showAlert && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white m-8 rounded-lg p-8 border-2 border-green-200 max-w-md w-full">
          <p className="text-sm font-semibold text-green-700 mb-4">
            Request submitted successfully
          </p>
          
          <p className="mb-4">Your request ID is: {wireRequestID}</p>
          
          <div className="py-4">
            <p className="text-xl font-semibold mb-2">Payment</p>
            <p className="mb-2">
              Before we publish your request you will need to pay your listing fee of ₦3,100
            </p>
            <div className="py-2 mb-4">
              After payment, a customer care agent will contact you!
            </div>
            <a
              href="https://paystack.shop/pay/corplandrequest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Pay Now
            </a>
          </div>

          <div className="py-4">
            <p className="text-lg font-semibold mb-2">Manage Your Request</p>
            <p className="pb-2">
              To see responses to your request, make payment later, or edit your request,
              login to your request dashboard using your request ID: {wireRequestID} & email:{' '}
              {wireData?.agentEmail || wireData?.customerEmail}
            </p>
            <button
              onClick={() => router.push('/wires/login')}
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200"
            >
              Manage Request
            </button>
          </div>

          <div className="flex gap-2 pt-8 pb-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Go Home
            </button>
            <button
              onClick={() => router.push(`/request/form?id=${docId}`)}
              className="flex-1 px-4 py-2 text-blue-600 underline hover:text-blue-700"
            >
              Post Another Request
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Main form render
  return (
    <div className="min-h-screen bg-green-200">
      {/* Top Navigation Menu */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-900">PropWire</h2>
            </div>
            
            {/* Navigation Items */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Home
              </button>
              {docId && (
                <span className="text-sm text-gray-500">
                  Request ID: {docId.substring(0, 8)}...
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <SuccessModal />
      
      {!wireData?.submitted ? (
        <div className="p-8 flex justify-center">
          <div className="flex flex-col gap-4 md:w-1/2 pb-20 pt-20">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold pb-4">Wire Request Details</h1>

              {/* Agent Selection */}
              {!wireData?.usingAgent && (
                <div className="pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Are you an Agent helping a client with their search?
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

              {/* Form Steps */}
              {(userType || wireData?.usingAgent) && (
                <div>
                  {isAgent && (
                    <AgentInfo 
                      wireData={wireData} 
                      onDocumentCreated={handleDocumentCreated}
                      existingDocId={docId}
                    />
                  )}
                  {isCustomer && (
                    <CustomerInfo 
                      wireData={wireData} 
                      onDocumentCreated={handleDocumentCreated}
                      existingDocId={docId}
                    />
                  )}
                </div>
              )}

              {/* Additional form steps will be added here */}
              {(wireData?.agentEmail || wireData?.customerEmail) && (
                <div className="pt-4 space-y-4">
                  {/* TODO: Add more form components */}
                  <div className="text-gray-600">Additional form steps coming soon...</div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-4 flex space-x-2">
              {wireData?.formCompleted && (
                <button
                  onClick={completeSubmission}
                  disabled={showAlert || isSubmitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Wire'}
                </button>
              )}
              <button
                onClick={deleteWire}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel Wire
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 h-screen flex flex-col items-center justify-center">
          <p className="text-xl font-semibold mb-4">Form Submitted Successfully!</p>
          <div className="space-x-2">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Go Home
            </button>
            <button
              onClick={() => router.push('/request/form')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Post New Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
