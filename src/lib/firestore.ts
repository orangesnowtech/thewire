// Firebase service functions for wire operations
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Wire, RequestType } from '@/types';
import { getCollectionName } from '@/lib/environment';

// Collection reference with environment support
const WIRES_COLLECTION = process.env.NEXT_PUBLIC_USE_EMULATOR === 'true' ? 'emulator_userRequests' : 'userRequests';

// Helper function to convert Firestore document to Wire
function documentToWire(docId: string, docData: DocumentData): Wire {
  console.log('Converting document:', { docId, docData }); // Debug log
  
  return {
    id: docId,
    ...docData,
    // Ensure required arrays exist with defaults
    likes: docData.likes || [],
    responses: docData.responses || [],
    locations: docData.locations || [],
  } as unknown as Wire;
}

// Get all published wires
export async function getPublishedWires(): Promise<Wire[]> {
  try {
    const q = query(
      collection(db, WIRES_COLLECTION),
      where('published', '==', true),
      orderBy('time', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const wires: Wire[] = [];
    
    querySnapshot.forEach((doc) => {
      wires.push(documentToWire(doc.id, doc.data()));
    });
    
    return wires;
  } catch (error) {
    console.error('Error fetching published wires:', error);
    throw error;
  }
}

// Get wires by request type
export async function getWiresByType(requestType: RequestType): Promise<Wire[]> {
  try {
    const q = query(
      collection(db, WIRES_COLLECTION),
      where('published', '==', true),
      where('requestType', '==', requestType),
      orderBy('time', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const wires: Wire[] = [];
    
    querySnapshot.forEach((doc) => {
      wires.push(documentToWire(doc.id, doc.data()));
    });
    
    return wires;
  } catch (error) {
    console.error('Error fetching wires by type:', error);
    throw error;
  }
}

// Get wires by location
export async function getWiresByLocation(locations: string[]): Promise<Wire[]> {
  try {
    const q = query(
      collection(db, WIRES_COLLECTION),
      where('published', '==', true),
      where('locations', 'array-contains-any', locations),
      orderBy('time', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const wires: Wire[] = [];
    
    querySnapshot.forEach((doc) => {
      wires.push(documentToWire(doc.id, doc.data()));
    });
    
    return wires;
  } catch (error) {
    console.error('Error fetching wires by location:', error);
    throw error;
  }
}

// Get wires by type and location
export async function getWiresByTypeAndLocation(
  requestType: RequestType, 
  locations: string[]
): Promise<Wire[]> {
  try {
    const q = query(
      collection(db, WIRES_COLLECTION),
      where('published', '==', true),
      where('requestType', '==', requestType),
      where('locations', 'array-contains-any', locations),
      orderBy('time', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const wires: Wire[] = [];
    
    querySnapshot.forEach((doc) => {
      wires.push(documentToWire(doc.id, doc.data()));
    });
    
    return wires;
  } catch (error) {
    console.error('Error fetching wires by type and location:', error);
    throw error;
  }
}

// Get wire by ID
export async function getWireById(id: string): Promise<Wire | null> {
  try {
    const docRef = doc(db, WIRES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return documentToWire(docSnap.id, docSnap.data());
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching wire by ID:', error);
    throw error;
  }
}

// Create a new wire
export async function createWire(wireData: Omit<Wire, 'id' | 'time'>): Promise<string> {
  try {
    const wireWithTimestamp = {
      ...wireData,
      time: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, WIRES_COLLECTION), wireWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error creating wire:', error);
    throw error;
  }
}

// Update wire
export async function updateWire(id: string, updates: Partial<Wire>): Promise<void> {
  try {
    const docRef = doc(db, WIRES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating wire:', error);
    throw error;
  }
}

// Delete wire
export async function deleteWire(id: string): Promise<void> {
  try {
    const docRef = doc(db, WIRES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting wire:', error);
    throw error;
  }
}

// Add like to wire
export async function addLikeToWire(wireId: string, userId: string): Promise<void> {
  try {
    const wire = await getWireById(wireId);
    if (wire && !wire.likes.includes(userId)) {
      const updatedLikes = [...wire.likes, userId];
      await updateWire(wireId, { likes: updatedLikes });
    }
  } catch (error) {
    console.error('Error adding like to wire:', error);
    throw error;
  }
}

// Remove like from wire
export async function removeLikeFromWire(wireId: string, userId: string): Promise<void> {
  try {
    const wire = await getWireById(wireId);
    if (wire && wire.likes.includes(userId)) {
      const updatedLikes = wire.likes.filter(id => id !== userId);
      await updateWire(wireId, { likes: updatedLikes });
    }
  } catch (error) {
    console.error('Error removing like from wire:', error);
    throw error;
  }
}

// Search wires by partial request ID
export function filterWiresByRequestId(wires: Wire[], searchTerm: string): Wire[] {
  if (!searchTerm.trim()) return wires;
  
  return wires.filter(wire => 
    wire.requestID && 
    wire.requestID.toUpperCase().includes(searchTerm.toUpperCase())
  );
}
