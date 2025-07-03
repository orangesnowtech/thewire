'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function HeroSection() {
  const router = useRouter();

  const handlePostRequest = () => {
    // Create a new document reference to get a unique ID
    const docRef = doc(collection(db, 'requests'));
    // Navigate to the form with the new document ID
    router.push(`/request/form?id=${docRef.id}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Left Card - Property Seekers */}
      <div className="flex flex-col justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="text-4xl mb-2">🏠</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Need a Property?
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Post your property request and let landlords, agents, and realtors come to you. 
            No more endless searching - get exactly what you want.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <button 
              onClick={handlePostRequest}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
            >
              Post Request
            </button>
            <Link 
              href="/auth/login"
              className="flex-1 bg-primary-100 hover:bg-primary-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-primary-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
            >
              Manage Request
            </Link>
          </div>
        </div>
      </div>

      {/* Right Card - Property Providers */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-sm">
        <div className="text-4xl mb-4">💼</div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
          Got a property to Sell, Rent or Short Let?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center leading-relaxed">
          Avoid window shoppers and time wasting inspections. Access serious clients 
          without the long chain of middlemen. Close deals faster with verified requests.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Link 
            href="/auth/signup"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
          >
            Get Started
          </Link>
          <Link 
            href="/auth/login"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-center"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
