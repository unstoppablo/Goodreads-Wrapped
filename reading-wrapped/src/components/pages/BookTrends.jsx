import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const getBestMonth = (data) => {
  const months = [
    { name: "January", shortName: "Jan", key: "2024-01", num: 1 },
    { name: "February", shortName: "Feb", key: "2024-02", num: 2 },
    { name: "March", shortName: "Mar", key: "2024-03", num: 3 },
    { name: "April", shortName: "Apr", key: "2024-04", num: 4 },
    { name: "May", shortName: "May", key: "2024-05", num: 5 },
    { name: "June", shortName: "Jun", key: "2024-06", num: 6 },
    { name: "July", shortName: "Jul", key: "2024-07", num: 7 },
    { name: "August", shortName: "Aug", key: "2024-08", num: 8 },
    { name: "September", shortName: "Sep", key: "2024-09", num: 9 },
    { name: "October", shortName: "Oct", key: "2024-10", num: 10 },
    { name: "November", shortName: "Nov", key: "2024-11", num: 11 },
    { name: "December", shortName: "Dec", key: "2024-12", num: 12 },
  ];

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
        ...bestMonth,
        rating: highestRating,
        message: monthMessages[bestMonth.name],
      }
    : null;
};

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

export const AverageRatings = ({ data, onPageComplete }) => {
  const { average_rating, rating_distribution } = data.Rating_Statistics;
  const [showStats, setShowStats] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Add completion effect after all animations
  useEffect(() => {
    if (showStats && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onPageComplete?.();
      }, 4000); // Adjust timing based on your animations
      return () => clearTimeout(timer);
    }
  }, [showStats, isComplete, onPageComplete]);

  const getRatingMessage = (rating) => {
    if (rating >= 3.8) {
      return {
        message: [
          "You have excellent taste in books!",
          "Your high average rating shows you're great at picking books you'll enjoy.",
        ],
      };
    } else if (rating >= 3.2) {
      return {
        message: [
          "You're a balanced reader who's not afraid to be critical.",
          "Your ratings show thoughtful consideration of each book.",
        ],
      };
    } else {
      return {
        message: [
          "Looks like it's been a challenging reading year.",
          "Remember, being critical is good - it means you have high standards!",
        ],
      };
    }
  };

  if (!showStats) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4">
      <StatReveal delay={0}>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-16">
          Rating Breakdown
        </h1>
      </StatReveal>

      <StatReveal delay={1}>
        <div className="mb-16">
          <span className="text-6xl md:text-8xl font-bold text-white">
            ⭐️ {average_rating.toFixed(1)} ⭐️
          </span>
          <p className="text-lg md:text-xl text-gray-400 mt-2">
            average rating
          </p>
        </div>
      </StatReveal>

      <StatReveal delay={2.5}>
        <div className="text-2xl md:text-4xl text-white">
          {getRatingMessage(average_rating).message.map((line, index) => (
            <p key={index} className="text-center mb-5">
              {line}
            </p>
          ))}
        </div>
      </StatReveal>
    </div>
  );
};

export const FavMonth = ({ data, onPageComplete }) => {
  const [showStats, setShowStats] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Add completion effect after all animations
  useEffect(() => {
    if (showStats && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onPageComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showStats, isComplete, onPageComplete]);

  const bestMonth = getBestMonth(data);
  if (!showStats || !bestMonth) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4">
      <StatReveal delay={0}>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-16">
          {bestMonth.message}
        </h1>
      </StatReveal>

      <StatReveal delay={1.5}>
        <div className="mb-16">
          <span className="text-3xl md:text-5xl font-bold text-white">
            Your favorite month was {bestMonth.name}
          </span>
        </div>
      </StatReveal>

      <StatReveal delay={3}>
        <div className="mb-16">
          <span className="text-2xl md:text-4xl font-bold text-white">
            ⭐️ You gave it an average rating of {bestMonth.rating.toFixed(1)}{" "}
            stars ⭐️
          </span>
        </div>
      </StatReveal>
    </div>
  );
};

const BookTrends = { AverageRatings, FavMonth, getBestMonth };
export default BookTrends;
