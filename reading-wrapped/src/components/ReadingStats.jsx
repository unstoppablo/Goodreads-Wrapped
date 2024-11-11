// import { Overview } from "./pages/Overview";
// import { RatingsAnalysis } from "./pages/RatingsAnalysis";
// import { MonthlyPatterns } from "./pages/MonthlyPatterns";
// import { Highlights } from "./pages/Highlights";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BookStatsViewer = () => {
  const pages = [
    {
      id: "overview",
      title: "Overview",
      description: "Basic reading statistics for the year",
      // Number of books read
      // Total pages
      // Total reading time
      // First fun comparison (LOTR saga)
    },
    {
      id: "reading_journey",
      title: "Reading Journey",
      description: "Books read throughout the months",
      // Books read per month (a graph of books stacked per month)
      // "Your most active months were ___"
      // "On average, it took you ___ days to finish a book."
    },
    {
      id: "ratings",
      title: "Ratings",
      description: "Ratings summary for books read",
      // Table showing the rating distribution
      // "Your average rating was ___" + conditional message depending on rating (e.g, "You're a tough critic!")
    },
    {
      id: "top_books",
      title: "Your Top Books",
      description: "A listing of favorite books",
      // Listing of top books, max 5 (if a person read less, we show all, sorted H-L)
      // Each row should have book title, rating, page count, author name, and review if applicable
    },
    {
      id: "worst_books",
      title: "Your Least Favorite Books",
      description: "A listing of least favorite books",
      // Listing of least favorite books, max 3 (if a person read less, we show all, sorted L-H)
      // (Above, continued: if a person only read 1 book, discuss how to proceed, or if to even show at all)
      // Each row should have book title, rating, page count, author name, and review if applicable
    },
    {
      id: "longest_and_shortest",
      title: "Your Longest and Shortest Books",
      description: "A listing of least favorite books",
      // Listing of longest and shortest books. Edge case, if 2 books have the same length, just pick the first one alphabetically.
      // For the longest and shortest, we show:
      // - page count, rating, and the user-given review if applicable
    },
    {
      id: "fun_facts",
      title: "Fun Facts",
      description: "A fun way of visualizing the number of books a user read",
      // Listing of the time comparisons
    },
  ];

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const goToNextPage = () => {
    setCurrentPageIndex((prev) =>
      prev === pages.length - 1 ? prev : prev + 1
    );
  };

  const goToPrevPage = () => {
    setCurrentPageIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Navigation header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={goToPrevPage}
          disabled={currentPageIndex === 0}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
            ${
              currentPageIndex === 0
                ? "cursor-not-allowed text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {pages[currentPageIndex].title}
          </h2>
          <p className="text-sm text-gray-500">
            {pages[currentPageIndex].description}
          </p>
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPageIndex === pages.length - 1}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
            ${
              currentPageIndex === pages.length - 1
                ? "cursor-not-allowed text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-8 flex justify-center gap-2">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => setCurrentPageIndex(index)}
            className={`h-2 w-8 rounded-full transition-colors
              ${
                index === currentPageIndex
                  ? "bg-blue-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            aria-label={`Go to ${page.title}`}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        {/* Content will be rendered here based on currentPageIndex */}
        <div className="min-h-[400px]">
          {/* Placeholder for page content */}
          <p className="text-gray-500">
            Content for {pages[currentPageIndex].title} will be rendered here
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookStatsViewer;
