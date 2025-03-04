import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';

// Session interface
export interface Session {
  id?: string;
  userId: string;
  organization: string;
  checkInTime: Date;
  checkOutTime?: Date;
  duration?: number; // in minutes
  status: 'checked-in' | 'checked-out';
  date: Date;
  notes?: string;
}

// Check in a volunteer
export async function checkInVolunteer(userId: string, organization: string, notes?: string) {
  try {
    // Check if user is already checked in
    const activeSession = await getActiveSession(userId);
    if (activeSession) {
      throw new Error('User already checked in');
    }

    const now = new Date();
    const sessionData: Session = {
      userId,
      organization,
      checkInTime: now,
      status: 'checked-in',
      date: now,
      notes
    };

    const docRef = await addDoc(collection(db, 'sessions'), sessionData);
    return { id: docRef.id, ...sessionData };
  } catch (error) {
    console.error('Error checking in:', error);
    throw error;
  }
}

// Check out a volunteer
export async function checkOutVolunteer(userId: string) {
  try {
    const activeSession = await getActiveSession(userId);
    if (!activeSession || !activeSession.id) {
      throw new Error('No active session found');
    }

    const now = new Date();
    const checkInTime = activeSession.checkInTime;
    
    // Calculate duration in minutes
    const durationMs = now.getTime() - checkInTime.getTime();
    const durationMinutes = Math.round(durationMs / 60000);

    const sessionRef = doc(db, 'sessions', activeSession.id);
    await updateDoc(sessionRef, {
      checkOutTime: now,
      duration: durationMinutes,
      status: 'checked-out'
    });

    return {
      ...activeSession,
      checkOutTime: now,
      duration: durationMinutes,
      status: 'checked-out' as const
    };
  } catch (error) {
    console.error('Error checking out:', error);
    throw error;
  }
}

// Get active session for a user
export async function getActiveSession(userId: string): Promise<Session | null> {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      where('status', '==', 'checked-in')
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Session;
  } catch (error) {
    console.error('Error getting active session:', error);
    throw error;
  }
}

// Get user's session history
export async function getUserSessionHistory(userId: string) {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Session[];
  } catch (error) {
    console.error('Error getting session history:', error);
    throw error;
  }
}

// Get total hours for a user
export async function getUserTotalHours(userId: string) {
  try {
    const sessions = await getUserSessionHistory(userId);
    const completedSessions = sessions.filter(session => session.status === 'checked-out');
    
    const totalMinutes = completedSessions.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0);
    
    return totalMinutes / 60; // Convert to hours
  } catch (error) {
    console.error('Error calculating total hours:', error);
    throw error;
  }
}

// Get all sessions by organization
export async function getSessionsByOrganization(organization: string) {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('organization', '==', organization),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Session[];
  } catch (error) {
    console.error('Error getting organization sessions:', error);
    throw error;
  }
}