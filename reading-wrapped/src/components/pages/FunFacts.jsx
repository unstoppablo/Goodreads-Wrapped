import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FunFacts = ({ data }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const comparisons = data.Time_Comparisons;
  const totalHours = data.Basic_Statistics.estimated_hours.toFixed(1);

  // Split comparisons into groups of 3 for better mobile viewing
  const comparisonGroups = [];
  for (let i = 0; i < comparisons.length; i += 3) {
    comparisonGroups.push(comparisons.slice(i, i + 3));
  }

  useEffect(() => {
    const timings = [
      8000, // First group
    ];

    if (currentStage < timings.length) {
      const timer = setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
      }, timings[currentStage]);

      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  const pageVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  const pageTransition = {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1],
  };

  const Content = () => {
    switch (currentStage) {
      case 0:
      case 1: {
        const groupIndex = currentStage;
        const currentGroup = comparisonGroups[groupIndex];

        return (
          <motion.div
            key={groupIndex}
            className="space-y-6 w-full max-w-2xl"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {currentGroup.map((comparison, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.5 }}
                className="rounded-lg p-6 text-white/80 flex items-center gap-6"
              >
                <div className="text-2xl md:text-4xl  text-white text-center leading-tight">
                  {comparison}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <Content key={currentStage} />
      </AnimatePresence>
    </div>
  );
};

export default FunFacts;
