import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CoolStats = ({ data }) => {
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

  useEffect(() => {
    const timings = [3000, 8700, 9700, 6000]; // Only transition through first stage automatically

    if (currentStage < 4) {
      const timer = setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
      }, timings[currentStage]);

      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  const fadeInUp = {
    initial: { opacity: 0, y: 500 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -200 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  };

  const fadeLeft = {
    initial: { opacity: 0, y: 500 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -200 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentStage === 0 && (
          <motion.div key="intro" {...fadeInUp} className="text-center">
            <h2 className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight">
              Now, some cool stats for you
            </h2>
          </motion.div>
        )}

        {currentStage === 1 && (
          <motion.div key="books" {...fadeLeft} className="text-center">
            <h2 className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight">
              Your most active months were
            </h2>
            {/* <p className="text-sm md:text-2xl text-white mb-8"> */}
            <p className="text-center">
              {topMonthsByBooks.map((month, index) => (
                <p key={month.name}>
                  {index === topMonthsByBooks.length - 1 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 6.1 }}
                      className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight"
                    >
                      {month.name}: {month.count} book
                      {month.count !== 1 ? "s" : ""}
                    </motion.div>
                  ) : index === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight"
                    >
                      {month.name}: {month.count} book
                      {month.count !== 1 ? "s" : ""}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.8 }}
                      className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight"
                    >
                      {month.name}: {month.count} book
                      {month.count !== 1 ? "s" : ""}
                    </motion.div>
                  )}
                </p>
              ))}{" "}
            </p>
          </motion.div>
        )}

        {currentStage === 2 && (
          <motion.div key="pages" {...fadeLeft} className="text-center">
            <h2 className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight">
              You read the most pages in
            </h2>
            {/* <p className="text-sm md:text-2xl text-white mb-8"> */}
            <p className="text-center">
              {topMonthsByPages.map((month, index) => (
                <p key={month.name}>
                  {index === topMonthsByBooks.length - 1 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 6.1 }}
                      className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight"
                    >
                      {month.name}: {month.pages.toLocaleString()} pages
                    </motion.div>
                  ) : index === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight"
                    >
                      {month.name}: {month.pages.toLocaleString()} pages
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.8 }}
                      className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight"
                    >
                      {month.name}: {month.pages.toLocaleString()} pages
                    </motion.div>
                  )}
                </p>
              ))}{" "}
            </p>
          </motion.div>
        )}

        {currentStage === 3 && (
          <motion.div key="averages" {...fadeLeft} className="text-center">
            <h2 className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight">
              🏃‍♂️‍➡️ On average, it took you approximately{" "}
              {Math.round(data.Reading_Patterns.average_days_to_finish)} days to
              finish a book ⏱️
            </h2>
          </motion.div>
        )}

        {currentStage === 4 && (
          <motion.div key="outro" {...fadeLeft} className="text-center">
            <h2 className="max-w-1xl text-1xl md:text-4xl font-bold text-white text-center leading-tight">
              Nice! Let's continue 🥸
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoolStats;
