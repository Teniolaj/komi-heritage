"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function PrimaryButton({ children, onClick, className = '', type = 'button', disabled = false }: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.02, backgroundColor: 'var(--color-primary-container)' }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`bg-primary text-on-primary font-dm-sans font-bold uppercase tracking-widest px-6 py-4 cursor-pointer select-none border-b-2 border-[#8B1A1E] disabled:opacity-50 disabled:cursor-not-allowed text-center flex justify-center items-center ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({ children, onClick, className = '', type = 'button', disabled = false }: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { backgroundColor: 'var(--color-primary)', color: '#ffffff', borderColor: 'var(--color-primary)' }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`border-2 border-primary text-primary bg-transparent font-dm-sans font-bold uppercase tracking-widest px-6 py-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center flex justify-center items-center ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function IconButton({ children, onClick, className = '', disabled = false }: ButtonProps) {
  return (
    <motion.button
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.1, backgroundColor: 'var(--color-primary)', color: '#fff' }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`w-10 h-10 rounded-full border-2 border-primary text-primary flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
}
