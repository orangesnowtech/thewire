import type { Timestamp } from 'firebase/firestore';

// Base fields shared by all wires
export interface BaseWire {
  locations: string[];
  time: Timestamp;
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
  // buildingType removed to avoid conflict
}

export interface CommercialFields {
  commercialUseCase?: string;
  commercialPropertyType?: string;
  floorSpace?: number;
  // buildingType removed to avoid conflict
}

export interface BareLandFields {
  landSize?: 'Plot' | 'Acres' | 'Hectares';
  units?: number;
}

// Discriminated union for all wire types
export type Wire =
  | RentWire
  | BuyWire
  | ShortLetWire
  | JointVentureWire;

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
