'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import testimonialsData from '@/data/testimonials.json';

interface TestimonialsSectionProps {
  onNext: () => void;
}

const testimonials = testimonialsData.testimonials;

export function TestimonialsSection({ onNext }: TestimonialsSectionProps) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(139, 69, 19, 0.05), rgba(29, 78, 216, 0.05))',
            'linear-gradient(45deg, rgba(29, 78, 216, 0.05), rgba(15, 118, 110, 0.05))',
            'linear-gradient(45deg, rgba(15, 118, 110, 0.05), rgba(139, 69, 19, 0.05))',
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
            Ulasan Klien
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Apa yang dikatakan klien tentang bekerja dengan saya
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="relative"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: "spring",
                bounce: 0.4 
              }}
            >
              <motion.div
                className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 sm:p-8 h-full relative overflow-hidden"
                whileHover={{ 
                  scale: 1.02, 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)" 
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Quote Icon */}
                <motion.div
                  className="absolute top-4 right-4 opacity-20"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={inView ? { rotate: 0, scale: 1 } : {}}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <Quote className="w-8 h-8" />
                </motion.div>

                {/* Rating */}
                <motion.div
                  className="flex gap-1 mb-4"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.2 + 0.3 }}
                >
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <motion.div
                      key={starIndex}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={inView ? { scale: 1, rotate: 0 } : {}}
                      transition={{ 
                        delay: index * 0.2 + 0.4 + starIndex * 0.1,
                        type: "spring",
                        bounce: 0.6
                      }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Content */}
                <motion.p
                  className="text-muted-foreground mb-6 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2 + 0.6 }}
                >
                  "{testimonial.content}"
                </motion.p>

                {/* Author */}
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.2 + 0.8 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-primary font-medium mt-1">{testimonial.project}</p>
                  </div>
                </motion.div>

                {/* Hover effect glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-teal-500/10 opacity-0 rounded-2xl"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Floating review cards animation */}
        <motion.div
          className="absolute top-1/4 left-10 w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-8 h-8 text-yellow-400" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-10 w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center"
          animate={{
            y: [20, -20, 20],
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Quote className="w-6 h-6 text-blue-400" />
        </motion.div>

        {/* Next button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.button
            onClick={onNext}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Hubungi Saya
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}