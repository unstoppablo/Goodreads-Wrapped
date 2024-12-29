import React from "react";

const MAX_EMOJI_DISPLAY = 6;

// First page: Monthly Reading Progress
export const ReadingProgress = ({ data }) => {
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

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg space-y-3">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100">
            Your reading timeline!
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Let's see how your reading journey unfolded throughout the months...
          </p>
        </div>
        <div className="rounded-lg bg-gray-800/50 p-4 border border-gray-700">
          <div className="space-y-3">
            {Object.entries(monthlyData).map(([month, value]) => (
              <div key={month} className="flex items-center gap-2">
                <div className="w-10 text-sm font-medium text-gray-300">
                  {month}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-1">
                    <span className="text-xs text-gray-400">({value})</span>
                    <div className="text-xl leading-none">
                      {value > MAX_EMOJI_DISPLAY
                        ? `${"📚".repeat(MAX_EMOJI_DISPLAY)} +`
                        : "📚".repeat(value)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Second page: Reading Stats
export const ReadingStats = ({ data }) => {
  const months = [
    { name: "January", shortName: "Jan", key: "2024-01" },
    { name: "February", shortName: "Feb", key: "2024-02" },
    { name: "March", shortName: "Mar", key: "2024-03" },
    { name: "April", shortName: "Apr", key: "2024-04" },
    { name: "May", shortName: "May", key: "2024-05" },
    { name: "June", shortName: "Jun", key: "2024-06" },
    { name: "July", shortName: "Jul", key: "2024-07" },
    { name: "August", shortName: "Aug", key: "2024-08" },
    { name: "September", shortName: "Sep", key: "2024-09" },
    { name: "October", shortName: "Oct", key: "2024-10" },
    { name: "November", shortName: "Nov", key: "2024-11" },
    { name: "December", shortName: "Dec", key: "2024-12" },
  ];

  // Calculate books per month
  const monthlyBooks = months.reduce((acc, month) => {
    acc[month.name] = data.Reading_Patterns.books_per_month[month.key] || 0;
    return acc;
  }, {});

  // Calculate pages per month
  const monthlyPages = months.reduce((acc, month) => {
    const monthBooks = data["All Books Read"].filter((book) =>
      book.date_read.startsWith(month.key)
    );
    acc[month.name] = monthBooks.reduce((sum, book) => sum + book.pages, 0);
    return acc;
  }, {});

  // Get top 3 months by books
  const topMonthsByBooks = Object.entries(monthlyBooks)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([month, count]) => ({
      name: month,
      count: count,
    }));

  // Get top 3 months by pages
  const topMonthsByPages = Object.entries(monthlyPages)
    .filter(([_, pages]) => pages > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([month, pages]) => ({
      name: month,
      pages: pages,
    }));

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg space-y-4">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100">
            Some of your milestones
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Life's a marathon, not a race.
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Although marathons <em>are</em> races? Anyway:
          </p>
        </div>
        <div className="rounded-lg bg-green-950/50 p-4 border border-green-900/30">
          <h3 className="text-sm font-medium text-green-300">Total Progress</h3>
          <p className="mt-1 text-sm text-gray-200">
            {data.Basic_Statistics.total_books} books or{" "}
            {data.Basic_Statistics.total_pages.toLocaleString()} pages 😮
          </p>
        </div>

        <div className="rounded-lg bg-blue-950/50 p-4 border border-blue-900/30">
          <h3 className="text-sm font-medium text-blue-300">
            Your most active months were
          </h3>
          <p className="mt-1 text-sm text-gray-200">
            {topMonthsByBooks.map((month, index) => (
              <span key={month.name}>
                {index === topMonthsByBooks.length - 1 ? (
                  <span>
                    and {month.name} ({month.count} book
                    {month.count !== 1 ? "s" : ""})
                  </span>
                ) : (
                  <span>
                    {month.name} ({month.count} book
                    {month.count !== 1 ? "s" : ""})
                    {index < topMonthsByBooks.length - 2 ? ", " : " "}
                  </span>
                )}
              </span>
            ))}{" "}
            🔥
          </p>
        </div>

        <div className="rounded-lg bg-indigo-950/50 p-4 border border-indigo-900/30">
          <h3 className="text-sm font-medium text-indigo-300">
            You read the most pages in
          </h3>
          <p className="mt-1 text-sm text-gray-200">
            {topMonthsByPages.map((month, index) => (
              <span key={month.name}>
                {index === topMonthsByPages.length - 1 ? (
                  <span>
                    and {month.name} ({month.pages.toLocaleString()} pages)
                  </span>
                ) : (
                  <span>
                    {month.name} ({month.pages.toLocaleString()} pages)
                    {index < topMonthsByPages.length - 2 ? ", " : " "}
                  </span>
                )}
              </span>
            ))}{" "}
            📑
          </p>
        </div>

        <div className="rounded-lg bg-purple-950/50 p-4 border border-purple-900/30">
          <h3 className="text-sm font-medium text-purple-300">
            Your reading pace
          </h3>
          <p className="mt-1 text-sm text-gray-200">
            On average, it took you approximately{" "}
            {Math.round(data.Reading_Patterns.average_days_to_finish)} days to
            finish a book ⏱️
          </p>
        </div>
      </div>
    </div>
  );
};

const ReadingJourney = { ReadingProgress, ReadingStats };
export default ReadingJourney;
