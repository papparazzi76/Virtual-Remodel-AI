
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { redirectToCheckout } from '../services/stripeService';

// --- MOCK AUTHENTICATION SERVICE ---
// This is a simplified, insecure mock using localStorage to simulate a user database.
// WARNING: Do not use this pattern in a production application.
const MOCK_DB_KEY = 'virtualRemodelUserDB';
const SESSION_KEY = 'virtualRemodelUserSession';

// This is a simple, insecure hash function for demonstration purposes only.
// In a real application, NEVER handle passwords on the client-side.
// Hashing should be done on the server with a strong, salted algorithm like bcrypt.
const simpleHash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return h.toString();
};

const getMockUsers = (): User[] => {
  try {
    const users = localStorage.getItem(MOCK_DB_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
};

// Ensures an admin user exists in the mock database on startup.
const initializeAdminUser = () => {
    try {
        const users = getMockUsers();
        const adminExists = users.some(u => u.role === 'Admin');

        if (!adminExists) {
            const adminUser: User = {
                id: `user_admin_${Date.now()}`,
                email: 'admin@example.com',
                passwordHash: simpleHash('admin123'), // Default password: admin123
                role: 'Admin',
                credits: 9999,
            };
            const updatedUsers = [...users, adminUser];
            saveMockUsers(updatedUsers);
            console.log('Admin user created. Email: admin@example.com, Password: admin123');
        }
    } catch (e) {
        console.error("Failed to initialize admin user:", e);
    }
};

initializeAdminUser();
// --- END MOCK ---

interface PurchaseConfirmationDetails {
  creditsAdded: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, passwordHash: string) => Promise<User | null>;
  register: (email: string, passwordHash: string) => Promise<User | null>;
  logout: () => void;
  // Credit Management
  purchaseCredits: (amount: number) => Promise<void>;
  deductCredit: () => void;
  // Demo mode
  isDemo: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  // Auth Modal
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  // Pricing Modal
  isPricingModalOpen: boolean;
  openPricingModal: () => void;
  closePricingModal: () => void;
  snoozeTrialReminder: () => void;
  // Purchase Confirmation Modal
  purchaseConfirmation: PurchaseConfirmationDetails | null;
  hidePurchaseConfirmation: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [purchaseConfirmation, setPurchaseConfirmation] = useState<PurchaseConfirmationDetails | null>(null);

  useEffect(() => {
    // Check for an active session on initial load
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const users = getMockUsers();
        const loggedInUser = users.find(u => u.id === session);
        if (loggedInUser) {
          setUser(loggedInUser);
        }
      }
    } catch (e) {
      console.error("Failed to load session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);
  
  const openPricingModal = useCallback(() => setIsPricingModalOpen(true), []);
  const closePricingModal = useCallback(() => setIsPricingModalOpen(false), []);

  const snoozeTrialReminder = useCallback(() => {
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const snoozeUntil = Date.now() + twentyFourHours;
    localStorage.setItem('trialSnoozeUntil', snoozeUntil.toString());
    closePricingModal();
  }, [closePricingModal]);
  
  const hidePurchaseConfirmation = useCallback(() => {
    setPurchaseConfirmation(null);
  }, []);

  const login = useCallback(async (email: string, passwordHash: string): Promise<User | null> => {
    const users = getMockUsers();
    const foundUser = users.find(u => u.email === email && u.passwordHash === passwordHash);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(SESSION_KEY, foundUser.id);
      setIsDemo(false);
      return foundUser;
    }
    return null;
  }, []);

  const register = useCallback(async (email: string, passwordHash: string): Promise<User | null> => {
    const users = getMockUsers();
    if (users.some(u => u.email === email)) {
      return null; // Email already in use
    }
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      passwordHash,
      role: 'Guest',
      credits: 5, // Start with 5 free trial credits
    };
    
    const updatedUsers = [...users, newUser];
    saveMockUsers(updatedUsers);
    
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, newUser.id);
    setIsDemo(false);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    setIsDemo(false);
  }, []);
  
  const purchaseCredits = useCallback(async (amount: number) => {
    if (!user) throw new Error("No user to upgrade");

    const { success } = await redirectToCheckout();
    if (success) {
      const updatedUser: User = { 
        ...user, 
        credits: user.credits + amount,
        role: 'Paid' // Upgrade role on first purchase
      };
      setUser(updatedUser);
      
      const users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveMockUsers(users);
      }
      
      closePricingModal();
      setPurchaseConfirmation({ creditsAdded: amount });
    }
  }, [user, closePricingModal]);

  const deductCredit = useCallback(() => {
    if (user && user.credits > 0) {
        const updatedUser = { ...user, credits: user.credits - 1 };
        setUser(updatedUser);

        const users = getMockUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            saveMockUsers(users);
        }
    }
  }, [user]);

  const enterDemoMode = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    setIsDemo(true);
  }, []);

  const exitDemoMode = useCallback(() => {
    setIsDemo(false);
    openAuthModal();
  }, [openAuthModal]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    purchaseCredits,
    deductCredit,
    isDemo,
    enterDemoMode,
    exitDemoMode,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    isPricingModalOpen,
    openPricingModal,
    closePricingModal,
    snoozeTrialReminder,
    purchaseConfirmation,
    hidePurchaseConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};