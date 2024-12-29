import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CoolStats = ({ data, onPageComplete }) => {
  const months = [
    { name: "January", shortName: "Jan", key: "2024-01" },
    { name: "February", shortName: "Feb", key: "2024-02" },
    { name: "March", shortName: "Mar", key: "2024-03" },
    { name: "April", shortName: "Apr", key: "2024-04" },
    { name: "May", shortName: "May", key: "2024-05" },
    { name: "June", shortName: "Jun", key: "2024-06" },
    { name: "July", shortName: "Jul", key: "2024-07" },
    { name: "August", shortName: "Aug", key: "2024-08" },
    { name: "September", shortName: "Sep", key: "2024-09" },
    { name: "October", shortName: "Oct", key: "2024-10" },
    { name: "November", shortName: "Nov", key: "2024-11" },
    { name: "December", shortName: "Dec", key: "2024-12" },
  ];

  // Calculate books per month
  const monthlyBooks = months.reduce((acc, month) => {
    acc[month.name] = data.Reading_Patterns.books_per_month[month.key] || 0;
    return acc;
  }, {});

  // Calculate pages per month
  const monthlyPages = months.reduce((acc, month) => {
    const monthBooks = data["All Books Read"].filter((book) =>
      book.date_read.startsWith(month.key)
    );
    acc[month.name] = monthBooks.reduce((sum, book) => sum + book.pages, 0);
    return acc;
  }, {});

  // Get top 3 months by books
  const topMonthsByBooks = Object.entries(monthlyBooks)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([month, count]) => ({
      name: month,
      count: count,
    }));

  // Get top 3 months by pages
  const topMonthsByPages = Object.entries(monthlyPages)
    .filter(([_, pages]) => pages > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([month, pages]) => ({
      name: month,
      pages: pages,
    }));

  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timings = [3000, 8700, 9700, 6000];

    if (currentStage < 4) {
      const timer = setTimeout(() => {
        setCurrentStage(currentStage + 1);
      }, timings[currentStage]);

      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  // Separate effect to handle completion
  useEffect(() => {
    if (currentStage === 4 && !isComplete) {
      setIsComplete(true);
      onPageComplete?.();
    }
  }, [currentStage, isComplete, onPageComplete]);

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
        return (
          <motion.div
            className="text-center"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center leading-tight">
              Now, some cool stats for you 📊
            </h2>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            className="text-center space-y-8"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center leading-tight">
              Your most active months were 📚
            </h2>
            <div className="space-y-6">
              {topMonthsByBooks.map((month, index) => (
                <motion.div
                  key={month.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: index === 0 ? 1.5 : index === 1 ? 3.8 : 6.1,
                  }}
                  className="text-4xl md:text-6xl font-bold text-white text-center leading-tight"
                >
                  {month.name}: {month.count} book{month.count !== 1 ? "s" : ""}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="text-center space-y-8"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center leading-tight">
              You read the most pages in 📖
            </h2>
            <div className="space-y-6">
              {topMonthsByPages.map((month, index) => (
                <motion.div
                  key={month.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: index === 0 ? 1.5 : index === 1 ? 3.8 : 6.1,
                  }}
                  className="text-4xl md:text-6xl font-bold text-white text-center leading-tight"
                >
                  {month.name}: {month.pages.toLocaleString()} pages
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="text-center"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center leading-tight">
              🏃‍♂️ On average, it took you approximately{" "}
              {Math.round(data.Reading_Patterns.average_days_to_finish)} days to
              finish a book ⏱️
            </h2>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            className="text-center"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center leading-tight">
              Nice! Let's continue 🥸
            </h2>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <Content key={currentStage} />
      </AnimatePresence>
    </div>
  );
};

export default CoolStats;
