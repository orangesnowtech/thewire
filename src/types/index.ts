// Property request platform types for Next.js
// Converted from Vue project - Updated to match Vue types exactly
import { Timestamp } from 'firebase/firestore';

// Base fields shared by all wires
export interface BaseWire {
  id?: string; // Firestore document ID (added for Next.js)
  locations: string[];
  time: Timestamp | Date; // Support both Firestore Timestamp and Date
  submitted: boolean;
  published: boolean;
  usingAgent: string;
  others: string;
  likes: string[];
  goodBudget: string[];
  lowBudget: string[];
  responses: string[];
  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  agentFullName: string;
  agentEmail: string;
  agentPhone: string;
  agentCompany: string;
  requestID: string;
  buildingType: string; // keep as string for broad compatibility
  formCompleted: boolean;
}

// Shared property fields
export interface BudgetFields {
  minBudget: number;
  maxBudget: number;
  paymentOptions: 'Daily' | 'Monthly' | 'Yearly' | 'Outright' | 'Installment';
}

export interface ResidentialFields {
  toiletBaths?: string;
  roomsNo?: string;
  units?: number;
  buildingStructure?: 'Detached' | 'Semi-Detached' | 'Terrace' | 'Any of the above';
}

export interface CommercialFields {
  commercialUseCase?: string;
  commercialPropertyType?: string;
  floorSpace?: number;
}

export interface BareLandFields {
  landSize?: 'Plot' | 'Acres' | 'Hectares';
  units?: number;
}

// Wire Types - Updated to match Vue structure
export interface RentWire extends BaseWire, BudgetFields, ResidentialFields, CommercialFields, BareLandFields {
  requestType: 'Rent';
  rentDuration: '6 months' | '1 year' | '2 years' | '3 years' | '4 years' | '5 years' | 'Above 5 years';
  propertyType: 'Bare Land' | 'Off Plan' | 'Under Construction' | 'Completed';
  useCase: 'Residential' | 'Commercial';
}

export interface BuyWire extends BaseWire, BudgetFields, ResidentialFields, CommercialFields, BareLandFields {
  requestType: 'Buy';
  propertyType: 'Bare Land' | 'Off Plan' | 'Under Construction' | 'Completed';
  useCase: 'Residential' | 'Commercial';
}

export interface ShortLetWire extends BaseWire, BudgetFields, ResidentialFields {
  requestType: 'Short Let';
  checkInDate: Date | string | undefined;
  checkOutDate: Date | string | undefined;
  shortLetUseCase: 'Personal Staycation' | 'Family Vacation' | 'Work Retreat' | 'Media Production' |'House Party' | 'Others';
  amenities: string[];
  services: string[];
  shortLetUnits: number;
  useCase: string;
}

export interface JointVentureWire extends BaseWire {
  requestType: 'Joint Venture';
  jvDevelopmentType: 'Residential' | 'Commercial' | 'Mixed Use';
  jvLandSizeSqm: number;
  jvPartyType: 'Land Owner seeking Developer' | 'Developer seeking Land Owner';
  jvPartnershipType: string;
  jvCommercialUseCase: string;
  jvResidentialUseCase: string;
  useCase: 'Commerical JV' | 'Residential JV';
}

// Discriminated union for all wire types
export type Wire = RentWire | BuyWire | ShortLetWire | JointVentureWire;

// Request types
export type RequestType = 'Buy' | 'Rent' | 'Short Let' | 'Joint Venture';

// Additional utility types
export type PropertyType = 'Apartment' | 'House' | 'Condo' | 'Commercial' | 'Land';

// Location type for filtering
export interface Location {
  name: string;
  state: string;
}

// Search/Filter interfaces
export interface SearchFilters {
  requestType?: RequestType | 'All';
  locations?: string[];
  minBudget?: number;
  maxBudget?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
}

// User interface for authentication
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
