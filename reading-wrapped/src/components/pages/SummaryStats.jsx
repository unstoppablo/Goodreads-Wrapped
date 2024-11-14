import React from "react";
import bookNotFound from "@/components/media/book_not_found.jpeg";

const SummaryStats = ({ data }) => {
  // Get the favorite book (first 5-star book)
  const favoriteBook =
    data["All Books Read"].find((book) => book.rating === 5) ||
    data["All Books Read"][0];

  // Get top rated books with titles and authors
  const topBooks = [...data["All Books Read"]]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-2 gap-6 auto-rows-min h-full">
      {/* Favorite Book Cover - spans full width at top */}
      <div className="col-span-2 flex justify-center">
        <img
          src={favoriteBook?.cover_url || bookNotFound}
          alt={`Cover of ${favoriteBook?.title}`}
          className="w-48 h-72 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Top Books List */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 h-full">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">
          HIGHEST RATED
        </h3>
        <ul className="space-y-3">
          {topBooks.map((book, index) => (
            <li
              key={index}
              className="text-base text-gray-900 truncate"
              title={book.title}
            >
              {book.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Authors List */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 h-full">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">AUTHORS</h3>
        <ul className="space-y-3">
          {topBooks.map((book, index) => (
            <li
              key={index}
              className="text-base text-gray-900 truncate"
              title={book.author}
            >
              {book.author}
            </li>
          ))}
        </ul>
      </div>

      {/* Books Read */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <p className="text-sm font-semibold text-gray-500 mb-2">BOOKS READ</p>
        <p className="text-3xl font-bold text-gray-900">
          {data.Basic_Statistics.total_books}
        </p>
      </div>

      {/* Pages Read */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <p className="text-sm font-semibold text-gray-500 mb-2">PAGES TURNED</p>
        <p className="text-3xl font-bold text-gray-900">
          {data.Basic_Statistics.total_pages.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SummaryStats;
