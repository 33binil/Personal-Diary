import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider } from 'firebase/auth';
import googleDriveService from '../services/googleDriveService.js';
import { createEntry } from '../lib/api.js'

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driveInitialized, setDriveInitialized] = useState(false);
  const [needsDriveAuth, setNeedsDriveAuth] = useState(false);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);

      // Get Google OAuth credential with Drive scope token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      if (accessToken) {
        const driveInit = await googleDriveService.initialize(accessToken);
        setDriveInitialized(driveInit);
        setNeedsDriveAuth(false);
        console.log('Google Drive initialized:', driveInit);
        // Persist token for future sessions
        try { localStorage.setItem('GDRIVE_ACCESS_TOKEN', accessToken); } catch {}
      } else {
        console.warn('No Google Drive access token returned.');
        setDriveInitialized(false);
        setNeedsDriveAuth(true);
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDriveInitialized(false);
      setNeedsDriveAuth(false);
      try { localStorage.removeItem('GDRIVE_ACCESS_TOKEN'); } catch {}
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Force Drive reauthorization flow: prompt user to sign-in again for Drive scope
  const requestDriveAuthorization = async () => {
    try {
      // Use signInWithPopup to request Drive scope again; this will return an access token
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      if (accessToken) {
        const driveInit = await googleDriveService.initialize(accessToken);
        setDriveInitialized(!!driveInit);
        setNeedsDriveAuth(false);
        try { localStorage.setItem('GDRIVE_ACCESS_TOKEN', accessToken); } catch {}
        return true;
      }
    } catch (e) {
      console.warn('Drive authorization failed', e);
    }
    return false;
  }

  // extract and persist Firebase ID token for server calls
  const persistIdToken = async (u) => {
    try {
      if (!u) { try { localStorage.removeItem('FIREBASE_ID_TOKEN') } catch {} ; return }
      const idToken = await u.getIdToken()
      try { localStorage.setItem('FIREBASE_ID_TOKEN', idToken) } catch {}
    } catch (e) { console.warn('Failed to persist id token', e) }
  }

  // Update User Name
  const updateUserName = async (newName) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: newName
        });
        // Update the local user state
        setUser({ ...auth.currentUser, displayName: newName });
        return true;
      }
    } catch (error) {
      console.error('Error updating user name:', error);
      throw error;
    }
  };

  // Save diary entry to Google Drive
  const saveDiaryEntry = async (title, content, date, images = [], audio = [], theme = 1, prompt = '') => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      if (!driveInitialized) {
        throw new Error('Google Drive not initialized');
      }

      const result = await googleDriveService.saveDiaryEntry(
        title, content, date, images, audio, theme, user.uid, prompt
      );
      // After successful cloud save, also persist a lightweight record to server DB
      // The server will infer creator from the Firebase ID token we persist in localStorage
      try {
        const payload = {
          title,
          content,
          date,
          images: (images || []).map(i => i.name || ''),
          audio: (audio || []).map(a => a.name || ''),
        }
        await createEntry(payload)
      } catch (e) {
        console.warn('Failed to persist entry to server DB:', e)
      }

      return result;
    } catch (error) {
      console.error('Error saving diary entry:', error);
      throw error;
    }
  };

  // Get all diary entries
  const getAllDiaryEntries = async () => {
    try {
      if (!user || !driveInitialized) {
        return [];
      }

      const entries = await googleDriveService.getAllDiaryEntries(user.uid);
      return entries;
    } catch (error) {
      console.error('Error getting diary entries:', error);
      return [];
    }
  };

  // Delete diary entry from Google Drive by fileId
  const deleteDiaryEntry = async (fileId) => {
    try {
      if (!driveInitialized) {
        throw new Error('Google Drive not initialized');
      }
      const ok = await googleDriveService.deleteDiaryEntry(fileId);
      return ok;
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      return false;
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      // Attempt to initialize Drive from stored token when session persists
      if (user) {
        try {
          const token = localStorage.getItem('GDRIVE_ACCESS_TOKEN');
          if (token) {
            googleDriveService.initialize(token).then((ok) => setDriveInitialized(!!ok));
            // if no token present, mark that this session needs Drive auth
          } else {
            setNeedsDriveAuth(true);
          }
        } catch {}
        // persist current firebase id token for API calls
        persistIdToken(user)
      }
      if (!user) persistIdToken(null)
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    deleteDiaryEntry,
    signInWithGoogle,
    logout,
    updateUserName,
    saveDiaryEntry,
    getAllDiaryEntries,
    driveInitialized,
    needsDriveAuth,
    requestDriveAuthorization,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};