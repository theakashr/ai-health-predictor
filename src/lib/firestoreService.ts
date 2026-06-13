import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { HealthData, Prediction, UserProfile } from '../types/health';

// ----------------------
// User Profiles
// ----------------------

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

// ----------------------
// Health Data
// ----------------------

export const addHealthData = async (data: Omit<HealthData, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const healthDataCollection = collection(db, 'healthData');
    const docRef = await addDoc(healthDataCollection, {
      ...data,
      timestamp: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding health data:", error);
    throw error;
  }
};

export const getUserHealthData = async (userId: string, limitCount = 10): Promise<HealthData[]> => {
  try {
    const q = query(
      collection(db, 'healthData'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthData));
  } catch (error) {
    console.error("Error getting health data:", error);
    throw error;
  }
};

export const getLatestHealthData = async (userId: string): Promise<HealthData | null> => {
  try {
    const data = await getUserHealthData(userId, 1);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error getting latest health data:", error);
    throw error;
  }
};

// ----------------------
// Predictions
// ----------------------

export const addPrediction = async (prediction: Omit<Prediction, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const predictionsCollection = collection(db, 'predictions');
    const docRef = await addDoc(predictionsCollection, {
      ...prediction,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding prediction:", error);
    throw error;
  }
};

export const getUserPredictions = async (userId: string, limitCount = 10): Promise<Prediction[]> => {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prediction));
  } catch (error) {
    console.error("Error getting user predictions:", error);
    throw error;
  }
};

export const getLatestPrediction = async (userId: string): Promise<Prediction | null> => {
  try {
    const data = await getUserPredictions(userId, 1);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error getting latest prediction:", error);
    throw error;
  }
};

export const getAllPredictions = async (): Promise<Prediction[]> => {
  try {
    const q = query(collection(db, 'predictions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prediction));
  } catch (error) {
    console.error("Error getting all predictions:", error);
    throw error;
  }
};
