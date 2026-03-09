"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gold text-[#0a0a14] overflow-hidden"
        >
          <div className="flex items-center justify-center gap-4 py-2.5 px-4 text-sm font-medium">
            <span>🎉 Launch offer: Get 3 months free on any annual plan — ends soon</span>
            <Link href="/signup" className="underline font-semibold hover:no-underline">
              Claim offer →
            </Link>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
