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

  // Map fact types to icons and colors
  const getFactStyle = (fact) => {
    if (fact.includes("Lord of the Rings")) {
      return {
        icon: <Film className="w-6 h-6" />,
        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      };
    }
    if (fact.includes("Office")) {
      return {
        icon: <Play className="w-6 h-6" />,
        color: "bg-green-50 border-green-200 text-green-700",
      };
    }
    if (fact.includes("flights")) {
      return {
        icon: <Plane className="w-6 h-6" />,
        color: "bg-blue-50 border-blue-200 text-blue-700",
      };
    }
    if (fact.includes("Taylor Swift")) {
      return {
        icon: <Music2 className="w-6 h-6" />,
        color: "bg-pink-50 border-pink-200 text-pink-700",
      };
    }
    if (fact.includes("Baby Shark")) {
      return {
        icon: <Baby className="w-6 h-6" />,
        color: "bg-purple-50 border-purple-200 text-purple-700",
      };
    }
    if (fact.includes("Space Station")) {
      return {
        icon: <Orbit className="w-6 h-6" />,
        color: "bg-indigo-50 border-indigo-200 text-indigo-700",
      };
    }
    if (fact.includes("marathons")) {
      return {
        icon: <Timer className="w-6 h-6" />,
        color: "bg-red-50 border-red-200 text-red-700",
      };
    }
    if (fact.includes("beaver")) {
      return {
        icon: <TreePine className="w-6 h-6" />,
        color: "bg-orange-50 border-orange-200 text-orange-700",
      };
    }
    // Default style
    return {
      icon: <Timer className="w-6 h-6" />,
      color: "bg-gray-50 border-gray-200 text-gray-700",
    };
  };

  // Function to extract the number from the comparison string
  const extractNumber = (text) => {
    const match = text.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]).toFixed(1) : "";
  };

  // Function to clean up the text after the number
  const cleanText = (text) => {
    return text
      .replace(/\d+(\.\d+)?/, "") // Remove the number
      .replace(/^\s*times\s*/, "") // Remove "times" if it's at the start
      .replace(/<[^>]+>/g, "") // Remove emoji tags
      .trim();
  };

  return (
    <div className="space-y-4">
      {/* Time spent reading card */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your Reading Time
        </h3>
        <p className="text-gray-600">You've spent approximately</p>
        <p className="text-3xl font-bold text-gray-900 my-2">
          {data.Basic_Statistics.estimated_hours.toFixed(1)} hours
        </p>
        <p className="text-gray-600">
          reading this year. That's equivalent to:
        </p>
      </div>

      {/* Fun comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisons.map((comparison, index) => {
          const factStyle = getFactStyle(comparison);
          const number = extractNumber(comparison);
          const text = cleanText(comparison);

          return (
            <div
              key={index}
              className={`rounded-lg p-4 border flex items-center gap-4 ${factStyle.color}`}
            >
              <div className="flex-shrink-0">{factStyle.icon}</div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold">{number}×</span> {text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunFacts;
