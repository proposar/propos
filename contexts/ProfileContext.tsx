"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Profile } from "@/types";

type ProfileContextValue = {
  profile: Profile | null;
  loading: boolean;
  refetch: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

const profileCache = { data: null as Profile | null, timestamp: 0, TTL: 60000 }; // Cache for 60s

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(() => {
    const now = Date.now();
    if (profileCache.data && now - profileCache.timestamp < profileCache.TTL) {
      setProfile(profileCache.data);
      return Promise.resolve(profileCache.data);
    }
    
    setLoading(true);
    return fetch("/api/profile", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setProfile(d ?? null);
        if (d) {
          profileCache.data = d;
          profileCache.timestamp = Date.now();
        }
        return d;
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const onUpdate = () => refetch();
    window.addEventListener("profile-updated", onUpdate);
    return () => window.removeEventListener("profile-updated", onUpdate);
  }, [refetch]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refetch }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  return ctx ?? { profile: null, loading: true, refetch: () => {} };
}
