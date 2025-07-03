'use client';

import { useState, useEffect } from 'react';
import { Wire } from '@/types';
import HeroSection from '@/components/HeroSection';
import { 
  collection, 
  query, 
  where, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function HomePage() {
  // State for published wires count
  const [publishedWiresCount, setPublishedWiresCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Set up real-time listener for published wires count
  useEffect(() => {
    const wiresCollection = process.env.NEXT_PUBLIC_USE_EMULATOR === 'true' ? 'emulator_userRequests' : 'userRequests';
    
    const q = query(
      collection(db, wiresCollection),
      where('published', '==', true)
    );
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setPublishedWiresCount(querySnapshot.size);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching wires count:', err);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-tertiary-light dark:bg-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-10">
        <HeroSection />
      </div>

      {/* Request Notification Section */}
      <div className="w-full px-4 py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="mb-6">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-3xl font-bold mb-2">
                Active Property Requests
              </h2>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded w-48 mx-auto mb-4"></div>
                  <div className="h-4 bg-white/20 rounded w-64 mx-auto"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl mb-4">
                    We currently have <span className="font-bold text-secondary-400">{publishedWiresCount}</span> active property requests
                  </p>
                  <p className="text-lg opacity-90">
                    Browse through client requests and find your next opportunity
                  </p>
                </>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/wireboard"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                View Wire Board
              </Link>
              <Link
                href="/request/form"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Post New Request
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="w-full px-4 py-16 bg-tertiary-light dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How PropWire Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connect property seekers with real estate professionals through our streamlined request system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Post Your Request
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Submit detailed information about the property you're looking for, including location, budget, and preferences
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-secondary-100 dark:bg-secondary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get Matched
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real estate agents and property owners browse requests and reach out with suitable properties
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-tertiary-100 dark:bg-tertiary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-tertiary-600 dark:text-tertiary-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Find Your Home
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Review responses, schedule viewings, and find your perfect property match
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
