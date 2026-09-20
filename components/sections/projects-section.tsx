"use client";

import { motion } from "framer-motion";
import projectsData from "@/data/projects.json";
import { Server, Shield, Headset, Network, Database, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";

const iconMap: Record<string, any> = {
  "Infrastructure": Server,
  "System Admin": Shield,
  "Service Desk": Headset,
  "Virtualization": Database,
  "Security": Lock
};

export function ProjectsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        const isAtLeft = container.scrollLeft === 0;
        const isAtRight = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;

        if ((e.deltaY < 0 && isAtLeft) || (e.deltaY > 0 && isAtRight)) {
          return;
        }

        e.preventDefault();
        container.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 450 : 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-28 overflow-hidden">
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
            <span className="text-cyber-secondary font-mono text-sm tracking-widest uppercase">// PROJECTS</span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-cyber-text drop-shadow-[0_0_8px_rgba(0,212,212,0.3)] text-center">CASE STUDIES</h2>
            <div className="h-1 w-24 bg-cyber-primary shadow-[0_0_10px_rgba(0,212,212,0.8)] rounded-full mt-2"></div>
          </div>
        </motion.div>

        {/* Horizontal Scroll Area Wrapper */}
        <div className="relative group/slider w-full">
          
          {/* Scroll Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-20 w-12 h-12 rounded-full border border-cyber-primary/50 bg-cyber-deep/80 backdrop-blur-sm flex items-center justify-center text-cyber-primary opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-cyber-primary hover:text-cyber-deep hover:scale-110 hover:shadow-[0_0_20px_rgba(0,212,212,0.6)] disabled:opacity-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-20 w-12 h-12 rounded-full border border-cyber-primary/50 bg-cyber-deep/80 backdrop-blur-sm flex items-center justify-center text-cyber-primary opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-cyber-primary hover:text-cyber-deep hover:scale-110 hover:shadow-[0_0_20px_rgba(0,212,212,0.6)] disabled:opacity-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto pb-8 pt-4 px-4 -mx-4 flex gap-6 md:gap-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none' }}
          >
            {projectsData.projects.map((project: any, index: number) => {
              const Icon = iconMap[project.language] || Network;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="snap-center min-w-[320px] md:min-w-[400px] lg:min-w-[450px] max-w-[500px]"
                >
                  <div className="glass-card h-full flex flex-col p-6 rounded-2xl group border-t-2 border-t-cyber-primary/30 hover-glow-cyber relative overflow-hidden transition-all duration-300 hover:-translate-y-2">
                    
                    {/* Status Badge & Icon */}
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-cyber-panel border border-cyber-primary/30 flex items-center justify-center text-cyber-primary group-hover:scale-110 group-hover:bg-cyber-primary group-hover:text-cyber-deep transition-all duration-300 shadow-[0_0_15px_rgba(0,212,212,0.1)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest ${
                        project.status === "COMPLETED" 
                          ? "bg-cyber-green/20 text-cyber-green border border-cyber-green/30" 
                          : "bg-cyber-amber/20 text-cyber-amber border border-cyber-amber/30"
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-grow relative z-10">
                      <h3 className="text-xl md:text-2xl font-bold font-heading text-cyber-text mb-3 group-hover:text-cyber-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-cyber-text/70 text-sm md:text-base leading-relaxed mb-6 font-sans">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                      {project.technologies.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="px-3 py-1 text-xs font-mono rounded-md bg-cyber-primary/10 text-cyber-secondary border border-cyber-primary/20">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Metrics Bottom Row */}
                    <div className="mt-auto pt-4 border-t border-cyber-primary/20 flex items-center justify-between relative z-10">
                      {Object.entries(project.metrics || {}).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-cyber-text/50 uppercase tracking-wider font-mono">{key}</span>
                          <span className="text-sm font-bold text-cyber-text">{value as string}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Subtle Background Icon */}
                    <Icon className="absolute -bottom-10 -right-10 w-48 h-48 text-cyber-primary opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}