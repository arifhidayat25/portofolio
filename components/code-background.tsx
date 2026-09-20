'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CodeBackgroundProps {
  density?: number;
  speed?: number;
  opacity?: number;
}

const codeChars = [
  '{', '}', '(', ')', '[', ']', '<', '>', '/', '\\',
  ';', ':', '=', '+', '-', '*', '&', '|', '!', '?',
  '0', '1', 'const', 'let', 'var', 'fn', '=>', '&&',
  'if', 'else', 'return', 'true', 'false', 'null',
  '0x', '{}', '[]', '//', '/*', '*/', 'async', 'await'
];

interface CodeColumn {
  id: number;
  x: number;
  chars: string[];
  speed: number;
  delay: number;
  opacity: number;
}

export function CodeBackground({ 
  density = 20, 
  speed = 15,
  opacity = 0.15 
}: CodeBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const columns = useMemo<CodeColumn[]>(() => {
    if (!mounted) return [];
    
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      x: (i / density) * 100 + Math.random() * 5,
      chars: Array.from({ length: 10 + Math.floor(Math.random() * 10) }, () => 
        codeChars[Math.floor(Math.random() * codeChars.length)]
      ),
      speed: speed + Math.random() * 10,
      delay: Math.random() * 10,
      opacity: opacity * (0.5 + Math.random() * 0.5)
    }));
  }, [density, speed, opacity, mounted]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute font-mono text-xs text-cyan-500/20 whitespace-nowrap"
          style={{
            left: `${column.x}%`,
            opacity: column.opacity,
          }}
          initial={{ y: '-100%' }}
          animate={{ y: '100vh' }}
          transition={{
            duration: column.speed,
            repeat: Infinity,
            delay: column.delay,
            ease: 'linear',
          }}
        >
          {column.chars.map((char, i) => (
            <div 
              key={i} 
              className="leading-6"
              style={{
                color: i === 0 ? 'hsl(var(--cyan))' : undefined,
                opacity: 1 - (i / column.chars.length) * 0.7
              }}
            >
              {char}
            </div>
          ))}
        </motion.div>
      ))}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
    </div>
  );
}
