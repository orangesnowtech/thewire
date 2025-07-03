// Environment utilities for Firebase configuration
export const getCurrentEnvironment = () => {
  const isTest = process.env.NEXT_PUBLIC_ENVIRONMENT === 'test';
  const isDev = process.env.NODE_ENV === 'development';
  const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATOR === 'true';
  
  return {
    isTest,
    isDev,
    useEmulator,
    isProd: !isDev && !isTest && !useEmulator,
    name: useEmulator ? 'EMULATOR' : isTest ? 'TEST' : isDev ? 'DEVELOPMENT' : 'PRODUCTION'
  };
};

export const getFirebaseProjectId = () => {
  const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATOR === 'true';
  const isTest = process.env.NEXT_PUBLIC_ENVIRONMENT === 'test';
  
  if (useEmulator) {
    return 'prop-wire-dev'; // Use actual project ID for better emulator UI support
  }
  
  return isTest 
    ? process.env.NEXT_PUBLIC_FIREBASE_TEST_PROJECT_ID 
    : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
};

// Collection names for different environments
export const getCollectionName = (baseCollection: string) => {
  const env = getCurrentEnvironment();
  
  if (env.useEmulator) {
    return `emulator_${baseCollection}`;
  }
  
  if (env.isTest) {
    return `test_${baseCollection}`;
  }
  
  return baseCollection;
};

// Utility to log environment info
export const logEnvironmentInfo = () => {
  const env = getCurrentEnvironment();
  console.log(`🌍 Environment: ${env.name}`);
  console.log(`🔥 Firebase Project: ${getFirebaseProjectId()}`);
  console.log(`📊 Collections prefix: ${env.useEmulator ? 'emulator_' : env.isTest ? 'test_' : 'none'}`);
  
  if (env.useEmulator) {
    console.log('🔧 Using Firebase Emulators:');
    console.log('  - Firestore: http://localhost:8080');
    console.log('  - Auth: http://localhost:9099');
    console.log('  - Storage: http://localhost:9199');
    console.log('  - UI: http://localhost:4000');
  }
};
