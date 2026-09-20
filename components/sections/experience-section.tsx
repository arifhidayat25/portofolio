"use client";

import { motion } from "framer-motion";
import profileData from "@/data/profile.json";
import { Server, Network, Headset, GraduationCap, CheckCircle } from "lucide-react";

export function ExperienceSection() {
  const icons = {
    Server: <Server className="w-5 h-5" />,
    Network: <Network className="w-5 h-5" />,
    Headset: <Headset className="w-5 h-5" />,
    GraduationCap: <GraduationCap className="w-5 h-5" />,
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-28 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-5xl">
        
        {/* Section Header */}
        <motion.div 
          className="mb-8 md:mb-12 flex justify-center w-full"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-cyber-secondary font-mono text-sm tracking-widest uppercase">// TIMELINE</span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-cyber-text drop-shadow-[0_0_8px_rgba(0,212,212,0.3)]">INCIDENT LOG</h2>
            <div className="h-1 w-24 bg-cyber-primary shadow-[0_0_10px_rgba(0,212,212,0.8)] rounded-full mt-2"></div>
            <p className="text-cyber-text/60 mt-2 font-mono text-xs md:text-sm">Record of professional milestones and resolved issues.</p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative pb-8">
          {/* Main vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-cyber-primary/20 md:-translate-x-1/2" />
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-cyber-primary md:-translate-x-1/2 shadow-[0_0_10px_rgba(0,212,212,0.8)]" 
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
          />

          <div className="space-y-8 md:space-y-12 pt-4">
            {profileData.journey.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={item.hash}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative flex items-center md:justify-between flex-col md:flex-row gap-8 md:gap-0"
                >
                  {/* Left Side (Empty for odd, Content for even on desktop) */}
                  <div className={`w-full md:w-5/12 pl-24 md:pl-0 ${!isEven ? 'md:order-1' : ''} ${isEven ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className="glass-card p-6 rounded-2xl hover-glow-cyber transition-all duration-300 group border-l-4 md:border-l-0 md:border-t-4 border-cyber-primary">
                      <div className={`flex items-center gap-3 mb-4 justify-start ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-1 bg-cyber-green/20 text-cyber-green border border-cyber-green/30 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          RESOLVED
                        </span>
                        <span className="text-cyber-primary font-mono font-bold">{item.date}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-cyber-text font-heading mb-2 group-hover:text-cyber-primary transition-colors">{item.title}</h3>
                      <p className="text-cyber-text/70 text-sm leading-relaxed font-sans">{item.description}</p>
                      
                      <div className={`mt-4 flex flex-wrap gap-2 justify-start ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                         <span className="text-xs font-mono text-cyber-secondary opacity-50 bg-cyber-secondary/10 px-2 py-1 rounded">ID: {item.hash.substring(0,8)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Node */}
                  <motion.div 
                    className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-cyber-primary bg-cyber-deep flex items-center justify-center shadow-[0_0_15px_rgba(0,212,212,0.5)] z-10 text-cyber-primary group-hover:scale-110 transition-transform`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    {icons[item.icon as keyof typeof icons] || <Server className="w-5 h-5" />}
                  </motion.div>

                  {/* Right Side (Empty for even, Content for odd on desktop) */}
                  <div className="hidden md:block w-5/12"></div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
