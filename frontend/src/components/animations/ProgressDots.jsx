import React, { useState, useEffect } from "react";

const ProgressDot = ({
  isActive,
  isComplete,
  duration = 0,
  pageIndex,
  currentPage,
}) => {
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Check if this dot represents a page we've moved past
  const isPastPage = pageIndex < currentPage;

  useEffect(() => {
    let animationFrame;

    if (isActive && !isComplete && duration > 0) {
      setStartTime(Date.now());

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);

        setProgress(newProgress);

        if (newProgress < 100) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    } else if (isComplete || isPastPage) {
      setProgress(100);
    } else if (!isActive) {
      setProgress(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, isComplete, duration, startTime, isPastPage]);

  return (
    <div
      className={`h-1.5 md:h-2 w-6 md:w-8 rounded-full relative overflow-hidden transition-colors
      ${isComplete || isPastPage ? "bg-green-500" : "bg-gray-700"}`}
    >
      {isActive && !isComplete && !isPastPage && (
        <div
          className="absolute left-0 top-0 h-full bg-green-500 transition-transform"
          style={{
            width: "100%",
            transform: `translateX(${progress - 100}%)`,
            transition: isComplete ? "transform 0.5s ease-out" : "none",
          }}
        />
      )}
    </div>
  );
};

const ProgressDots = ({
  currentPage,
  completionStatus,
  pages,
  pageDurations,
}) => {
  // Skip first page (instructions) in progress display
  const displayPages = pages.slice(1);
  const displayCurrentPage = currentPage > 0 ? currentPage - 1 : 0;

  return (
    <div className="fixed top-8 left-0 right-0 flex justify-center gap-1 md:gap-2">
      {displayPages.map((page, index) => (
        <ProgressDot
          key={`${page.id}-${index}`}
          isActive={index === displayCurrentPage}
          isComplete={completionStatus[index + 1]}
          duration={pageDurations[page.id] || 0}
          pageIndex={index}
          currentPage={displayCurrentPage}
        />
      ))}
    </div>
  );
};

export default ProgressDots;
