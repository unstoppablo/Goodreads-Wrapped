import React, { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Card, Title, Text } from "@tremor/react";

const ReadingStats = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const slides = [
    {
      title: "Your Year in Books",
      content: (
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold text-primary text-center"
          >
            {data["Basic Statistics"].total_books}
          </motion.div>
          <Text className="text-center text-xl">Books Read</Text>
        </div>
      ),
    },
    {
      title: "Reading Pattern",
      content: (
        <Card className="mt-4">
          <Title>Books Read Per Month</Title>
          <AreaChart
            className="mt-4 h-72"
            data={Object.entries(data["Reading Patterns"].books_per_month).map(
              ([month, count]) => ({
                month: month,
                "Books Read": count,
              })
            )}
            index="month"
            categories={["Books Read"]}
            colors={["primary"]}
          />
        </Card>
      ),
    },
    {
      title: "Your Top Books",
      content: (
        <div className="space-y-4">
          {data["Top Books Summary"].slice(0, 3).map((book, index) => (
            <motion.div
              key={book.title}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-surface p-4 rounded-lg"
            >
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p className="text-secondary">by {book.author}</p>
              <p className="text-primary">Rating: {book.rating}/5</p>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsVisible(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <motion.div
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">
          {slides[currentSlide].title}
        </h1>
        {slides[currentSlide].content}
        <button
          onClick={nextSlide}
          className="mt-8 px-6 py-2 bg-primary text-white rounded-full mx-auto block hover:bg-opacity-80 transition-all"
        >
          Next →
        </button>
      </motion.div>
    </div>
  );
};

export default ReadingStats;
