import React from "react";

const ReadingJourney = ({ data }) => {
  const allMonths = [
    { num: "01", name: "Jan" },
    { num: "02", name: "Feb" },
    { num: "03", name: "Mar" },
    { num: "04", name: "Apr" },
    { num: "05", name: "May" },
    { num: "06", name: "Jun" },
    { num: "07", name: "Jul" },
    { num: "08", name: "Aug" },
    { num: "09", name: "Sep" },
    { num: "10", name: "Oct" },
    { num: "11", name: "Nov" },
    { num: "12", name: "Dec" },
  ];

  const monthlyData = allMonths.reduce((acc, month) => {
    const fullKey = `2024-${month.num}`;
    acc[month.name] = data.Reading_Patterns.books_per_month[fullKey] || 0;
    return acc;
  }, {});

  const maxValue = Math.max(...Object.values(monthlyData));
  const maxMonths = Object.entries(monthlyData)
    .filter(([_, count]) => count === maxValue)
    .map(([month]) => month);

  return (
    <div className="space-y-4 px-2">
      {/* Monthly Reading Chart */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Monthly Reading Progress
        </h3>
        <div className="space-y-3">
          {Object.entries(monthlyData).map(([month, value]) => (
            <div key={month} className="flex items-center gap-2">
              <div className="w-10 text-sm font-medium text-gray-700">
                {month}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-1">
                  <div className="text-xl leading-none">
                    {Array(value).fill("📚").join("")}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({value} book{value !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Statistics */}
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-600">
            Most Active Months
          </h3>
          <p className="mt-1 text-sm text-gray-900">
            You read the most books ({maxValue}) in{" "}
            {maxMonths.map((month, index) => (
              <span key={month}>
                {month}
                {index < maxMonths.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <h3 className="text-sm font-medium text-purple-600">Reading Pace</h3>
          <p className="mt-1 text-sm text-gray-900">
            On average, it took you{" "}
            {data.Reading_Patterns.average_days_to_finish.toFixed(1)} days to
            finish a book
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <h3 className="text-sm font-medium text-green-600">Total Progress</h3>
          <p className="mt-1 text-sm text-gray-900">
            {data.Basic_Statistics.total_books} books,{" "}
            {data.Basic_Statistics.total_pages.toLocaleString()} pages
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadingJourney;
