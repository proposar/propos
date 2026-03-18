"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthAwareLink } from "@/components/auth/AuthAwareLink";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();

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
            <span>{t.announcement.text}</span>
            <AuthAwareLink unauthenticatedHref="/signup" className="underline font-semibold hover:no-underline">
              {t.announcement.cta}
            </AuthAwareLink>
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

