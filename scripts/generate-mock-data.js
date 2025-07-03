const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, connectFirestoreEmulator, Timestamp } = require('firebase/firestore');

// Firebase config for emulator
const firebaseConfig = {
apiKey: "demo-api-key",
  authDomain: "prop-wire-dev.firebaseapp.com",
  projectId: "prop-wire-dev", // Use your actual project ID for better emulator UI support
  storageBucket: "prop-wire-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo",
  measurementId: "G-DEMO"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator
connectFirestoreEmulator(db, 'localhost', 8080);

// Mock data generators
const locations = [
  'Lekki', 'Victoria Island', 'Ikoyi', 'Banana Island', 'Ikeja', 'Maryland', 'Gbagada',
  'Surulere', 'Yaba', 'Mushin', 'Ajah', 'Sangotedo', 'Ibeju-Lekki', 'Magodo', 'Ketu',
  'Ojodu', 'Berger', 'Ogba', 'Agege', 'Alimosho', 'Apapa', 'Lagos Island', 'Festac',
  'Isolo', 'Oshodi', 'Palmgrove', 'Shomolu', 'Kosofe', 'Ifako-Ijaiye', 'Amuwo-Odofin'
];

const buildingTypes = ['Apartment', 'Duplex', 'Bungalow', 'Terrace', 'Detached', 'Semi-Detached'];
const buildingStructures = ['Detached', 'Semi-Detached', 'Terrace', 'Any of the above'];
const propertyTypes = ['Bare Land', 'Off Plan', 'Under Construction', 'Completed'];
const rentDurations = ['6 months', '1 year', '2 years', '3 years', '4 years', '5 years'];
const paymentOptions = ['Daily', 'Monthly', 'Yearly', 'Outright', 'Installment'];
const commercialTypes = ['Office Complex', 'Shopping Mall', 'Warehouse', 'Industrial', 'Mixed Use'];
const commercialUseCases = ['Office Space', 'Retail Store', 'Restaurant', 'Warehouse', 'Factory'];
const shortLetUseCases = ['Personal Staycation', 'Family Vacation', 'Work Retreat', 'Media Production', 'House Party', 'Others'];
const amenities = ['Swimming Pool', 'Gym', 'WiFi', 'Air Conditioning', 'Generator', 'Security', 'Parking', 'Elevator', 'Balcony', 'Garden'];
const services = ['Cleaning', 'Security', 'Concierge', 'Laundry', 'Catering', 'Transport', 'Maintenance'];

const names = [
  'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis', 'Robert Miller',
  'Emily Wilson', 'James Taylor', 'Amanda Garcia', 'Chris Anderson', 'Jessica Thomas', 'Michael Jackson',
  'Ashley Martinez', 'Daniel Rodriguez', 'Stephanie Lewis', 'Kevin Lee', 'Michelle Walker', 'Brian Hall',
  'Nicole Allen', 'Anthony Young', 'Rachel King', 'Jason Wright', 'Kimberly Lopez', 'Joshua Hill',
  'Elizabeth Scott', 'Matthew Green', 'Jennifer Adams', 'Andrew Baker', 'Melissa Nelson', 'Timothy Carter',
  'Donna Mitchell', 'Christopher Perez', 'Linda Roberts', 'Mark Turner', 'Karen Phillips', 'Steven Campbell',
  'Betty Parker', 'Edward Evans', 'Helen Edwards', 'Paul Collins', 'Dorothy Stewart', 'Kenneth Sanchez',
  'Sandra Morris', 'Ronald Rogers', 'Deborah Reed', 'Frank Cook', 'Nancy Bailey', 'Gregory Rivera',
  'Cynthia Cooper', 'Raymond Richardson', 'Kathleen Cox', 'Jack Howard', 'Sharon Ward', 'Jeremy Torres',
  'Angela Peterson', 'Walter Gray', 'Brenda Ramirez', 'Arthur James', 'Emma Watson', 'Harold Brooks'
];

const agentNames = [
  'Agent Smith', 'Sarah Agent', 'Elite Realty', 'Prime Properties', 'Lagos Homes', 'Property Pro',
  'Real Estate Plus', 'Golden Properties', 'Island Homes', 'Mainland Realty', 'Luxury Estates',
  'Property Masters', 'Home Finders', 'Estate Express', 'Property Connect', 'Realty World'
];

// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
  const start = new Date(2024, 11, 1); // December 1, 2024
  const end = new Date(2025, 6, 31); // July 31, 2025
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomFutureDate() {
  const start = new Date(2025, 1, 1); // February 1, 2025
  const end = new Date(2025, 11, 31); // December 31, 2025
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateCustomerData() {
  const name = getRandomItem(names);
  const email = name.toLowerCase().replace(' ', '.') + '@email.com';
  const phone = '+234' + getRandomNumber(100000000, 999999999);
  return { name, email, phone };
}

function generateAgentData() {
  const usingAgent = Math.random() > 0.4; // 60% chance of using agent
  if (!usingAgent) {
    return {
      usingAgent: 'No',
      agentFullName: '',
      agentEmail: '',
      agentPhone: '',
      agentCompany: ''
    };
  }
  
  const company = getRandomItem(agentNames);
  const agentName = getRandomItem(names);
  const email = agentName.toLowerCase().replace(' ', '.') + '@' + company.toLowerCase().replace(' ', '') + '.com';
  const phone = '+234' + getRandomNumber(100000000, 999999999);
  
  return {
    usingAgent: 'Yes',
    agentFullName: agentName,
    agentEmail: email,
    agentPhone: phone,
    agentCompany: company
  };
}

function generateBaseWire(requestType, requestID) {
  const customer = generateCustomerData();
  const agent = generateAgentData();
  const selectedLocations = getRandomItems(locations, getRandomNumber(1, 3));
  
  return {
    requestType,
    requestID,
    time: Timestamp.fromDate(getRandomDate()),
    submitted: true,
    published: Math.random() > 0.1, // 90% published
    locations: selectedLocations,
    customerFullName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    ...agent,
    others: Math.random() > 0.5 ? 'Additional requirements and preferences' : '',
    likes: getRandomItems(['user1', 'user2', 'user3', 'user4', 'user5'], getRandomNumber(0, 3)),
    goodBudget: getRandomItems(['agent1', 'agent2', 'agent3'], getRandomNumber(0, 2)),
    lowBudget: getRandomItems(['agent4', 'agent5'], getRandomNumber(0, 1)),
    responses: getRandomItems(['resp1', 'resp2', 'resp3'], getRandomNumber(0, 3)),
    buildingType: getRandomItem(buildingTypes),
    formCompleted: true
  };
}

function generateRentWire(index) {
  const base = generateBaseWire('Rent', `RENT${(index + 1).toString().padStart(3, '0')}`);
  const useCase = getRandomItem(['Residential', 'Commercial']);
  const propertyType = getRandomItem(propertyTypes);
  
  let wire = {
    ...base,
    useCase,
    propertyType,
    rentDuration: getRandomItem(rentDurations),
    paymentOptions: getRandomItem(['Monthly', 'Yearly']),
    minBudget: getRandomNumber(500000, 2000000),
    maxBudget: getRandomNumber(2500000, 10000000)
  };
  
  if (useCase === 'Residential' && propertyType !== 'Bare Land') {
    wire = {
      ...wire,
      roomsNo: getRandomNumber(1, 5).toString(),
      toiletBaths: getRandomNumber(1, 4).toString(),
      buildingStructure: getRandomItem(buildingStructures)
    };
  } else if (useCase === 'Commercial' && propertyType !== 'Bare Land') {
    wire = {
      ...wire,
      commercialUseCase: getRandomItem(commercialUseCases),
      commercialPropertyType: getRandomItem(commercialTypes),
      floorSpace: getRandomNumber(50, 1000)
    };
  } else if (propertyType === 'Bare Land') {
    wire = {
      ...wire,
      landSize: getRandomItem(['Plot', 'Acres', 'Hectares']),
      units: getRandomNumber(1, 10)
    };
  }
  
  return wire;
}

function generateBuyWire(index) {
  const base = generateBaseWire('Buy', `BUY${(index + 1).toString().padStart(3, '0')}`);
  const useCase = getRandomItem(['Residential', 'Commercial']);
  const propertyType = getRandomItem(propertyTypes);
  
  let wire = {
    ...base,
    useCase,
    propertyType,
    paymentOptions: getRandomItem(['Outright', 'Installment']),
    minBudget: getRandomNumber(5000000, 20000000),
    maxBudget: getRandomNumber(25000000, 100000000)
  };
  
  if (useCase === 'Residential' && propertyType !== 'Bare Land') {
    wire = {
      ...wire,
      roomsNo: getRandomNumber(2, 6).toString(),
      toiletBaths: getRandomNumber(2, 5).toString(),
      buildingStructure: getRandomItem(buildingStructures)
    };
  } else if (useCase === 'Commercial' && propertyType !== 'Bare Land') {
    wire = {
      ...wire,
      commercialUseCase: getRandomItem(commercialUseCases),
      commercialPropertyType: getRandomItem(commercialTypes),
      floorSpace: getRandomNumber(100, 2000)
    };
  } else if (propertyType === 'Bare Land') {
    wire = {
      ...wire,
      landSize: getRandomItem(['Plot', 'Acres', 'Hectares']),
      units: getRandomNumber(1, 20)
    };
  }
  
  return wire;
}

function generateShortLetWire(index) {
  const base = generateBaseWire('Short Let', `SL${(index + 1).toString().padStart(3, '0')}`);
  const checkInDate = getRandomFutureDate();
  const checkOutDate = new Date(checkInDate.getTime() + (getRandomNumber(1, 14) * 24 * 60 * 60 * 1000));
  
  return {
    ...base,
    checkInDate: checkInDate.toISOString().split('T')[0],
    checkOutDate: checkOutDate.toISOString().split('T')[0],
    shortLetUseCase: getRandomItem(shortLetUseCases),
    amenities: getRandomItems(amenities, getRandomNumber(2, 6)),
    services: getRandomItems(services, getRandomNumber(1, 4)),
    shortLetUnits: getRandomNumber(1, 3),
    roomsNo: getRandomNumber(1, 4).toString(),
    toiletBaths: getRandomNumber(1, 3).toString(),
    paymentOptions: 'Daily',
    minBudget: getRandomNumber(50000, 200000),
    maxBudget: getRandomNumber(250000, 500000),
    useCase: 'Short Let'
  };
}

// Generate and upload data
async function generateMockData() {
  console.log('🚀 Starting mock data generation...');
  
  try {
    const wires = [];
    
    // Generate 25 Rent wires
    for (let i = 0; i < 25; i++) {
      wires.push(generateRentWire(i));
    }
    
    // Generate 25 Buy wires
    for (let i = 0; i < 25; i++) {
      wires.push(generateBuyWire(i));
    }
    
    // Generate 10 Short Let wires
    for (let i = 0; i < 10; i++) {
      wires.push(generateShortLetWire(i));
    }
    
    console.log(`📊 Generated ${wires.length} mock wires`);
    
    // Upload to Firestore emulator
    const collectionName = process.env.NEXT_PUBLIC_USE_EMULATOR ? 'emulator_userRequests' : 'userRequests';
    
    for (let i = 0; i < wires.length; i++) {
      const wire = wires[i];
      await addDoc(collection(db, collectionName), wire);
      console.log(`✅ Uploaded wire ${i + 1}/${wires.length}: ${wire.requestID}`);
    }
    
    console.log('🎉 Successfully generated and uploaded all mock data!');
    console.log(`📍 Data uploaded to collection: ${collectionName}`);
    console.log('🔥 You can now view the data in the Firebase Emulator UI at http://localhost:4000');
    
  } catch (error) {
    console.error('❌ Error generating mock data:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
generateMockData();
