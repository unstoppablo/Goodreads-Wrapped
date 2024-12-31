import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GoodbyePage = ({ onPageComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timings = [2000, 4000]; // Only transition through first two stages automatically

    if (currentStage < 2) {
      const timer = setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
      }, timings[currentStage]);

      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  useEffect(() => {
    if (currentStage === 2 && onPageComplete) {
      const completeTimer = setTimeout(() => {
        onPageComplete();
      }, 3000);

      return () => clearTimeout(completeTimer);
    }
  }, [currentStage, onPageComplete]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {currentStage === 0 && (
          <motion.div
            key="thanks"
            {...fadeInUp}
            className="text-4xl md:text-6xl font-bold text-center"
          >
            Thanks for reading! 📖
          </motion.div>
        )}

        {currentStage === 1 && (
          <motion.div
            key="journey"
            {...fadeInUp}
            className="max-w-2xl text-3xl md:text-5xl font-bold text-center leading-tight"
          >
            Before you go
          </motion.div>
        )}

        {currentStage === 2 && (
          <motion.div key="ready" {...fadeInUp} className="text-center">
            <p className="max-w-2xl text-3xl md:text-5xl font-bold text-center leading-tight">
              Here's a final summary of your reading journey this year 😃
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoodbyePage;
