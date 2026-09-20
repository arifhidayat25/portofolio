'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface InteractiveAvatarProps {
  mousePosition: { x: number; y: number };
}

export function InteractiveAvatar({ mousePosition }: InteractiveAvatarProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Calculate parallax offset based on mouse position
  const parallaxX = windowSize.width ? (mousePosition.x - windowSize.width / 2) * 0.02 : 0;
  const parallaxY = windowSize.height ? (mousePosition.y - windowSize.height / 2) * 0.02 : 0;

  return (
    <div className="relative">
      {/* Main Avatar Container */}
      <motion.div
        className="relative w-80 h-80 md:w-96 md:h-96"
        animate={{
          x: parallaxX,
          y: parallaxY,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Breathing/Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/30 via-blue-400/30 to-teal-400/30 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Avatar Image/Illustration */}
        <motion.div
          className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
          whileHover={{ 
            scale: 1.05,
            rotate: 2,
            borderColor: "rgba(255,255,255,0.4)"
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{ 
    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    type: "spring",
    stiffness: 300
  }}
        >
          {/* Placeholder Avatar - Replace with actual image */}
          <div className="w-full h-full bg-gradient-to-br from-violet-500 via-blue-500 to-teal-500 flex items-center justify-center">
            <motion.div
              className="text-8xl md:text-9xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              👨‍💻
            </motion.div>
          </div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
        </motion.div>

        {/* Floating Elements Around Avatar */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            y: [-5, 5, -5],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ⚡
        </motion.div>

        <motion.div
          className="absolute -bottom-4 -left-4 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            x: [-3, 3, -3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🎨
        </motion.div>

        <motion.div
          className="absolute top-1/4 -left-8 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            y: [0, -10, 0],
            x: [-2, 2, -2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          💡
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-8 w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            rotate: [0, -180, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🚀
        </motion.div>
      </motion.div>

      {/* Orbiting Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { emoji: '💻', radius: 120, duration: 15, delay: 0 },
          { emoji: '🎯', radius: 140, duration: 18, delay: 5 },
          { emoji: '✨', radius: 100, duration: 12, delay: 10 },
        ].map((orbit, index) => (
          <motion.div
            key={index}
            className="absolute w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: -16,
              marginTop: -16,
            }}
            animate={{
              rotate: [0, 360],
              x: [
                Math.cos(0) * orbit.radius,
                Math.cos(Math.PI / 2) * orbit.radius,
                Math.cos(Math.PI) * orbit.radius,
                Math.cos((3 * Math.PI) / 2) * orbit.radius,
                Math.cos(2 * Math.PI) * orbit.radius,
              ],
              y: [
                Math.sin(0) * orbit.radius,
                Math.sin(Math.PI / 2) * orbit.radius,
                Math.sin(Math.PI) * orbit.radius,
                Math.sin((3 * Math.PI) / 2) * orbit.radius,
                Math.sin(2 * Math.PI) * orbit.radius,
              ],
            }}
            transition={{
              duration: orbit.duration,
              repeat: Infinity,
              ease: "linear",
              delay: orbit.delay,
            }}
          >
            <span className="text-sm">{orbit.emoji}</span>
          </motion.div>
        ))}
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, rgba(29, 78, 216, 0.1) 50%, rgba(15, 118, 110, 0.1) 100%)`,
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}