"use client";

import { motion } from "framer-motion";
import profileData from "@/data/profile.json";
import { useEffect, useState } from "react";

export function AboutSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-20">
      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
        
        {/* Section Header */}
        <motion.div 
          className="mb-8 md:mb-12 flex justify-center w-full"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-cyber-secondary font-mono text-sm tracking-widest uppercase">// ABOUT_ME</span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-cyber-text drop-shadow-[0_0_8px_rgba(0,212,212,0.3)]">Who Am I?</h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-4">
          
          {/* LEFT: Hexagon Profile (4 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-4 flex flex-col items-center relative"
          >
            <div className="relative w-[200px] h-[200px] md:w-[280px] md:h-[280px] mb-6">
              {/* Outer Animated Border */}
              <motion.div 
                className="absolute inset-0 border-2 border-cyber-primary/50"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Glowing Border */}
              <div 
                className="absolute inset-2 bg-cyber-primary shadow-[0_0_20px_rgba(0,212,212,0.4)]"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              />

              {/* Image Container */}
              <div 
                className="absolute inset-[10px] bg-cyber-panel overflow-hidden"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                <img 
                  src="/photo.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover object-top mix-blend-normal hover:mix-blend-luminosity transition-all duration-500"
                />
              </div>
              
              {/* Online Badge */}
              <motion.div 
                className="absolute bottom-4 right-0 glass-panel px-3 py-1 rounded-full border border-cyber-green/30 flex items-center gap-2 z-20"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                <span className="text-xs font-mono text-cyber-text">ONLINE</span>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: Bio & Stats (8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card p-6 border-l-4 border-l-cyber-primary"
            >
              <p className="text-lg text-cyber-text/80 leading-relaxed font-sans">
                {profileData.description}
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {profileData.stats.map((stat, i) => (
                <StatCard key={stat.label} label={stat.label} target={stat.value} suffix={stat.suffix} delay={0.1 * (i + 1)} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, target, suffix, delay }: { label: string; target: number; suffix: string; delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(easeOutQuart * target));

      if (percentage < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => requestAnimationFrame(animateCount), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`stat-${label.replace(/\s+/g, '-')}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [target, delay, label]);

  return (
    <motion.div
      id={`stat-${label.replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center border-t-2 border-t-cyber-primary/50 hover-glow-cyber text-center"
    >
      <div className="text-3xl font-black text-cyber-primary font-heading mb-1 drop-shadow-[0_0_8px_rgba(0,212,212,0.4)]">
        {count}{suffix}
      </div>
      <div className="text-xs text-cyber-text/60 font-medium uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}
