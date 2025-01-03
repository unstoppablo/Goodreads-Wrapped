import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Overview from "./pages/Overview";
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
import InstructionPage from "./pages/InstructionPage";
import ProgressDots from "./animations/ProgressDots";

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(() => {
    // Try to get cached data on initial load
    const cached = localStorage.getItem("analysisData");
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const timeDiff = Date.now() - timestamp;
        const minutesOld = Math.floor(timeDiff / 60000);

        if (timeDiff < 5 * 60 * 1000) {
          console.log(`📋 Found valid cache (${minutesOld} minutes old)`);
          return data;
        } else {
          console.log(`🕒 Cache expired (${minutesOld} minutes old)`);
          localStorage.removeItem("analysisData");
        }
      } catch (e) {
        console.log("❌ Invalid cache found, removing");
        localStorage.removeItem("analysisData");
      }
    } else {
      console.log("📭 No cache found");
    }
    return null;
  });

  // Set loading false after initial check
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageCompletionStatus, setPageCompletionStatus] = useState([]);

  const handleInstructionComplete = (result) => {
    setData(result);
    console.log("💾 Caching new analysis data");
    localStorage.setItem(
      "analysisData",
      JSON.stringify({
        data: result,
        timestamp: Date.now(),
      })
    );
    setCurrentPageIndex(1);
  };

  const pages = [
    {
      title: "",
      id: "instructions",
      component: (props) => (
        <InstructionPage
          {...props}
          onPageComplete={handleInstructionComplete}
        />
      ),
    },
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

  const pageDurations = {
    intro: 9000,
    overview: 5000,
    percentiles: 6000,
    fun_facts: 12000,
    cool_stats: 25700,
    avg_ratings: 7000,
    fav_month: 5000,
    goodbye_message: 10000,
    // Pages that complete instantly
    fav_month_books: 0,
    longest_book: 0,
    shortest_book: 0,
    top_books: 0,
    worst_books: 0,
    final_page: 0,
  };

  // Initialize page completion status when component mounts
  useEffect(() => {
    setPageCompletionStatus(new Array(pages.length).fill(false));
  }, [pages.length]);

  // Function to mark a page as completed
  const markPageAsCompleted = (pageIndex) => {
    setPageCompletionStatus((prev) => {
      const newStatus = [...prev];
      newStatus[pageIndex] = true;
      return newStatus;
    });
  };

  const goToNextPage = () => {
    if (!data && currentPageIndex === 0) return; // Block navigation on instructions until data exists
    setCurrentPageIndex((prev) =>
      prev === pages.length - 1 ? prev : prev + 1
    );
  };

  const goToPrevPage = () => {
    if (!data && currentPageIndex === 0) return;
    if (currentPageIndex > 0) {
      const newIndex = currentPageIndex - 1;
      setCurrentPageIndex(newIndex);
      setPageCompletionStatus((prev) => {
        const newStatus = [...prev];
        for (let i = newIndex + 1; i < newStatus.length; i++) {
          newStatus[i] = false;
        }
        return newStatus;
      });
    }
  };

  const CurrentPage = pages[currentPageIndex].component;
  const currentTitle = pages[currentPageIndex].title;

  // Using this to deal with infinite animation retriggering when passing onPageComplete props to these pages. Lazy fix.
  useEffect(() => {
    if (
      [
        "fav_month_books",
        "longest_book",
        "shortest_book",
        "top_books",
        "worst_books",
        "final_page",
      ].includes(pages[currentPageIndex].id)
    ) {
      markPageAsCompleted(currentPageIndex);
    }
  }, [currentPageIndex]);

  useEffect(() => {
    if (currentPageIndex === pages.length - 1) {
      console.log("🧹 Clearing cache at end of experience");
      localStorage.removeItem("analysisData");
    }
  }, [currentPageIndex, pages.length]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }
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
        {currentPageIndex > 0 && (
          <ProgressDots
            currentPage={currentPageIndex}
            completionStatus={pageCompletionStatus}
            pages={pages}
            pageDurations={pageDurations}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 w-full flex items-center justify-center px-4">
          {currentTitle && (
            <h2 className="absolute top-16 left-0 right-0 text-3xl md:text-5xl font-bold text-white text-center mt-10">
              {currentTitle}
            </h2>
          )}

          <div className="w-full text-white">
            {CurrentPage && data ? (
              <CurrentPage
                data={data}
                onPageComplete={() => markPageAsCompleted(currentPageIndex)}
              />
            ) : (
              <CurrentPage
                onPageComplete={() => markPageAsCompleted(currentPageIndex)}
              />
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
