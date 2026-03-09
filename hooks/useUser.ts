"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export function useUser() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          setUser(null);
        } else {
          setUser(profile as Profile);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [supabase]);

  return { user, loading };
}
