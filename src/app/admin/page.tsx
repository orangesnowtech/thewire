'use client';

import { useState } from 'react';
import { seedTestData } from '@/lib/testData';
import { getCurrentEnvironment, logEnvironmentInfo } from '@/lib/environment';
import { getPublishedWires } from '@/lib/firestore';
import { Wire } from '@/types';

export default function AdminPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [testWires, setTestWires] = useState<Wire[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const environment = getCurrentEnvironment();

  const handleSeedData = async () => {
    setIsSeeding(true);
    setError(null);
    try {
      const result = await seedTestData();
      setSeedResult(result);
      // Refresh the wire list after seeding
      await loadTestWires();
    } catch (err) {
      console.error('Error seeding data:', err);
      setError(err instanceof Error ? err.message : 'Failed to seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  const loadTestWires = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const wires = await getPublishedWires();
      setTestWires(wires);
    } catch (err) {
      console.error('Error loading wires:', err);
      setError(err instanceof Error ? err.message : 'Failed to load wires');
    } finally {
      setIsLoading(false);
    }
  };

  const logEnvironment = () => {
    logEnvironmentInfo();
  };

  return (
    <div className="min-h-screen bg-tertiary-light dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🛠️ Admin Panel
          </h1>
          
          {/* Environment Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Environment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Environment:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  environment.useEmulator ? 'bg-purple-100 text-purple-800' :
                  environment.isTest ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {environment.name}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Node Env:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{process.env.NODE_ENV}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Project ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {environment.useEmulator ? 'demo-project' :
                   environment.isTest 
                    ? process.env.NEXT_PUBLIC_FIREBASE_TEST_PROJECT_ID 
                    : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Emulator:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  environment.useEmulator ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {environment.useEmulator ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
            
            {/* Emulator Links */}
            {environment.useEmulator && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                <a
                  href="http://localhost:4000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded transition-colors text-center"
                >
                  🔧 Emulator UI
                </a>
                <a
                  href="http://localhost:4000/firestore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-primary-100 hover:bg-primary-200 text-primary-800 rounded transition-colors text-center"
                >
                  🗄️ Firestore
                </a>
                <a
                  href="http://localhost:4000/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors text-center"
                >
                  🔐 Auth
                </a>
                <a
                  href="http://localhost:4000/storage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded transition-colors text-center"
                >
                  📁 Storage
                </a>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={logEnvironment}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded transition-colors"
              >
                Log Environment Info to Console
              </button>
              
              {!environment.useEmulator && (
                <div className="text-xs text-gray-600 dark:text-gray-400 py-1 px-2">
                  💡 Try: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">npm run dev:emulator</code> for local development
                </div>
              )}
            </div>
          </div>

          {/* Environment Warnings */}
          {environment.useEmulator ? (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🔧</span>
                <div>
                  <h3 className="text-purple-800 font-semibold">Emulator Mode Active</h3>
                  <p className="text-purple-700 text-sm">
                    You are using Firebase Emulators. All data is stored locally and will be lost when emulators stop.
                  </p>
                </div>
              </div>
            </div>
          ) : !environment.isTest && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚠️</span>
                <div>
                  <h3 className="text-red-800 font-semibold">Production Environment Warning</h3>
                  <p className="text-red-700 text-sm">
                    You are currently connected to the PRODUCTION environment. 
                    Consider switching to test environment or emulators for data seeding.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isSeeding ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Seeding...
                </>
              ) : (
                <>
                  <span>🌱</span>
                  Seed Test Data
                </>
              )}
            </button>

            <button
              onClick={loadTestWires}
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Loading...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Refresh Data
                </>
              )}
            </button>
          </div>

          {/* Seed Result */}
          {seedResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-800 font-semibold mb-2">✅ Seeding Successful</h3>
              <pre className="text-sm text-green-700 overflow-x-auto">
                {JSON.stringify(seedResult, null, 2)}
              </pre>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Current Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Current Wires Data
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total: {testWires.length}
            </span>
          </div>

          {testWires.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Wires Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {environment.isTest 
                  ? 'Seed some test data to get started'
                  : 'No published wires in the database'}
              </p>
              <button
                onClick={loadTestWires}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Load Data
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testWires.map((wire) => (
                <div
                  key={wire.id || wire.requestID}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs rounded">
                      {wire.requestType}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {wire.requestID}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Agent:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        {wire.agentFullName || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Company:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        {wire.agentCompany || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Locations:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        {wire.locations?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                  {'minBudget' in wire && 'maxBudget' in wire && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Budget:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        ₦{wire.minBudget?.toLocaleString()} - ₦{wire.maxBudget?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-tertiary-light dark:bg-primary-900 rounded-lg p-6">
          <h3 className="text-blue-900 dark:text-blue-100 font-semibold mb-2">💡 Instructions</h3>
          <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
            <li>• Use "Seed Test Data" to create sample property requests</li>
            <li>• <strong>Emulator Mode:</strong> <code className="bg-secondary-200 dark:bg-secondary-800 px-1 rounded">npm run dev:emulator</code> - Fully local development</li>
            <li>• <strong>Test Environment:</strong> <code className="bg-secondary-200 dark:bg-secondary-800 px-1 rounded">npm run dev:test</code> - Uses test Firebase project</li>
            <li>• <strong>Production:</strong> <code className="bg-secondary-200 dark:bg-secondary-800 px-1 rounded">npm run dev</code> - Uses production Firebase project</li>
            <li>• Emulator data persists only while emulators are running</li>
            <li>• Check browser console for detailed Firebase logs</li>
            <li>• Use "Refresh Data" to reload current database contents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
