'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TerminalWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
  showControls?: boolean;
}

export function TerminalWindow({ 
  children, 
  title = 'terminal',
  className = '',
  showControls = true 
}: TerminalWindowProps) {
  return (
    <motion.div 
      className={`terminal-window ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title bar */}
      <div className="terminal-titlebar">
        {showControls && (
          <div className="flex gap-2">
            <motion.div 
              className="terminal-dot terminal-dot-red"
              whileHover={{ scale: 1.2 }}
            />
            <motion.div 
              className="terminal-dot terminal-dot-yellow"
              whileHover={{ scale: 1.2 }}
            />
            <motion.div 
              className="terminal-dot terminal-dot-green"
              whileHover={{ scale: 1.2 }}
            />
          </div>
        )}
        <span className="flex-1 text-center text-sm text-slate-400 font-mono">
          {title}
        </span>
        {showControls && <div className="w-14" />}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}
