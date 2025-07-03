'use client';

import { useState, useMemo, useEffect } from 'react';
import { Wire, RequestType } from '@/types';
import LazyWireCard from '@/components/LazyWireCard';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { filterWiresByRequestId } from '@/lib/firestore';
import { getCollectionName } from '@/lib/environment';

// Helper function to check if a wire has budget fields
const hasBudgetFields = (wire: Wire): wire is Wire & { minBudget: number; maxBudget: number } => {
  return wire.requestType !== 'Joint Venture' && 
         'minBudget' in wire && 
         'maxBudget' in wire && 
         typeof (wire as any).minBudget === 'number' && 
         typeof (wire as any).maxBudget === 'number';
};

export default function WireBoardPage() {
  // State for filters
  const [idSearch, setIdSearch] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [requestTypeQuery, setRequestTypeQuery] = useState<'All' | RequestType>('All');
  const [minBudget, setMinBudget] = useState(0); // Minimum budget filter
  
  // State for Firebase data
  const [allWires, setAllWires] = useState<Wire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Available locations (you can move this to a separate file later)
  const availableLocations = [
    'Lagos Island', 'Victoria Island', 'Ikoyi', 'Lekki', 'Ajah', 'Surulere',
    'Yaba', 'Ikeja', 'Maryland', 'Gbagada', 'Ketu', 'Magodo', 'Ojodu',
    'Berger', 'Isheri', 'Agege', 'Alimosho', 'Ipaja', 'Egbeda'
  ];

  // Helper function to convert Firestore document to Wire
  const documentToWire = (docId: string, docData: any): Wire => {
    return {
      id: docId,
      ...docData,
      // Ensure required arrays exist with defaults
      likes: docData.likes || [],
      responses: docData.responses || [],
      locations: docData.locations || [],
    } as Wire;
  };

  // Set up real-time listener for wires based on filters
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    let unsubscribe: (() => void) | null = null;
    
    try {
      const wiresCollection = process.env.NEXT_PUBLIC_USE_EMULATOR === 'true' ? 'emulator_userRequests' : 'userRequests';
      let q;
      
      // Build query based on current filters
      if (requestTypeQuery !== 'All' && selectedLocations.length > 0) {
        // Both type and location filters
        q = query(
          collection(db, wiresCollection),
          where('published', '==', true),
          where('requestType', '==', requestTypeQuery),
          where('locations', 'array-contains-any', selectedLocations),
          orderBy('time', 'desc')
        );
      } else if (requestTypeQuery !== 'All') {
        // Type filter only
        q = query(
          collection(db, wiresCollection),
          where('published', '==', true),
          where('requestType', '==', requestTypeQuery),
          orderBy('time', 'desc')
        );
      } else if (selectedLocations.length > 0) {
        // Location filter only
        q = query(
          collection(db, wiresCollection),
          where('published', '==', true),
          where('locations', 'array-contains-any', selectedLocations),
          orderBy('time', 'desc')
        );
      } else {
        // No filters - get all published wires
        q = query(
          collection(db, wiresCollection),
          where('published', '==', true),
          orderBy('time', 'desc')
        );
      }
      
      // Set up real-time listener
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          console.log('Real-time update received, docs count:', querySnapshot.size);
          const wires: Wire[] = [];
          
          querySnapshot.forEach((doc) => {
            wires.push(documentToWire(doc.id, doc.data()));
          });
          
          setAllWires(wires);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Real-time listener error:', err);
          setError('Failed to load property requests. Please try again later.');
          setLoading(false);
        }
      );
      
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError('Failed to load property requests. Please try again later.');
      setLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up wires listener');
        unsubscribe();
      }
    };
  }, [requestTypeQuery, selectedLocations]);

  // Filter wires based on ID search and minimum budget
  const filteredWires = useMemo(() => {
    let filtered = filterWiresByRequestId(allWires, idSearch);
    
    // Apply budget filter only if minimum budget is set
    if (minBudget > 0) {
      filtered = filtered.filter(wire => {
        // Check if wire has budget fields
        if (!hasBudgetFields(wire)) {
          return false; // Exclude wires without budget fields when budget filter is active
        }
        
        // Skip wires that don't have valid budget data
        if (wire.minBudget === 0 && wire.maxBudget === 0) {
          return false;
        }
        
        // Check if the wire's maximum budget meets the minimum requirement
        return wire.maxBudget >= minBudget;
      });
    }
    
    return filtered;
  }, [allWires, idSearch, minBudget]);

  const clearAllFilters = () => {
    setIdSearch('');
    setSelectedLocations([]);
    setRequestTypeQuery('All');
    setMinBudget(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Wire Board
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Browse all active property requests from our clients
            </p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              Total Wires Found: {filteredWires.length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear All
                </button>
              </div>

              {/* Request ID Search */}
              <div className="mb-6">
                <label htmlFor="idSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Request ID
                </label>
                <input
                  type="text"
                  id="idSearch"
                  value={idSearch}
                  onChange={(e) => setIdSearch(e.target.value)}
                  placeholder="Search by Request ID..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Request Type Filter */}
              <div className="mb-6">
                <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Request Type
                </label>
                <select
                  id="requestType"
                  value={requestTypeQuery}
                  onChange={(e) => setRequestTypeQuery(e.target.value as 'All' | RequestType)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="All">All Types</option>
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                  <option value="Short Let">Short Let</option>
                </select>
              </div>

              {/* Minimum Budget Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Budget (₦)
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={minBudget || ''}
                    onChange={(e) => setMinBudget(parseInt(e.target.value) || 0)}
                    placeholder="Enter minimum budget"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {minBudget > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Showing properties with max budget ≥ ₦{minBudget.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Locations
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {availableLocations.map((location) => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLocations([...selectedLocations, location]);
                          } else {
                            setSelectedLocations(selectedLocations.filter(l => l !== location));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedLocations.length > 0 || requestTypeQuery !== 'All' || idSearch || minBudget > 0) && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Filters:</h3>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {requestTypeQuery !== 'All' && <div>Type: {requestTypeQuery}</div>}
                    {idSearch && <div>ID: {idSearch}</div>}
                    {minBudget > 0 && (
                      <div>Min Budget: ₦{minBudget.toLocaleString()}</div>
                    )}
                    {selectedLocations.length > 0 && (
                      <div>Locations: {selectedLocations.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Wire Cards */}
          <div className="lg:w-96 flex-shrink-0">
            {loading ? (
              // Loading skeletons
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-12">
                <div className="text-red-500 dark:text-red-400">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">Error Loading Wires</h3>
                  <p className="mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredWires.length > 0 ? (
              // Wire cards in single column with lazy loading
              <div className="space-y-6">
                {filteredWires.map((wire) => (
                  <LazyWireCard 
                    key={wire.id || wire.requestID} 
                    wire={wire}
                    rootMargin="200px"
                  />
                ))}
              </div>
            ) : (
              // No results state
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No Wires Found</h3>
                  <p className="mb-4">
                    {idSearch || selectedLocations.length > 0 || requestTypeQuery !== 'All' || minBudget > 0
                      ? 'Try adjusting your filters or search criteria'
                      : 'No property requests have been posted yet'
                    }
                  </p>
                  {(idSearch || selectedLocations.length > 0 || requestTypeQuery !== 'All' || minBudget > 0) && (
                    <button 
                      onClick={clearAllFilters}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
