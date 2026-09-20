'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeToken {
  text: string;
  type: 'keyword' | 'string' | 'function' | 'variable' | 'operator' | 'punctuation' | 'comment' | 'number' | 'plain';
}

interface TypingCodeProps {
  code: CodeToken[];
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

const tokenColors: Record<CodeToken['type'], string> = {
  keyword: 'text-fuchsia-400',
  string: 'text-lime-400',
  function: 'text-cyan-400',
  variable: 'text-orange-400',
  operator: 'text-slate-300',
  punctuation: 'text-slate-400',
  comment: 'text-slate-500 italic',
  number: 'text-amber-400',
  plain: 'text-slate-200',
};

export function TypingCode({ 
  code, 
  speed = 50, 
  delay = 0,
  showCursor = true,
  className = '',
  onComplete
}: TypingCodeProps) {
  const [displayedTokens, setDisplayedTokens] = useState<{ token: CodeToken; charIndex: number }[]>([]);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentTokenIndex >= code.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const currentToken = code[currentTokenIndex];
    
    const timer = setTimeout(() => {
      if (currentCharIndex < currentToken.text.length) {
        setDisplayedTokens(prev => {
          const existing = [...prev];
          const tokenEntry = existing.find((_, i) => i === currentTokenIndex);
          if (tokenEntry) {
            tokenEntry.charIndex = currentCharIndex + 1;
          } else {
            existing.push({ token: currentToken, charIndex: currentCharIndex + 1 });
          }
          return existing;
        });
        setCurrentCharIndex(prev => prev + 1);
      } else {
        setCurrentTokenIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }, currentCharIndex === 0 && currentTokenIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [code, currentTokenIndex, currentCharIndex, speed, delay, onComplete]);

  return (
    <div className={`font-mono ${className}`}>
      <span className="inline">
        {displayedTokens.map((entry, i) => (
          <span key={i} className={tokenColors[entry.token.type]}>
            {entry.token.text.substring(0, entry.charIndex)}
          </span>
        ))}
        {showCursor && !isComplete && (
          <motion.span
            className="inline-block w-2 h-5 bg-cyan-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
      </span>
    </div>
  );
}

// Helper function to create code tokens easily
export function createCodeTokens(parts: Array<[string, CodeToken['type']]>): CodeToken[] {
  return parts.map(([text, type]) => ({ text, type }));
}
