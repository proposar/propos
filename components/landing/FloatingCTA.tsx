"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthAwareLink } from "@/components/auth/AuthAwareLink";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setVisible(scrollHeight > 200 && scrolled > scrollHeight * 0.5);
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <AuthAwareLink
            unauthenticatedHref="/signup"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-[#e8c76a] px-7 py-3.5 font-semibold text-[#0a0a14] shadow-2xl shadow-gold/30 hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:scale-105 transition-all duration-300"
          >
            <span className="text-lg">✨</span>
            Try Proposar Free
          </AuthAwareLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
