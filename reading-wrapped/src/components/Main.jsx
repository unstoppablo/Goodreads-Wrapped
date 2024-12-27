import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Overview from "./pages/Overview";
// import ReadingJourney from "./pages/ReadingJourney";
import GoodbyePage from "./pages/Goodbye";
import BookListing from "./pages/BookListing";
import BookExtremes from "./pages/BookExtremes";
import FunFacts from "./pages/FunFacts";
import SummaryStats from "./pages/SummaryStats";
import backgroundVideo from "./media/background.mp4";
import IntroPage from "./pages/IntroPage";
import ReadingPercentile from "./pages/ReadingPercentile";
import CoolStats from "./pages/CoolStats";
import BookTrends from "./pages/BookTrends";

const Main = ({ data }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const pages = [
    {
      title: "",
      id: "intro",
      component: IntroPage,
    },
    {
      title: "",
      id: "overview",
      component: Overview,
    },
    {
      title: "",
      id: "percentiles",
      component: ReadingPercentile,
    },
    {
      title: "That's equivalent to...",
      id: "fun_facts",
      component: FunFacts,
    },
    {
      title: "",
      id: "cool_stats",
      component: CoolStats,
    },
    {
      title: "",
      id: "avg_ratings",
      component: BookTrends.AverageRatings,
    },
    {
      title: "",
      id: "fav_month",
      component: BookTrends.FavMonth,
    },
    {
      title: "",
      id: "fav_month_books",
      component: (props) => {
        const bestMonth = BookTrends.getBestMonth(props.data);
        return <BookListing {...props} month={bestMonth?.num} />;
      },
    },
    {
      id: "longest_book",
      title: "",
      description: "The book with the most pages you've read",
      component: (props) => <BookExtremes {...props} type="longest" />,
    },
    {
      id: "shortest_book",
      title: "",
      description: "The book with the least pages you've read",
      component: (props) => <BookExtremes {...props} type="shortest" />,
    },
    {
      title: "",
      id: "top_books",
      component: (props) => <BookListing {...props} sortOrder="desc" />,
    },
    {
      title: "",
      id: "worst_books",
      component: (props) => <BookListing {...props} sortOrder="asc" />,
    },
    {
      title: "",
      id: "goodbye_message",
      component: GoodbyePage,
    },
    {
      title: "",
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
  const currentTitle = pages[currentPageIndex].title;

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gray-950">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div
          className={`absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 transition-opacity duration-1000 
          ${isVideoLoaded ? "opacity-0" : "opacity-100"}`}
        />

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

        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center">
        {/* Progress dots */}
        <div className="fixed top-8 left-0 right-0 flex justify-center gap-1 md:gap-2">
          {pages.map((page, index) => (
            <div
              key={`${page.id}-${index}`}
              className={`h-1.5 md:h-2 w-6 md:w-8 rounded-full transition-colors
                ${index === currentPageIndex ? "bg-blue-400" : "bg-gray-700"}`}
            />
          ))}
        </div>

        {/* Page Content */}
        <div className="flex-1 w-full flex items-center justify-center px-4">
          {currentTitle && (
            <h2 className="absolute top-16 left-0 right-0 text-3xl md:text-5xl font-bold text-white text-center mt-10">
              {currentTitle}
            </h2>
          )}

          <div className="w-full text-white">
            {CurrentPage ? (
              <CurrentPage data={data} />
            ) : (
              <p className="text-gray-400 text-center">
                Content coming soon...
              </p>
            )}
          </div>
        </div>

        {/* Mobile touch areas - only visible on mobile */}
        <div className="md:hidden">
          <button
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className="fixed left-0 top-0 w-16 h-full z-20"
            aria-label="Previous page"
          />
          <button
            onClick={goToNextPage}
            disabled={currentPageIndex === pages.length - 1}
            className="fixed right-0 top-0 w-16 h-full z-20"
            aria-label="Next page"
          />
        </div>

        {/* Desktop navigation buttons - only visible on desktop */}
        <div className="hidden md:flex fixed bottom-8 left-0 right-0 justify-center gap-4 px-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className={`p-2 rounded-full transition-colors backdrop-blur-sm
              ${
                currentPageIndex === 0
                  ? "opacity-0 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={currentPageIndex === pages.length - 1}
            className={`p-2 rounded-full transition-colors backdrop-blur-sm
              ${
                currentPageIndex === pages.length - 1
                  ? "opacity-0 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            aria-label="Next page"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
