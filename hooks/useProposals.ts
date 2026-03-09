"use client";

import { useState, useEffect } from "react";
import type { Proposal } from "@/types";

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((data) => setProposals(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return { proposals, loading };
}
