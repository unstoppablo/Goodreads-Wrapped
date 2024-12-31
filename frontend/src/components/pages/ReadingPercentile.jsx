import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const ReadingPercentile = ({ data, onPageComplete }) => {
  const [stage, setStage] = useState(0);
  const hours = Math.round(data.Basic_Statistics.estimated_hours);
  const percentile = calculatePercentile(hours);

  const formatNumber = (num) => {
    return num >= 1000 ? num.toLocaleString() : num;
  };

  // Handle stage transition
  useEffect(() => {
    if (stage === 0) {
      const timer = setTimeout(() => setStage(1), 3500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Handle page completion
  useEffect(() => {
    if (stage === 1) {
      // Wait for the animations to complete before triggering page completion
      const completionTimer = setTimeout(() => {
        onPageComplete?.();
      }, 2000); // Adjust timing to account for animations

      return () => clearTimeout(completionTimer);
    }
  }, [stage, onPageComplete]);

  const shakeEmoji = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.4, 1],
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 2.5,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="hours"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-4"
          >
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-7xl md:text-8xl font-bold"
              >
                <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                  {formatNumber(hours)} hours reading
                </span>{" "}
                <p> 😯</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div
            key="percentile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-5xl md:text-8xl font-bold"
            >
              <span className="bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                That's more than {percentile}% of readers
              </span>{" "}
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="inline-block"
                style={{ display: "inline-block" }}
              >
                🤯
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingPercentile;
