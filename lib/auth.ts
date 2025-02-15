import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

const getFirebaseErrorMessage = (error: any): string => {
  if (error?.code) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials.';
      case 'auth/operation-not-allowed':
        return 'This login method is not enabled.';
      default:
        return `Authentication error: ${error.code}`;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: getFirebaseErrorMessage(error) };
  }
};

export const signUp = async (email: string, password: string) => {
  // Basic validation
  if (!email || !password) {
    return { 
      user: null, 
      error: 'Email and password are required.' 
    };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      user: null, 
      error: 'Please enter a valid email address.' 
    };
  }

  // Password length validation
  if (password.length < 6) {
    return { 
      user: null, 
      error: 'Password must be at least 6 characters long.' 
    };
  }

  try {
    console.log('Attempting to create user with email:', email); // Debug log
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user.uid); // Debug log
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error); // Debug log
    const errorMessage = getFirebaseErrorMessage(error);
    return { user: null, error: errorMessage };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: errorMessage };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
