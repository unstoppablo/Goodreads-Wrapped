import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoadingPage = ({ onPageComplete }) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate processing time with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 2;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full max-w-lg mx-auto">
      <Card className="w-full bg-black/40 backdrop-blur-md border-white/10">
        {showInstructions ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                How to Navigate
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="space-y-6">
                {/* Navigation instructions */}
                <div className="flex items-center justify-between gap-4 px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <ChevronLeft className="w-6 h-6" />
                    </div>
                    <p className="text-gray-300">Tap left to go back</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-gray-300">Tap right to continue</p>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Progress indicator explanation */}
                <div className="flex flex-col items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-8 rounded-full bg-gray-700" />
                    <div className="h-2 w-8 rounded-full bg-green-500" />
                  </div>
                  <p className="text-gray-300">
                    Green bar means you've seen everything on the page
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                Got it!
              </button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3">
                <BookOpen className="w-8 h-8 animate-pulse" />
                Analyzing your books...
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-gray-300 text-center">
                {isReady ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Analysis complete!
                  </span>
                ) : (
                  "This will take about a minute..."
                )}
              </p>

              {isReady && (
                <button
                  onClick={onPageComplete}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                >
                  Let's explore your year in books!
                </button>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default LoadingPage;
