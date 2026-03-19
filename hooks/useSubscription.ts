"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SubscriptionPlan } from "@/types";

export function useSubscription() {
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [loading, setLoading] = useState(true);
  // Create a single Supabase client instance for the lifetime of this hook.
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setPlan("free");
          setLoading(false);
          return;
        }
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("subscription_plan")
          .eq("id", authUser.id)
          .single();
        
        if (error) {
          console.error("Error fetching subscription:", error);
          setPlan("free");
        } else {
          setPlan((profile?.subscription_plan as SubscriptionPlan) || "free");
        }
      } catch (error) {
        console.error("Unexpected error fetching subscription:", error);
        setPlan("free");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, [supabase]);

  return { plan, loading };
}
