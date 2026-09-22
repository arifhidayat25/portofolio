"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Navigation } from "@/components/navigation";
import { CyberBackground } from "@/components/cyber-background";

const sections = [
  { id: "hero", component: HeroSection },
  { id: "about", component: AboutSection },
  { id: "skills", component: SkillsSection },
  { id: "projects", component: ProjectsSection },
  { id: "experience", component: ExperienceSection },
  { id: "contact", component: ContactSection },
];

const SLIDE_DURATION = 0.65;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const slideTransition = {
  type: "tween",
  ease: [0.77, 0, 0.175, 1] as [number, number, number, number],
  duration: SLIDE_DURATION,
};

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [direction, setDirection] = useState(0);
  const isAnimating = useRef(false);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSection = useCallback(
    (index: number) => {
      if (isAnimating.current || index === activeSection) return;
      if (index < 0 || index >= sections.length) return;

      setDirection(index > activeSection ? 1 : -1);
      setActiveSection(index);
      isAnimating.current = true;

      setTimeout(() => {
        isAnimating.current = false;
      }, SLIDE_DURATION * 1000 + 50);
    },
    [activeSection]
  );

  // Wheel / trackpad navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      wheelAccum.current += e.deltaY;

      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        wheelAccum.current = 0;
      }, 200);

      const THRESHOLD = 60;
      if (Math.abs(wheelAccum.current) >= THRESHOLD) {
        const dir = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        goToSection(activeSection + dir);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeSection, goToSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToSection(activeSection + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSection(activeSection - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeSection, goToSection]);

  // Touch swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        goToSection(activeSection + (delta > 0 ? 1 : -1));
      }
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeSection, goToSection]);

  const ActiveComponent = sections[activeSection].component;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-cyber-deep text-cyber-text selection:bg-cyber-primary/30 selection:text-white"
      style={{ touchAction: "none" }}
    >
      {/* Global Background */}
      <CyberBackground />

      {/* Top Navigation */}
      <Navigation currentSection={activeSection} onSectionChange={goToSection} />

      {/* Slide Dot Indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSection(i)}
            aria-label={`Go to section ${i + 1}`}
            className="relative flex items-center justify-center w-5 h-5 group"
          >
            <motion.span
              animate={{
                scale: i === activeSection ? 1 : 0.5,
                backgroundColor:
                  i === activeSection
                    ? "rgba(0,212,212,1)"
                    : "rgba(0,212,212,0.3)",
                boxShadow:
                  i === activeSection
                    ? "0 0 10px rgba(0,212,212,0.8)"
                    : "none",
              }}
              transition={{ duration: 0.3 }}
              className="block w-2 h-2 rounded-full"
            />
          </button>
        ))}
      </div>

      {/* Section Counter */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <span className="text-cyber-primary font-mono text-sm font-bold">
          {String(activeSection + 1).padStart(2, "0")}
        </span>
        <div className="w-16 h-px bg-cyber-text/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-cyber-primary"
            animate={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
        <span className="text-cyber-text/40 font-mono text-sm">
          {String(sections.length).padStart(2, "0")}
        </span>
      </div>

      {/* Slide Container */}
      <main className="w-full h-full relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeSection}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0 will-change-transform overflow-y-auto"
            style={{ scrollbarGutter: "stable" }}
          >
            <div className="min-h-full flex flex-col">
              {activeSection === 0 ? (
                <HeroSection onNavigate={goToSection} />
              ) : (
                <ActiveComponent />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
