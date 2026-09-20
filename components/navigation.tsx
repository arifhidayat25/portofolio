"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NavigationProps {
  currentSection: number;
  onSectionChange: (index: number) => void;
}

const navItems = [
  { id: 0, name: "Home" },
  { id: 1, name: "About" },
  { id: 2, name: "Skills" },
  { id: 3, name: "Case Studies" },
  { id: 4, name: "Experience" },
  { id: 5, name: "Contact" },
];

export function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`mx-auto flex items-center justify-between rounded-full transition-all duration-300 ${
          scrolled ? "glass px-6 py-3 max-w-4xl" : "px-0 max-w-full"
        }`}>
          
          {/* Logo */}
          <div className="font-heading font-bold text-xl text-cyber-text tracking-widest cursor-pointer" onClick={() => onSectionChange(0)}>
            AR<span className="text-cyber-primary">FID</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive ? "text-cyber-deep" : "text-cyber-text hover:text-cyber-primary"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-cyber-primary rounded-full -z-10 shadow-[0_0_15px_rgba(0,212,212,0.5)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-cyber-primary text-sm font-medium">
              {navItems[currentSection]?.name ?? "Home"}
            </span>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}