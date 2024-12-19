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

export const AverageRatings = ({ data }) => {
  const { average_rating, rating_distribution } = data.Rating_Statistics;

  const getRatingMessage = (rating) => {
    if (rating >= 3.8) {
      return {
        message:
          "You have excellent taste in books! Your high average rating shows you're great at picking books you'll enjoy.",
        className: "bg-green-950/50 border border-green-900/30 text-green-200",
      };
    } else if (rating >= 3.2) {
      return {
        message:
          "You're a balanced reader who's not afraid to be critical. Your ratings show thoughtful consideration of each book.",
        className: "bg-blue-950/50 border border-blue-900/30 text-blue-200",
      };
    } else {
      return {
        message:
          "Looks like it's been a challenging reading year. Remember, being critical is good - it means you have high standards!",
        className:
          "bg-purple-950/50 border border-purple-900/30 text-purple-200",
      };
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Average Rating Card */}

        <StatReveal delay={0}>
          <p className="text-center max-w-1xl text-1xl md:text-3xl font-bold text-white text-center leading-tight">
            You rated your books an average of ✨ {average_rating.toFixed(1)}{" "}
            ✨stars
          </p>
        </StatReveal>

        {/* Rating Message */}
        <StatReveal delay={3}>
          <p className="text-center max-w-1xl text-1xl md:text-1xl  text-white text-center leading-tight">
            {getRatingMessage(average_rating).message}
          </p>
        </StatReveal>
      </div>
    </div>
  );
};

export const FavMonth = ({ data }) => {
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

  // Find the highest rated month
  const getBestMonth = () => {
    let bestMonth = null;
    let highestRating = 0;

    months.forEach((month) => {
      const monthData = data["Monthly Rating Distribution"][month.key];
      if (monthData && monthData.average > highestRating) {
        highestRating = monthData.average;
        bestMonth = month;
      }
    });

    const monthMessages = {
      January: "Starting the year strong! 🎉",
      February: "Feeling the love for books! ❤️",
      March: "Springing forward with great reads! 🌸",
      April: "Showered with amazing books! 🌧️",
      May: "May the great books be with you! ⭐",
      June: "Kicking off summer with stellar reads! ☀️",
      July: "Heating up with hot reads! 🌞",
      August: "Ending summer on a high note! 🏖️",
      September: "Fall-ing for great books! 🍂",
      October: "Treating yourself to great reads! 🎃",
      November: "Giving thanks for good books! 🍁",
      December: "Ending the year with a bang! 🎄",
    };

    return bestMonth
      ? {
          name: bestMonth.name,
          rating: highestRating,
          message: monthMessages[bestMonth.name],
        }
      : null;
  };

  const bestMonth = getBestMonth();

  const fadeInUp = {
    initial: { opacity: 0, y: 500 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -200 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {bestMonth && (
          <motion.div key="books" {...fadeInUp} className="text-center">
            <p className="text-center max-w-1xl text-1xl md:text-3xl font-bold text-white text-center leading-tight">
              Your favorite month was {bestMonth.name}!
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
              className="text-center max-w-1xl text-1xl md:text-3xl font-bold text-white text-center leading-tight"
            >
              You gave it an average rating of {bestMonth.rating.toFixed(1)}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.8 }}
              className="text-center max-w-1xl text-1xl md:text-3xl font-bold text-white text-center leading-tight"
            >
              {bestMonth.message}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Default export with both components
const BookTrends = { AverageRatings, FavMonth };

export default BookTrends;
