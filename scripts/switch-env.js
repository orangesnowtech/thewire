#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

function updateEnv(environment) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Reset all environment variables
  envContent = envContent.replace(/NEXT_PUBLIC_ENVIRONMENT=.*/, 'NEXT_PUBLIC_ENVIRONMENT=');
  envContent = envContent.replace(/NEXT_PUBLIC_USE_EMULATOR=.*/, 'NEXT_PUBLIC_USE_EMULATOR=false');
  
  switch (environment) {
    case 'test':
      envContent = envContent.replace(/NEXT_PUBLIC_ENVIRONMENT=/, 'NEXT_PUBLIC_ENVIRONMENT=test');
      break;
    case 'emulator':
      envContent = envContent.replace(/NEXT_PUBLIC_USE_EMULATOR=false/, 'NEXT_PUBLIC_USE_EMULATOR=true');
      break;
    case 'production':
    default:
      // Already reset above
      break;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Switched to ${environment.toUpperCase()} environment`);
}

const environment = process.argv[2];

if (!environment || !['production', 'test', 'emulator'].includes(environment)) {
  console.log(`
🔧 Environment Switcher

Usage: node scripts/switch-env.js [environment]

Environments:
  production  - Uses production Firebase project
  test        - Uses test Firebase project  
  emulator    - Uses local Firebase emulators

Current environment variables will be updated in .env.local
`);
  process.exit(1);
}

updateEnv(environment);
