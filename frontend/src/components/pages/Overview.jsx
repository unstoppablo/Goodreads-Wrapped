import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8, // Reduced stagger time between items
      delayChildren: 0.3, // Slight initial delay
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5, // Slightly faster duration for each item
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Separate variants for numbers to add emphasis
const numberVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const StatItem = ({ number, label }) => (
  <motion.div variants={itemVariants} className="mb-16">
    <motion.span
      className="text-6xl md:text-8xl font-bold text-white block"
      variants={numberVariants}
    >
      {number}
    </motion.span>
    <motion.p
      className="text-lg md:text-xl text-gray-400 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {label}
    </motion.p>
  </motion.div>
);

const Overview = ({ data, onPageComplete }) => {
  const { Basic_Statistics: basicStats } = data;
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Trigger page complete after animations are done
  useEffect(() => {
    if (showStats && onPageComplete) {
      // Add a slight delay to ensure all animations are complete
      const completeTimer = setTimeout(() => {
        onPageComplete();
      }, 5000); // 5 seconds after stats are shown to allow for full animation

      return () => clearTimeout(completeTimer);
    }
  }, [showStats, onPageComplete]);

  if (!showStats) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Your year at a glance
          </h1>
        </motion.div>

        {/* Books Read */}
        <StatItem number={basicStats.total_books} label="books read" />

        {/* Pages */}
        <StatItem
          number={basicStats.total_pages.toLocaleString()}
          label="pages turned"
        />

        {/* Time */}
        <StatItem
          number={Math.round(basicStats.estimated_hours)}
          label="approximate hours spent reading"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Overview;
