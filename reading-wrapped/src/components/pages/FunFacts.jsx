import React from "react";
import {
  Timer,
  Plane,
  Music2,
  Play,
  Orbit,
  TreePine,
  Film,
  Baby,
} from "lucide-react";

const FunFacts = ({ data }) => {
  const comparisons = data.Time_Comparisons;

  // Map fact types to icons
  const getFactStyle = (fact) => {
    if (fact.includes("Lord of the Rings")) {
      return { icon: <Film className="w-6 h-6" /> };
    }
    if (fact.includes("Office")) {
      return { icon: <Play className="w-6 h-6" /> };
    }
    if (fact.includes("flights")) {
      return { icon: <Plane className="w-6 h-6" /> };
    }
    if (fact.includes("Taylor Swift")) {
      return { icon: <Music2 className="w-6 h-6" /> };
    }
    if (fact.includes("Baby Shark")) {
      return { icon: <Baby className="w-6 h-6" /> };
    }
    if (fact.includes("Space Station")) {
      return { icon: <Orbit className="w-6 h-6" /> };
    }
    if (fact.includes("marathons")) {
      return { icon: <Timer className="w-6 h-6" /> };
    }
    if (fact.includes("beaver")) {
      return { icon: <TreePine className="w-6 h-6" /> };
    }
    // Default style
    return { icon: <Timer className="w-6 h-6" /> };
  };

  return (
    <div className="space-y-4">
      {/* Time spent reading card */}
      <div className="mb-4">
        <p className="text-white-600">
          You've spent approximately{" "}
          <span className="font-bold text-lg">
            {data.Basic_Statistics.estimated_hours.toFixed(1)} hours
          </span>{" "}
          reading this year. That's equivalent to:
        </p>
      </div>
      {/* Fun comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisons.map((comparison, index) => {
          const factStyle = getFactStyle(comparison);

          return (
            <div
              key={index}
              className="rounded-lg p-4 border bg-blue-50 border-blue-200 text-blue-700 flex items-center gap-4"
            >
              <div className="flex-shrink-0 flex items-center justify-center">
                {factStyle.icon}
              </div>
              <div className="flex-1 min-w-0 text-left">{comparison}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunFacts;
