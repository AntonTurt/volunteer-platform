// src/utils/auth.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

// Admin credentials - hardcoded for demo purposes
export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "password123";

// Mock user session management
let currentUser = null;

// Mock authentication for demo purposes
export const signIn = async (email: string, password: string) => {
  // For demo, check hardcoded admin credentials first
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const mockUser = {
      uid: "admin123",
      email: ADMIN_EMAIL,
      displayName: "Admin User",
    };
    
    // Store in session storage for persistence across page loads
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    currentUser = mockUser;
    
    return {
      user: mockUser
    };
  }
  
  // Try Firebase auth, but catch any configuration errors
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem('user', JSON.stringify(result.user));
    currentUser = result.user;
    return result;
  } catch (error: any) {
    // If it's a configuration error, but credentials match the admin, allow login
    if (error.code === 'auth/configuration-not-found' && 
        email === ADMIN_EMAIL && 
        password === ADMIN_PASSWORD) {
      const mockUser = {
        uid: "admin123",
        email: ADMIN_EMAIL,
        displayName: "Admin User",
      };
      
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      currentUser = mockUser;
      
      return {
        user: mockUser
      };
    }
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem('user', JSON.stringify(result.user));
    currentUser = result.user;
    return result;
  } catch (error: any) {
    // If Firebase configuration is missing, create a mock user
    if (error.code === 'auth/configuration-not-found') {
      const mockUser = {
        uid: Math.random().toString(36).substring(2, 15),
        email,
        displayName: email.split('@')[0],
      };
      
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      currentUser = mockUser;
      
      return {
        user: mockUser
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
  } catch (error: any) {
    // If Firebase configuration is missing, pretend we sent a reset email
    if (error.code === 'auth/configuration-not-found') {
      if (email && email.includes('@')) {
        return true;
      }
    }
    throw error;
  }
};

export const getCurrentUser = () => {
  if (currentUser) return currentUser;
  
  const storedUser = sessionStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

export const signOut = () => {
  sessionStorage.removeItem('user');
  currentUser = null;
};