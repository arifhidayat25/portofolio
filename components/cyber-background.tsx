"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CyberBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random particles for the network
  const particles = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1, // 1-4px
    x: Math.random() * 100, // 0-100vw
    y: Math.random() * 100, // 0-100vh
    duration: Math.random() * 20 + 20, // 20-40s
    delay: Math.random() * -20, // Negative delay to start at different points
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-cyber-deep">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-cyber-gradient opacity-100" />
      
      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 212, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 212, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Scanline Effect */}
      <motion.div 
        className="absolute inset-0 w-full h-[2px] bg-cyber-primary/20 shadow-[0_0_10px_rgba(0,212,212,0.5)]"
        animate={{
          top: ["-5%", "105%"]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Network Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyber-primary"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}vw`,
            top: `${particle.y}vh`,
            boxShadow: `0 0 ${particle.size * 3}px rgba(0, 212, 212, 0.8)`,
            opacity: Math.random() * 0.4 + 0.1,
          }}
          animate={{
            y: ["0vh", `${Math.random() > 0.5 ? '-' : ''}15vh`],
            x: ["0vw", `${Math.random() > 0.5 ? '-' : ''}10vw`],
            opacity: [0.1, Math.random() * 0.6 + 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
            repeatType: "reverse"
          }}
        />
      ))}

      {/* Subtle Center Glow */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-primary/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none animate-pulse-glow" />
    </div>
  );
}
