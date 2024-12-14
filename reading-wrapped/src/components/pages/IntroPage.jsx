import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroPage = () => {
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentStage === 0 && (
          <motion.div
            key="hello"
            {...fadeInUp}
            className="text-6xl md:text-8xl font-bold text-white text-center"
          >
            Hello there!
          </motion.div>
        )}

        {currentStage === 1 && (
          <motion.div
            key="welcome"
            {...fadeInUp}
            className="max-w-2xl text-4xl md:text-6xl font-bold text-white text-center leading-tight"
          >
            Welcome to your Goodreads Year in Review
          </motion.div>
        )}

        {currentStage === 2 && (
          <motion.div key="ready" {...fadeInUp} className="text-center">
            <p className="text-2xl md:text-3xl text-white mb-8">
              Ready to turn the page?
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-lg text-gray-400"
            >
              Your literary journey awaits...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroPage;
