"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Navigation } from "@/components/navigation";
import { CyberBackground } from "@/components/cyber-background";

const sectionIds = ["hero", "about", "skills", "projects", "experience", "contact"];

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);

  // Track active section based on scroll position
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(index);
            }
          });
        },
        {
          // Trigger when the section crosses the top 30% of viewport
          rootMargin: "-30% 0px -60% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (index: number) => {
    const el = document.getElementById(sectionIds[index]);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-cyber-deep text-cyber-text selection:bg-cyber-primary/30 selection:text-white">
      {/* Global Background */}
      <CyberBackground />

      {/* Top Navigation */}
      <Navigation currentSection={activeSection} onSectionChange={scrollToSection} />

      {/* Main Content — normal scroll */}
      <main>
        <section id="hero">
          <HeroSection onNavigate={scrollToSection} />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="skills">
          <SkillsSection />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="experience">
          <ExperienceSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
    </div>
  );
}
