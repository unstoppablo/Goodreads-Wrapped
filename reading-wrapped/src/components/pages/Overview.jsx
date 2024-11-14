import React from "react";

const Overview = ({ data }) => {
  const { Basic_Statistics: basicStats, Time_Comparisons: timeComparisons } =
    data;

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Your year at a glance!
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Here's everything you've accomplished in 2024 so far:
          </p>
        </div>

        {/* Basic Stats 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="text-xs font-medium text-blue-600">Total Books</h3>
            <p className="mt-1 text-2xl font-semibold text-blue-900">
              {basicStats.total_books}
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <h3 className="text-xs font-medium text-purple-600">Total Pages</h3>
            <p className="mt-1 text-2xl font-semibold text-purple-900">
              {basicStats.total_pages.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <h3 className="text-xs font-medium text-green-600">Reading Time</h3>
            <p className="mt-1 text-2xl font-semibold text-green-900">
              {Math.round(basicStats.estimated_hours)} hours
            </p>
          </div>

          <div className="rounded-lg bg-indigo-50 p-4">
            <h3 className="text-xs font-medium text-indigo-600">
              ~ Days Reading
            </h3>
            <p className="mt-1 text-2xl font-semibold text-indigo-900">
              {Math.round(basicStats.estimated_days)}
            </p>
          </div>
        </div>

        {/* Fun Comparison */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Did you know? That's the equivalent to
          </h3>
          <p className="text-sm text-gray-600">{timeComparisons[0]}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
