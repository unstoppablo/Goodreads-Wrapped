import React from "react";
import bookNotFound from "@/components/images/book_not_found.jpeg";

const SummaryStats = ({ data }) => {
  // Get the favorite book (first 5-star book)
  const favoriteBook =
    data["All Books Read"].find((book) => book.rating === 5) ||
    data["All Books Read"][0];

  // Get top rated books sorted by rating
  const topBooks = [...data["All Books Read"]]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Favorite Book Cover */}
      <div className="flex flex-col items-center">
        <div className="w-48 h-72 mb-2">
          <img
            src={favoriteBook?.cover_url || bookNotFound}
            alt={`Cover of ${favoriteBook?.title}`}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <h3 className="text-base font-medium text-gray-900">
          {favoriteBook?.title}
        </h3>
        <p className="text-sm text-gray-600">{favoriteBook?.author}</p>
      </div>

      {/* Top Books List */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Your Highest Rated Books
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {/* Titles Column */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 pb-2 border-b">
              Title
            </p>
            {topBooks.map((book, index) => (
              <p
                key={index}
                className="text-sm text-gray-900 truncate"
                title={book.title}
              >
                {book.title}
              </p>
            ))}
          </div>

          {/* Pages Column */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 pb-2 border-b text-right">
              Pages
            </p>
            {topBooks.map((book, index) => (
              <p key={index} className="text-sm text-gray-900 text-right">
                {book.pages}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Books Read */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {data.Basic_Statistics.total_books}
          </p>
          <p className="text-sm text-gray-600">Books Read</p>
        </div>

        {/* Pages Read */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {data.Basic_Statistics.total_pages.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Pages Read</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
