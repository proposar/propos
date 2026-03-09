"use client";

import { motion } from "framer-motion";

const quote = "I went from spending 3 hours per proposal to 60 seconds. Game changer.";
const author = "Sarah Chen, Brand Designer";

export function AuthBrandPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between p-12 bg-gradient-to-br from-background via-surface to-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.15),transparent)]" />
      <div className="relative z-10">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-2xl font-bold text-foreground"
        >
          Proposar
        </motion.a>
      </div>
      <div className="relative z-10 space-y-6">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed"
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gold text-sm font-medium"
        >
          — {author}
        </motion.p>
      </div>
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted text-sm"
        >
          Trusted by 2,000+ freelancers worldwide
        </motion.div>
      </div>
    </motion.div>
  );
}
