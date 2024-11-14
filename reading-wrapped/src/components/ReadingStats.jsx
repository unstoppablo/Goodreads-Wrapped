import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Overview from "./pages/Overview";
import ReadingJourney from "./pages/ReadingJourney";
import Ratings from "./pages/Ratings";
import BookListing from "./pages/BookListing";
import BookExtremes from "./pages/BookExtremes";
import FunFacts from "./pages/FunFacts";
import SummaryStats from "./pages/SummaryStats";

const ReadingStats = ({ data }) => {
  const pages = [
    {
      id: "overview",
      component: Overview,
    },
    {
      id: "reading_journey",
      component: ReadingJourney.ReadingProgress,
    },
    {
      id: "reading_journey",
      component: ReadingJourney.ReadingStats,
    },
    {
      id: "ratings",
      component: Ratings.RatingsOverview,
    },
    {
      id: "ratings",
      component: Ratings.MonthlyRatings,
    },
    {
      id: "top_books",
      component: (props) => <BookListing {...props} sortOrder="desc" />,
    },
    {
      id: "worst_books",
      component: (props) => <BookListing {...props} sortOrder="asc" />,
    },
    {
      id: "longest_and_shortest",
      component: BookExtremes,
    },
    {
      id: "fun_facts",
      component: FunFacts,
    },
    {
      id: "final_page",
      component: SummaryStats,
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
      <div className="w-full max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-8 h-screen flex flex-col">
        <div className="relative flex-1 flex flex-col">
          {/* Progress indicator */}
          <div className="flex justify-center gap-1 md:gap-2 mb-4 md:mb-8">
            {pages.map((page, index) => (
              <div
                key={`${page.id}-${index}`}
                className={`h-1.5 md:h-2 w-6 md:w-8 rounded-full transition-colors
                  ${
                    index === currentPageIndex ? "bg-blue-500" : "bg-gray-200"
                  }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center mb-16">
            <div className="rounded-lg bg-white p-4 md:p-6 shadow-lg w-full">
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-full">
                  {CurrentPage ? (
                    <CurrentPage data={data} />
                  ) : (
                    <p className="text-gray-500 text-center">
                      Content coming soon...
                    </p>
                  )}
                </div>
              </div>
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
