"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Linkedin, MapPin, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import profileData from "@/data/profile.json";
import { useState } from "react";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

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
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-cyber-text drop-shadow-[0_0_8px_rgba(0,212,212,0.3)] animate-flicker">GET IN TOUCH</h2>
            <p className="text-cyber-secondary font-mono text-sm tracking-widest mt-2">Open a support ticket 😄</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start max-w-6xl mx-auto pb-4">
          
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-cyber-green/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyber-green"></span>
              </span>
              <span className="font-mono text-cyber-green font-bold tracking-wider">SYSTEM ONLINE - READY FOR WORK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <ContactCard 
                icon={<Mail className="w-6 h-6" />}
                title="Email"
                value={profileData.social.email}
                href={`mailto:${profileData.social.email}`}
                delay={0.1}
              />
              <ContactCard 
                icon={<MessageSquare className="w-6 h-6" />}
                title="WhatsApp"
                value={profileData.social.whatsapp}
                href={`https://wa.me/${profileData.social.whatsapp.replace(/\D/g, '')}`}
                delay={0.2}
              />
              <ContactCard 
                icon={<Linkedin className="w-6 h-6" />}
                title="LinkedIn"
                value="linkedin.com/in/arifhidayat25"
                href={profileData.social.linkedin}
                delay={0.3}
              />
              <ContactCard 
                icon={<MapPin className="w-6 h-6" />}
                title="Location"
                value={profileData.social.location}
                href="#"
                delay={0.4}
              />
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-2xl flex flex-col gap-4 border-t-4 border-t-cyber-primary">
              <div className="flex items-center gap-2 mb-4 border-b border-cyber-primary/20 pb-4">
                <div className="w-3 h-3 rounded-full bg-cyber-amber animate-pulse" />
                <h3 className="font-mono text-cyber-text font-bold">CREATE_NEW_TICKET</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-cyber-secondary uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    required
                    className="bg-cyber-panel border border-cyber-primary/30 rounded-lg px-4 py-3 text-cyber-text focus:outline-none focus:border-cyber-primary focus:shadow-[0_0_10px_rgba(0,212,212,0.3)] transition-all font-sans"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-cyber-secondary uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    required
                    className="bg-cyber-panel border border-cyber-primary/30 rounded-lg px-4 py-3 text-cyber-text focus:outline-none focus:border-cyber-primary focus:shadow-[0_0_10px_rgba(0,212,212,0.3)] transition-all font-sans"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-cyber-secondary uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  required
                  className="bg-cyber-panel border border-cyber-primary/30 rounded-lg px-4 py-3 text-cyber-text focus:outline-none focus:border-cyber-primary focus:shadow-[0_0_10px_rgba(0,212,212,0.3)] transition-all font-sans"
                  placeholder="Issue description..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-cyber-secondary uppercase tracking-wider">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="bg-cyber-panel border border-cyber-primary/30 rounded-lg px-4 py-3 text-cyber-text focus:outline-none focus:border-cyber-primary focus:shadow-[0_0_10px_rgba(0,212,212,0.3)] transition-all font-sans resize-none"
                  placeholder="Please describe the issue in detail..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                className="mt-4 w-full bg-gradient-to-r from-cyber-secondary to-cyber-primary text-cyber-deep font-bold font-heading py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(0,212,212,0.5)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-cyber-deep border-t-transparent rounded-full animate-spin" />
                    PROCESSING...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-2 text-cyber-deep">
                    <CheckCircle2 className="w-5 h-5" />
                    TICKET SUBMITTED
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    SUBMIT TICKET
                  </>
                )}
              </button>
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, title, value, href, delay }: { icon: React.ReactNode, title: string, value: string, href: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Link 
        href={href}
        target={href.startsWith('http') ? "_blank" : undefined}
        className="glass-panel p-4 md:p-5 rounded-xl flex items-center gap-4 hover-glow-cyber group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-cyber-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
        
        <div className="w-12 h-12 rounded-lg bg-cyber-panel border border-cyber-primary/20 flex items-center justify-center text-cyber-primary group-hover:scale-110 group-hover:bg-cyber-primary group-hover:text-cyber-deep transition-all duration-300 relative z-10">
          {icon}
        </div>
        
        <div className="relative z-10">
          <h4 className="text-xs font-mono text-cyber-secondary uppercase tracking-widest mb-1">{title}</h4>
          <p className="text-sm md:text-base font-bold text-cyber-text">{value}</p>
        </div>
      </Link>
    </motion.div>
  );
}