import React from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import bookNotFound from "@/components/media/book_not_found.jpeg";

const BookExtremes = ({ data, type = "longest" }) => {
  const { longest_book, shortest_book } = data.Book_Extremes;
  const book = type === "longest" ? longest_book : shortest_book;

  const RatingStars = ({ rating, size = "small" }) => {
    const starSize = size === "large" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`${starSize} ${
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -300,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const getTitle = () => {
    return type === "longest" ? "Your longest Book" : "Your shortest Book";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-16">
          {getTitle()}
        </h1>
        <div className="flex flex-col items-center max-w-xl mx-auto">
          <img
            src={book.cover_url || bookNotFound}
            alt={`Cover of ${book.title}`}
            className="w-40 h-64 object-cover rounded-lg shadow-lg mb-8"
          />
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">{book.title}</h3>
            <p className="text-lg text-gray-400">by {book.author}</p>
            <div className="flex justify-center items-center gap-4">
              <RatingStars rating={book.rating} size="large" />
              <span className="text-gray-400">{book.pages} pages</span>
            </div>
            {book.review && (
              <Popover>
                <PopoverTrigger className="text-blue-400 hover:text-blue-300 text-lg">
                  Read review
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-2">
                    <h4 className="font-medium text-base">Review</h4>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="text-gray-600">
                        {book.review.split("<br/>").map((paragraph, i) => (
                          <p key={i} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookExtremes;
