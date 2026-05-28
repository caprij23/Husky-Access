import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@huskyaccess_user';

export interface ReportEntry {
  id: string;
  title: string;
  imageUri?: string;
  date: string;
}

export interface UserProfile {
  name: string;
  joinDate: string;
  avatarUri: string | null;
  accessibilityNeeds: string[];
  reports: ReportEntry[];
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  joinDate: '',
  avatarUri: null,
  accessibilityNeeds: [],
  reports: [],
};

interface UserContextType {
  profile: UserProfile;
  setName: (name: string) => void;
  setJoinDate: (date: string) => void;
  setAvatarUri: (uri: string | null) => void;
  setAccessibilityNeeds: (needs: string[]) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  addReport: (report: ReportEntry) => void;
}

const UserContext = createContext<UserContextType>({
  profile: DEFAULT_PROFILE,
  setName: () => {},
  setJoinDate: () => {},
  setAvatarUri: () => {},
  setAccessibilityNeeds: () => {},
  updateProfile: () => {},
  addReport: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load persisted data on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try { setProfile(JSON.parse(raw)); } catch {}
      }
    });
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setName              = useCallback((name: string)           => updateProfile({ name }), [updateProfile]);
  const setJoinDate          = useCallback((joinDate: string)       => updateProfile({ joinDate }), [updateProfile]);
  const setAvatarUri         = useCallback((avatarUri: string|null) => updateProfile({ avatarUri }), [updateProfile]);
  const setAccessibilityNeeds= useCallback((accessibilityNeeds: string[]) => updateProfile({ accessibilityNeeds }), [updateProfile]);

  const addReport = useCallback((report: ReportEntry) => {
    setProfile(prev => {
      const next = { ...prev, reports: [report, ...(prev.reports ?? [])] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <UserContext.Provider value={{ profile, setName, setJoinDate, setAvatarUri, setAccessibilityNeeds, updateProfile, addReport }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function todayFormatted(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
