// Test data seeder for development/testing
import { createWire } from '@/lib/firestore';
import { BuyWire, RentWire, ShortLetWire } from '@/types';
import { Timestamp } from 'firebase/firestore';

// Sample test data
const testBuyWire: Omit<BuyWire, 'id' | 'time'> = {
  requestType: 'Buy',
  propertyType: 'Completed',
  useCase: 'Residential',
  buildingType: 'Detached',
  roomsNo: '4',
  toiletBaths: '5',
  minBudget: 50000000,
  maxBudget: 80000000,
  paymentOptions: 'Outright',
  locations: ['Victoria Island', 'Ikoyi'],
  submitted: true,
  published: true,
  usingAgent: 'Yes',
  others: '',
  likes: [],
  goodBudget: ['user1', 'user2'],
  lowBudget: [],
  responses: [],
  customerFullName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+234 123 456 7890',
  agentFullName: 'Jane Smith',
  agentEmail: 'jane@realestate.com',
  agentPhone: '+234 987 654 3210',
  agentCompany: 'Prime Properties',
  requestID: 'TEST-BUY-001',
  formCompleted: true,
  units: 1,
  buildingStructure: 'Detached'
};

const testRentWire: Omit<RentWire, 'id' | 'time'> = {
  requestType: 'Rent',
  propertyType: 'Completed',
  useCase: 'Residential',
  buildingType: 'Apartment',
  roomsNo: '2',
  toiletBaths: '3',
  rentDuration: '1 year',
  minBudget: 2000000,
  maxBudget: 3500000,
  paymentOptions: 'Yearly',
  locations: ['Lekki', 'Ajah'],
  submitted: true,
  published: true,
  usingAgent: 'No',
  others: '',
  likes: ['user3'],
  goodBudget: ['user1'],
  lowBudget: ['user4'],
  responses: ['response1'],
  customerFullName: 'Alice Johnson',
  customerEmail: 'alice@example.com',
  customerPhone: '+234 111 222 3333',
  agentFullName: 'Bob Wilson',
  agentEmail: 'bob@homes.com',
  agentPhone: '+234 444 555 6666',
  agentCompany: 'Urban Homes',
  requestID: 'TEST-RENT-001',
  formCompleted: true,
  units: 1,
  buildingStructure: 'Any of the above'
};

const testShortLetWire: Omit<ShortLetWire, 'id' | 'time'> = {
  requestType: 'Short Let',
  checkInDate: new Date('2025-08-01'),
  checkOutDate: new Date('2025-08-15'),
  shortLetUseCase: 'Personal Staycation',
  amenities: ['Pool', 'Gym', 'WiFi'],
  services: ['Cleaning', 'Security'],
  shortLetUnits: 1,
  useCase: 'Personal',
  buildingType: 'Apartment',
  roomsNo: '1',
  toiletBaths: '1',
  minBudget: 150000,
  maxBudget: 250000,
  paymentOptions: 'Daily',
  locations: ['Victoria Island'],
  submitted: true,
  published: true,
  usingAgent: 'Yes',
  others: '',
  likes: [],
  goodBudget: [],
  lowBudget: [],
  responses: [],
  customerFullName: 'Mike Davis',
  customerEmail: 'mike@example.com',
  customerPhone: '+234 777 888 9999',
  agentFullName: 'Sarah Lee',
  agentEmail: 'sarah@shortlets.com',
  agentPhone: '+234 666 777 8888',
  agentCompany: 'Lagos Short Lets',
  requestID: 'TEST-SHORT-001',
  formCompleted: true,
  units: 1
};

// Function to seed test data
export async function seedTestData() {
  try {
    console.log('🌱 Seeding test data...');
    
    const buyWireId = await createWire(testBuyWire);
    console.log('✅ Created test Buy wire:', buyWireId);
    
    const rentWireId = await createWire(testRentWire);
    console.log('✅ Created test Rent wire:', rentWireId);
    
    const shortLetWireId = await createWire(testShortLetWire);
    console.log('✅ Created test Short Let wire:', shortLetWireId);
    
    console.log('🎉 Test data seeding completed!');
    
    return {
      buyWireId,
      rentWireId,
      shortLetWireId
    };
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
}

// Function to clear test data (useful for cleanup)
export async function clearTestData() {
  console.log('🧹 Clearing test data...');
  // This would require additional logic to query and delete test documents
  // For now, manual deletion from Firebase console is recommended
}
