"use client";

import { motion } from "framer-motion";
import skillsData from "@/data/skills.json";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

export function SkillsSection() {
  const allSkills = skillsData.categories.flatMap((cat) => cat.skills);
  const overviews = skillsData.overview;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-28 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="mb-8 md:mb-12 flex justify-center w-full"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-cyber-text drop-shadow-[0_0_8px_rgba(0,212,212,0.3)]">EXPERTISE</h2>
            <div className="h-1 w-32 bg-cyber-primary shadow-[0_0_10px_rgba(0,212,212,0.8)] rounded-full"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center allow-scroll max-h-[70vh] md:max-h-none overflow-y-auto hide-scrollbar pb-10 md:pb-0">
          
          {/* LEFT: Hexagon Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="flex flex-wrap justify-center gap-3 max-w-[450px]">
              {allSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05, type: "spring" }}
                  viewport={{ once: true }}
                  className="group relative w-24 h-28 flex items-center justify-center"
                >
                  {/* Hexagon Shape */}
                  <div 
                    className="absolute inset-0 bg-cyber-panel border border-cyber-primary/30 transition-all duration-300 group-hover:bg-cyber-primary/10 group-hover:border-cyber-primary group-hover:shadow-[0_0_15px_rgba(0,212,212,0.5)]"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  />
                  
                  {/* Inner Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
                    <span className="font-heading font-bold text-lg text-cyber-primary mb-1">{skill.name.charAt(0)}</span>
                    <span className="text-[10px] md:text-xs font-mono text-cyber-text font-semibold leading-tight">{skill.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Progress Bars */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {overviews.map((item, index) => (
              <ProgressBar key={item.name} item={item} delay={index * 0.2} />
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ item, delay }: { item: any, delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setWidth(item.level), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById(`bar-${item.name.replace(/\s+/g, '-')}`);
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [item.level, delay, item.name]);

  return (
    <div id={`bar-${item.name.replace(/\s+/g, '-')}`} className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-cyber-text font-medium text-sm md:text-base">{item.name}</span>
        <span className="text-cyber-primary font-mono text-sm">{item.level}%</span>
      </div>
      
      {/* Track */}
      <div className="h-3 w-full bg-cyber-dark rounded-full overflow-hidden border border-cyber-primary/20 p-[2px]">
        {/* Fill */}
        <div 
          className="h-full rounded-full bg-gradient-to-r from-cyber-secondary to-cyber-primary shadow-[0_0_10px_rgba(0,212,212,0.8)] transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ width: `${width}%` }}
        >
          {/* Animated Highlight overlay */}
          <div className="absolute inset-0 w-[50px] bg-white/30 -skew-x-12 animate-[slideRight_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}