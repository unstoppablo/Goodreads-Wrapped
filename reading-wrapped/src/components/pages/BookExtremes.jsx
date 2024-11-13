import React from "react";
import { Star, ArrowUp, ArrowDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import bookNotFound from "@/components/images/book_not_found.jpeg";

const BookExtremes = ({ data }) => {
  const { longest_book, shortest_book } = data.Book_Extremes;

  const RatingStars = ({ rating }) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const BookCard = ({ book, type }) => (
    <div className="flex-1 flex flex-col">
      {/* Title Card */}
      <div
        className={`rounded-lg p-4 mb-4 flex items-center gap-2 ${
          type === "longest"
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "bg-green-50 text-green-700 border border-green-200"
        }`}
      >
        {type === "longest" ? (
          <>
            <ArrowUp className="w-5 h-5" />
            <span>Longest Book</span>
          </>
        ) : (
          <>
            <ArrowDown className="w-5 h-5" />
            <span>Shortest Book</span>
          </>
        )}
        <span className="ml-auto font-medium">{book.pages} pages</span>
      </div>

      {/* Book Details */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 h-full">
        {/* Book Cover */}
        <div className="self-center sm:self-start">
          <img
            src={book.cover_url || bookNotFound}
            alt={`Cover of ${book.title}`}
            className="w-24 h-36 object-cover rounded-md shadow-sm"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 sm:gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium text-gray-900 break-words">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
            <div className="flex-shrink-0 text-center sm:text-right">
              <RatingStars rating={book.rating} />
            </div>
          </div>

          {book.review && (
            <Popover>
              <PopoverTrigger className="text-sm text-blue-600 hover:text-blue-800">
                Show review
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm mb-3">Review</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="text-sm text-gray-600">
                      {book.review.split("<br/>").map((paragraph, i) => (
                        <p key={i} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );

  const pageDifference = longest_book.pages - shortest_book.pages;

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
        <p className="text-gray-600">
          The difference between your longest and shortest book is
        </p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {pageDifference} pages
        </p>
      </div>

      {/* Books Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookCard book={longest_book} type="longest" />
        <BookCard book={shortest_book} type="shortest" />
      </div>
    </div>
  );
};

export default BookExtremes;
