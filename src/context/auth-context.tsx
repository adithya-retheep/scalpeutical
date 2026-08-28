'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Product, TrackingPeriod } from '../lib/types';
import { StorageStore, DEMO_USER } from '../lib/storage-store';

interface AuthContextType {
  user: UserProfile | null;
  activeProduct: Product | null;
  activePeriod: TrackingPeriod | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginId: string, pass: string) => Promise<boolean>;
  signUpSendOTP: (identifier: string, isEmail: boolean) => Promise<{ verificationId: string; generatedOtp: string }>;
  verifyOTP: (enteredOtp: string, expectedOtp: string) => Promise<boolean>;
  setCredentials: (loginId: string, pass: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeProfileStep: () => void;
  completeBaselineStep: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activePeriod, setActivePeriod] = useState<TrackingPeriod | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Temporary signup flow state
  const [pendingSignup, setPendingSignup] = useState<{ identifier?: string; verificationId?: string; generatedOtp?: string }>({});

  const refreshUser = () => {
    const storedUser = StorageStore.getUser();
    setUser(storedUser);
    setIsAuthenticated(Boolean(storedUser));

    if (storedUser) {
      const period = StorageStore.getActiveTrackingPeriod();
      setActivePeriod(period);
      if (period) {
        const prod = StorageStore.getProductById(period.productId);
        setActiveProduct(prod);
      }
    } else {
      setActivePeriod(null);
      setActiveProduct(null);
    }
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const login = async (loginId: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    StorageStore.initializeDemoDataIfNeeded();
    const storedUser = StorageStore.getUser();
    if (storedUser) {
      storedUser.loginId = loginId;
      StorageStore.saveUser(storedUser);
    } else {
      const newUser: UserProfile = {
        userId: `user_${Math.random().toString(36).substring(2, 9)}`,
        fullName: 'Scalp Care User',
        phoneNumber: loginId,
        loginId: loginId,
        profileCompleted: false,
        baselineCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      StorageStore.saveUser(newUser);
    }
    refreshUser();
    setIsLoading(false);
    return true;
  };

  const signUpSendOTP = async (identifier: string, isEmail: boolean): Promise<{ verificationId: string; generatedOtp: string }> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 400));
    const verificationId = `v_${Math.random().toString(36).substring(2, 8)}`;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingSignup({ identifier, verificationId, generatedOtp });
    setIsLoading(false);
    return { verificationId, generatedOtp };
  };

  const verifyOTP = async (enteredOtp: string, expectedOtp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 400));
    if (enteredOtp.trim() === expectedOtp.trim() || enteredOtp.trim() === '123456') {
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const setCredentials = async (loginId: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    // Save registered user profile to storage
    const newUser: UserProfile = {
      userId: `user_${Math.random().toString(36).substring(2, 9)}`,
      fullName: 'Scalp Care User',
      phoneNumber: pendingSignup.identifier || loginId,
      loginId: loginId,
      profileCompleted: false,
      baselineCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageStore.saveUser(newUser);
    // Keep user logged out so they must sign in on Login page
    localStorage.removeItem('scalpeutical_user');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('scalpeutical_user');
    setUser(null);
    setIsAuthenticated(false);
    setActivePeriod(null);
    setActiveProduct(null);
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profileData, updatedAt: new Date().toISOString() };
    StorageStore.saveUser(updated);
    setUser(updated);
  };

  const completeProfileStep = () => {
    if (!user) return;
    const updated = { ...user, profileCompleted: true, updatedAt: new Date().toISOString() };
    StorageStore.saveUser(updated);
    setUser(updated);
  };

  const completeBaselineStep = () => {
    if (!user) return;
    const updated = { ...user, baselineCompleted: true, updatedAt: new Date().toISOString() };
    StorageStore.saveUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeProduct,
        activePeriod,
        isAuthenticated,
        isLoading,
        login,
        signUpSendOTP,
        verifyOTP,
        setCredentials,
        logout,
        refreshUser,
        updateProfile,
        completeProfileStep,
        completeBaselineStep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
