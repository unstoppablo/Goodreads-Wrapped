import React from "react";

const Overview = ({ data }) => {
  const { Basic_Statistics: basicStats, Time_Comparisons: timeComparisons } =
    data;

  return (
    <div className="space-y-8">
      {/* Basic Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="text-sm font-medium text-blue-600">Total Books</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-900">
            {basicStats.total_books}
          </p>
        </div>

        <div className="rounded-lg bg-purple-50 p-6">
          <h3 className="text-sm font-medium text-purple-600">Total Pages</h3>
          <p className="mt-2 text-3xl font-semibold text-purple-900">
            {basicStats.total_pages.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-6">
          <h3 className="text-sm font-medium text-green-600">Reading Time</h3>
          <p className="mt-2 text-3xl font-semibold text-green-900">
            {Math.round(basicStats.estimated_hours)} hours
          </p>
        </div>

        <div className="rounded-lg bg-indigo-50 p-6">
          <h3 className="text-sm font-medium text-indigo-600">Days Reading</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-900">
            {Math.round(basicStats.estimated_days)} days
          </p>
        </div>
      </div>

      {/* Fun Comparison */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="text-lg font-medium text-gray-900">Fun Comparison</h3>
        <p className="mt-2 text-gray-600">
          {timeComparisons[0]} {/* LOTR comparison */}
        </p>
      </div>
    </div>
  );
};

export default Overview;
