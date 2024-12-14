import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const StatReveal = ({ children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.8,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98],
    }}
  >
    {children}
  </motion.div>
);

const Overview = ({ data }) => {
  const { Basic_Statistics: basicStats, Time_Comparisons: timeComparisons } =
    data;
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Slight delay before starting animations
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!showStats) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4">
      {/* Title */}
      <StatReveal delay={0}>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-16">
          Your year at a glance
        </h1>
      </StatReveal>

      {/* Books Read */}
      <StatReveal delay={1}>
        <div className="mb-16">
          <span className="text-6xl md:text-8xl font-bold text-white">
            {basicStats.total_books}
          </span>
          <p className="text-lg md:text-xl text-gray-400 mt-2">books read</p>
        </div>
      </StatReveal>

      {/* Pages */}
      <StatReveal delay={2.5}>
        <div className="mb-16">
          <span className="text-5xl md:text-7xl font-bold text-white">
            {basicStats.total_pages.toLocaleString()}
          </span>
          <p className="text-lg md:text-xl text-gray-400 mt-2">pages turned</p>
        </div>
      </StatReveal>

      {/* Time */}
      <StatReveal delay={4.4}>
        <div className="mb-16">
          <span className="text-5xl md:text-7xl font-bold text-white">
            {Math.round(basicStats.estimated_hours)}
          </span>
          <p className="text-lg md:text-xl text-gray-400 mt-2">
            approximate hours spent reading
          </p>
        </div>
      </StatReveal>
    </div>
  );
};

export default Overview;
