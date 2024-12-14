import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingAnimation from "../animations/FloatingAnimation";
const readingTimeDistribution = {
  99: 500,
  95: 350,
  90: 250,
  80: 200,
  70: 150,
  50: 100,
  30: 75,
  20: 50,
  10: 25,
};

function calculatePercentile(hours) {
  const sortedPercentiles = Object.entries(readingTimeDistribution).sort(
    (a, b) => parseInt(b[0]) - parseInt(a[0])
  );

  for (const [percentile, threshold] of sortedPercentiles) {
    if (hours >= threshold) {
      return parseInt(percentile);
    }
  }
  return 1;
}

const ReadingPercentile = ({ data }) => {
  const [stage, setStage] = useState(0);
  const hours = Math.round(data.Basic_Statistics.estimated_hours);
  const percentile = calculatePercentile(hours);

  const formatNumber = (num) => {
    return num >= 1000 ? num.toLocaleString() : num;
  };

  // Progress to books animation after showing hours
  useEffect(() => {
    if (stage === 0) {
      const timer = setTimeout(() => setStage(1), 2000);
      return () => clearTimeout(timer);
    }
    if (stage === 1) {
      const timer = setTimeout(() => setStage(2), 8000); // Duration of one animation cycle
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="hours"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400"
            >
              You spent
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-7xl md:text-8xl font-bold"
            >
              {formatNumber(hours)}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400"
            >
              hours reading!
            </motion.div>
          </motion.div>
        )}

        {stage === 1 && (
          <div className="absolute inset-0">
            <FloatingAnimation
              emoji="📚"
              count={400}
              duration={{ min: 1, max: 2 }}
              delay={{ max: 2 }}
              cycleLength={8000}
              size="text-3xl"
            />
          </div>
        )}

        {stage === 2 && (
          <motion.div
            key="percentile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <motion.div
              className="text-2xl md:text-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              That's more than {percentile}% of readers 🤯
            </motion.div>

            <motion.div
              className="text-lg text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              That's what we call a page-turner!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingPercentile;
