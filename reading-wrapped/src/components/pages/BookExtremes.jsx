import React from "react";
import { Star, ArrowUp, ArrowDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import bookNotFound from "@/components/media/book_not_found.jpeg";

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
    <div className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200">
      {/* Book Cover */}
      <img
        src={book.cover_url || bookNotFound}
        alt={`Cover of ${book.title}`}
        className="w-20 h-28 object-cover rounded-md shadow-sm flex-shrink-0"
      />

      {/* Book Details */}
      <div className="flex flex-col items-start gap-1">
        {/* Book Type Indicator */}
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          {type === "longest" ? (
            <>
              <ArrowUp className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600">Longest Book</span>
            </>
          ) : (
            <>
              <ArrowDown className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Shortest Book</span>
            </>
          )}
          <span className="text-gray-600">• {book.pages} pages</span>
        </div>

        <h3 className="font-medium text-gray-900 text-base">{book.title}</h3>
        <p className="text-sm text-gray-600">by {book.author}</p>
        <div className="flex items-center gap-2">
          <RatingStars rating={book.rating} />
        </div>
        {book.review && (
          <Popover>
            <PopoverTrigger className="text-sm text-blue-600 hover:text-blue-800">
              Read review
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Review</h4>
                <div className="max-h-48 overflow-y-auto">
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
          {pageDifference} pages!
        </p>
      </div>

      {/* Books Display */}
      <div className="space-y-4">
        <BookCard book={longest_book} type="longest" />
        <BookCard book={shortest_book} type="shortest" />
      </div>
    </div>
  );
};

export default BookExtremes;
