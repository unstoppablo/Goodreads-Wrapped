import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Overview from "./pages/Overview";
import ReadingJourney from "./pages/ReadingJourney";
import Ratings from "./pages/Ratings";
import BookListing from "./pages/BookListing";
import BookExtremes from "./pages/BookExtremes";
import FunFacts from "./pages/FunFacts";
import SummaryStats from "./pages/SummaryStats";
import backgroundVideo from "./media/background.mp4"; // Import the video

const Main = ({ data }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
    <div className="w-full min-h-screen relative overflow-hidden bg-gray-950">
      {/* Background Video Container */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Loading state background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 transition-opacity duration-1000 
            ${isVideoLoaded ? "opacity-0" : "opacity-100"}`}
        />

        {/* Video Element */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000
            ${isVideoLoaded ? "opacity-60" : "opacity-0"}`}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>

        {/* Darker overlay for better readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-8 h-screen flex flex-col">
        <div className="relative flex-1 flex flex-col">
          {/* Progress indicator */}
          <div className="flex justify-center gap-1 md:gap-2 mb-4 md:mb-8">
            {pages.map((page, index) => (
              <div
                key={`${page.id}-${index}`}
                className={`h-1.5 md:h-2 w-6 md:w-8 rounded-full transition-colors
                  ${
                    index === currentPageIndex ? "bg-blue-400" : "bg-gray-700"
                  }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center mb-16">
            <div className="rounded-lg bg-gray-900/80 backdrop-blur-md p-4 md:p-6 shadow-xl w-full border border-gray-800">
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-full text-gray-100">
                  {CurrentPage ? (
                    <CurrentPage data={data} />
                  ) : (
                    <p className="text-gray-400 text-center">
                      Content coming soon...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className={`p-2 rounded-full transition-colors shadow-lg backdrop-blur-sm
                ${
                  currentPageIndex === 0
                    ? "cursor-not-allowed text-gray-600 bg-gray-800/50"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 active:bg-gray-600/50"
                }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              className={`p-2 rounded-full transition-colors shadow-lg backdrop-blur-sm
                ${
                  currentPageIndex === pages.length - 1
                    ? "cursor-not-allowed text-gray-600 bg-gray-800/50"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 active:bg-gray-600/50"
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

export default Main;
