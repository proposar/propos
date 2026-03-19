"use client";

import { useState, useEffect } from "react";
import type { Proposal } from "@/types";

let cachedProposals: Proposal[] | null = null;
let cachedTimestamp = 0;
const CACHE_TTL = 30000; // 30 seconds

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>(cachedProposals || []);
  const [loading, setLoading] = useState(!cachedProposals);

  useEffect(() => {
    const now = Date.now();
    if (cachedProposals && now - cachedTimestamp < CACHE_TTL) {
      setProposals(cachedProposals);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/proposals?limit=50")
      .then((res) => res.json())
      .then((data) => {
        const array = Array.isArray(data) ? data : [];
        cachedProposals = array;
        cachedTimestamp = Date.now();
        setProposals(array);
      })
      .catch(() => setProposals([]))
      .finally(() => setLoading(false));
  }, []);

  return { proposals, loading };
}
