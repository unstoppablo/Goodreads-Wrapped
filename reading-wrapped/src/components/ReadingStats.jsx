import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Overview from "./pages/Overview";
import ReadingJourney from "./pages/ReadingJourney";
import Ratings from "./pages/Ratings";

const ReadingStats = ({ data }) => {
  const pages = [
    {
      id: "overview",
      title: "Overview",
      description: "Basic reading statistics for the year",
      component: Overview,
    },
    {
      id: "reading_journey",
      title: "Reading Journey",
      description: "Books read throughout the months",
      component: ReadingJourney,
    },
    {
      id: "ratings",
      title: "Ratings",
      description: "Ratings summary for books read",
      component: Ratings,
    },
    {
      id: "top_books",
      title: "Your Top Books",
      description: "A listing of favorite books",
      component: null,
    },
    {
      id: "worst_books",
      title: "Your Least Favorite Books",
      description: "A listing of least favorite books",
      component: null,
    },
    {
      id: "longest_and_shortest",
      title: "Your Longest and Shortest Books",
      description: "A listing of least favorite books",
      component: null,
    },
    {
      id: "fun_facts",
      title: "Fun Facts",
      description: "A fun way of visualizing the number of books a user read",
      component: null,
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

  const CurrentPage = pages[currentPageIndex].component;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-8">
        {/* Title and Description */}
        <div className="text-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            {pages[currentPageIndex].title}
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            {pages[currentPageIndex].description}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-1 md:gap-2 mb-4 md:mb-8">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setCurrentPageIndex(index)}
              className={`h-1.5 md:h-2 w-6 md:w-8 rounded-full transition-colors
                ${
                  index === currentPageIndex
                    ? "bg-blue-500"
                    : "bg-gray-200 active:bg-gray-300 hover:bg-gray-300"
                }`}
              aria-label={`Go to ${page.title}`}
            />
          ))}
        </div>

        {/* Main container with fixed navigation */}
        <div className="relative">
          {/* Content */}
          <div className="rounded-lg bg-white p-4 md:p-6 shadow-lg">
            <div className="min-h-[400px]">
              {CurrentPage ? (
                <CurrentPage data={data} />
              ) : (
                <p className="text-gray-500 text-center">
                  Content for {pages[currentPageIndex].title} coming soon...
                </p>
              )}
            </div>
          </div>

          {/* Fixed navigation buttons */}
          <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className={`p-2 rounded-full transition-colors shadow-lg
                ${
                  currentPageIndex === 0
                    ? "cursor-not-allowed text-gray-300 bg-white"
                    : "bg-white text-gray-700 active:bg-gray-100 hover:bg-gray-100"
                }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              className={`p-2 rounded-full transition-colors shadow-lg
                ${
                  currentPageIndex === pages.length - 1
                    ? "cursor-not-allowed text-gray-300 bg-white"
                    : "bg-white text-gray-700 active:bg-gray-100 hover:bg-gray-100"
                }`}
              aria-label="Next page"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;
