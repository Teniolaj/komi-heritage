"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function PageWrapper({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex-1 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
