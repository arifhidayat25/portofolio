"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import profileData from "@/data/profile.json";

export function HeroSection({ onNavigate }: { onNavigate?: (index: number) => void }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
          
          {/* LEFT SIDE - Text Content (60%) */}
          <motion.div 
            className="w-full lg:w-3/5 flex flex-col items-start text-left"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={item} className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span className="text-cyber-green text-sm font-mono font-semibold tracking-widest uppercase">
                Available for Work
              </span>
            </motion.div>

            <motion.h1 
              variants={item}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-cyber-primary tracking-widest mb-2 md:mb-4 leading-[1] drop-shadow-[0_0_15px_rgba(0,212,212,0.5)] animate-flicker"
            >
              {profileData.name}
            </motion.h1>

            <motion.h2 
              variants={item}
              className="text-xl md:text-3xl font-bold mb-6 font-heading tracking-wide text-gradient-cyber"
            >
              {profileData.roles[0]}
            </motion.h2>

            <motion.p 
              variants={item}
              className="text-cyber-text/70 max-w-xl text-lg mb-10 leading-relaxed font-sans"
            >
              {profileData.description}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-12">
              <button 
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-cyber-primary text-cyber-primary rounded-full font-heading tracking-wider font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,212,212,0.4)]"
              >
                <span className="relative z-10 group-hover:text-cyber-deep transition-colors duration-300">View Work</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-all group-hover:text-cyber-deep duration-300" />
                <div className="absolute inset-0 bg-cyber-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
              </button>

              <a 
                href="/resume-data+IT.pdf"
                download
                className="group inline-flex items-center gap-2 px-8 py-4 bg-cyber-primary text-cyber-deep hover:bg-cyber-secondary rounded-full font-heading tracking-wider font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(103,232,249,0.5)]"
              >
                <span>Download CV</span>
              </a>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-6">
              <SocialLink href={profileData.social.github} icon={<Github className="w-5 h-5" />} />
              <SocialLink href={profileData.social.linkedin} icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href={`mailto:${profileData.social.email}`} icon={<Mail className="w-5 h-5" />} />
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Hexagon Photo & Cyber Elements (40%) */}
          <motion.div 
            className="w-full lg:w-2/5 h-[40vh] md:h-[50vh] lg:h-[60vh] relative flex items-center justify-center mt-4 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Hexagon Frame with Photo */}
            <div className="relative z-10 w-[250px] h-[250px] md:w-[350px] md:h-[350px]">
              <div className="absolute inset-0 bg-cyber-primary blur-[40px] opacity-30 rounded-full animate-pulse-glow" />
              <div className="relative w-full h-full p-2" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <div className="w-full h-full bg-cyber-panel flex items-center justify-center overflow-hidden relative group" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <img 
                    src="/photo.png" 
                    alt={profileData.name}
                    className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110 filter brightness-110 contrast-125 mix-blend-normal group-hover:mix-blend-luminosity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-cyber-text/40 text-sm font-mono text-center px-4 bg-cyber-dark">
                    <span>Upload photo.png</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Terminal - hidden on mobile to avoid overlap */}
            <div className="hidden md:block">
              <FloatingTerminal />
            </div>

            {/* Floating Tech Badges - hidden on mobile to avoid overflow */}
            <FloatingBadge 
              text="Windows Server" 
              className="top-[10%] left-0 md:-left-10" 
              delay={0}
              icon="⊞"
            />
            <FloatingBadge 
              text="Linux" 
              className="bottom-[25%] left-0 md:-left-12" 
              delay={1}
              icon="🐧"
            />
            <FloatingBadge 
              text="CISCO" 
              className="top-[25%] right-0 md:-right-12" 
              delay={2}
              icon="📡"
            />
            <FloatingBadge 
              text="Active Directory" 
              className="bottom-[10%] right-0 md:-right-8" 
              delay={3}
              icon="🛡️"
            />
          </motion.div>

        </div>
        

      </div>
    </section>
  );
}


function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-white/5 hover:bg-cyber-primary/20 border border-white/5 hover:border-cyber-primary/50 rounded-lg text-cyber-text hover:text-cyber-primary transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(0,212,212,0.4)]"
    >
      {icon}
    </Link>
  );
}

function FloatingBadge({ text, className, delay, icon }: { text: string; className: string; delay: number; icon: string }) {
  return (
    <motion.div
      className={`absolute ${className} z-20 glass-panel px-3 py-1.5 md:px-4 md:py-2 border-cyber-primary/30 rounded-md hidden md:flex items-center gap-2 shadow-[0_0_10px_rgba(0,212,212,0.1)]`}
      animate={{
        y: ["0px", "-15px", "0px"],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      <span className="text-cyber-primary text-lg">{icon}</span>
      <span className="text-xs md:text-sm font-mono text-cyber-text tracking-wide whitespace-nowrap">{text}</span>
    </motion.div>
  );
}

function FloatingTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const fullLines = [
    "> ping google.com ... OK [11ms]",
    "> ipconfig /all ... DONE",
    "> net user /domain ... ACTIVE",
    "> systemctl status sshd ... RUNNING"
  ];

  useEffect(() => {
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < fullLines.length) {
        setLines(prev => [...prev, fullLines[currentLine]]);
        currentLine++;
      } else {
        setLines([]);
        currentLine = 0;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="absolute -bottom-4 md:bottom-0 left-1/2 -translate-x-1/2 md:-left-16 md:translate-x-0 w-[280px] z-30 bg-[#0a0a12]/90 backdrop-blur-md rounded-lg border border-cyber-primary/30 shadow-[0_0_20px_rgba(0,212,212,0.2)] overflow-hidden"
      animate={{ y: ["0px", "-10px", "0px"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-black/50 border-b border-cyber-primary/20">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-[10px] font-mono text-cyber-text/50">admin@arfid-sys:~</span>
      </div>
      
      {/* Terminal Body */}
      <div className="p-3 font-mono text-xs text-cyber-green h-[100px] flex flex-col justify-end">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-1"
          >
            {line}
          </motion.div>
        ))}
        <div className="flex items-center">
          <span>{">"}</span>
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="w-2 h-3 bg-cyber-green ml-1 inline-block"
          />
        </div>
      </div>
    </motion.div>
  );
}