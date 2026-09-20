"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GlacierBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1, // 1-5px
    x: Math.random() * 100, // 0-100vw
    y: Math.random() * 100, // 0-100vh
    duration: Math.random() * 20 + 15, // 15-35s
    delay: Math.random() * -20, // Negative delay to start at different points
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-glacier-deep">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-glacier-gradient opacity-80" />

      {/* Floating Ice Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-glacier-arctic"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}vw`,
            top: `${particle.y}vh`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(240, 249, 255, 0.8)`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            y: ["0vh", "-100vh"],
            x: ["0vw", `${Math.random() * 10 - 5}vw`],
            opacity: [0, Math.random() * 0.5 + 0.2, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Subtle Aurora Glow in Background */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-glacier-ice/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-pulse-glow" />

      {/* Mountain Silhouette Bottom */}
      <div className="absolute bottom-0 w-full h-[30vh] opacity-30">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full fill-glacier-steel"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,240C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path d="M0,256L60,240C120,224,240,192,360,197.3C480,203,600,245,720,250.7C840,256,960,224,1080,213.3C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" className="fill-glacier-navy opacity-50" />
          <path d="M0,128L80,149.3C160,171,320,213,480,202.7C640,192,800,128,960,117.3C1120,107,1280,149,1360,170.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" className="fill-glacier-deep opacity-30" />
        </svg>
      </div>
    </div>
  );
}
