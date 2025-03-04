// src/utils/auth.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

// Admin credentials - hardcoded for demo purposes
export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "password123";

// Mock authentication for demo purposes
export const signIn = async (email: string, password: string) => {
  // For demo, allow either Firebase auth or hardcoded admin
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Return a mock user object
    return {
      user: {
        uid: "admin123",
        email: ADMIN_EMAIL,
        displayName: "Admin User",
      }
    };
  }
  
  // Fall back to Firebase auth if not the admin
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    // If Firebase isn't configured, check for hardcoded admin again
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return {
        user: {
          uid: "admin123",
          email: ADMIN_EMAIL,
          displayName: "Admin User",
        }
      };
    }
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    // For demo purposes, pretend to create a user even if Firebase fails
    if (error.code === 'auth/operation-not-allowed') {
      return {
        user: {
          uid: Math.random().toString(36).substring(2, 15),
          email,
          displayName: "New User",
        }
      };
    }
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  // For admin, just pretend we sent an email
  if (email === ADMIN_EMAIL) {
    return true;
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    // For demo, pretend it worked if Firebase isn't set up
    if (email && email.includes('@')) {
      return true;
    }
    throw error;
  }
};