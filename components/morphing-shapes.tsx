'use client';

import { motion } from 'framer-motion';

interface MorphingShapesProps {
  mousePosition: { x: number; y: number };
}

export function MorphingShapes({ mousePosition }: MorphingShapesProps) {
  const shapes = [
    { id: 1, size: 400, color: 'bg-violet-500/15', blur: 'blur-3xl' },
    { id: 2, size: 300, color: 'bg-blue-500/15', blur: 'blur-2xl' },
    { id: 3, size: 350, color: 'bg-teal-500/15', blur: 'blur-3xl' },
    { id: 4, size: 200, color: 'bg-pink-500/10', blur: 'blur-xl' },
  ];

  return (
    <div className="absolute inset-0 -z-10">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full ${shape.color} ${shape.blur}`}
          style={{
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            x: mousePosition.x * (0.05 + shape.id * 0.02) + shape.id * 150,
            y: mousePosition.y * (0.05 + shape.id * 0.02) + shape.id * 80,
            scale: [1, 1.3, 0.8, 1],
            rotate: [0, 90, 180, 270, 360],
            borderRadius: [
              "50%",
              "40% 60% 70% 30%",
              "60% 40% 30% 70%",
              "30% 70% 60% 40%",
              "50%"
            ],
          }}
          transition={{
            x: { type: "spring", stiffness: 30, damping: 15 },
            y: { type: "spring", stiffness: 30, damping: 15 },
            scale: { duration: 8 + shape.id, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 25 + shape.id * 5, repeat: Infinity, ease: "linear" },
            borderRadius: { duration: 10 + shape.id * 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
    </div>
  );
}