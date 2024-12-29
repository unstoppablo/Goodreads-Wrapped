import React from "react";

const SummaryStats = ({ data }) => {
  // Get top rated books with titles and authors
  const topBooks = [...data["All Books Read"]]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Get top rated books' cover (first 5-star book or first book)
  const featuredBookCover =
    data["All Books Read"].find((book) => book.rating === 5)?.cover_url ||
    data["All Books Read"][0]?.cover_url ||
    "/api/placeholder/400/600";

  return (
    <div className="w-full p-4">
      {/* Featured Book Cover - Centered and Spanning Full Width */}
      <div className="flex justify-center mb-4">
        <img
          src={featuredBookCover}
          alt="Featured Book Cover"
          className="max-h-[400px] object-contain rounded-lg shadow-md"
        />
      </div>

      {/* Centered Stats Container */}
      <div className="flex justify-center ml-5">
        <div className="grid grid-cols-2 gap-4 w-fit">
          {/* Top Books Column */}
          <div className="flex flex-col text-left">
            <h3 className="text-lg font-semibold mb-2 text-left">Top Books</h3>
            {topBooks.map((book, index) => (
              <div key={index} className="mb-1 text-left">
                <span className="font-bold">{index + 1}</span> | {book.title}
              </div>
            ))}
          </div>

          {/* Top Authors Column */}
          <div className="flex flex-col text-left">
            <h3 className="text-lg font-semibold mb-2 text-left">
              Top Authors
            </h3>
            {topBooks.map((book, index) => (
              <div key={index} className="mb-1 text-left">
                <span className="font-bold">{index + 1}</span> | {book.author}
              </div>
            ))}
          </div>

          {/* Books Read Column */}
          <div className="flex flex-col text-left">
            <h3 className="text-lg font-semibold mb-2 text-left">Books Read</h3>
            <div className="text-left">{data.Basic_Statistics.total_books}</div>
          </div>

          {/* Pages Turned Column */}
          <div className="flex flex-col text-left">
            <h3 className="text-lg font-semibold mb-2 text-left">
              Pages Turned
            </h3>
            <div className="text-left">
              {data.Basic_Statistics.total_pages.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
