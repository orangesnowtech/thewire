'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminButton() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Admin Panel Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Developer Tools"
        >
          🛠️
        </button>
        
        {/* Admin Panel Popup */}
        {isVisible && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-48">
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              🚀 Developer Tools
            </div>
            
            <div className="space-y-2">
              <Link
                href="/admin"
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                🛠️ Admin Panel
              </Link>
              
              <button
                onClick={() => {
                  console.log('Current Environment:', {
                    NODE_ENV: process.env.NODE_ENV,
                    ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
                    PROJECT_ID: process.env.NEXT_PUBLIC_ENVIRONMENT === 'test' 
                      ? process.env.NEXT_PUBLIC_FIREBASE_TEST_PROJECT_ID 
                      : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
                  });
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                📊 Log Environment
              </button>
              
              <button
                onClick={() => setIsVisible(false)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                ✕ Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
