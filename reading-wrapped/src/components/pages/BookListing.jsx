import React from "react";
import { Star } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import bookNotFound from "@/components/images/book_not_found.jpeg";

const BookListing = ({ data, sortOrder = "desc", maxBooks = 5 }) => {
  const sortedBooks = [...data["All Books Read"]]
    .sort((a, b) =>
      sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating
    )
    .slice(0, maxBooks);

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

  if (sortedBooks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No books read yet. Time to start your reading journey!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedBooks.map((book, index) => (
        <div
          key={`${book.title}-${index}`}
          className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          {/* Book Cover with Fallback */}
          <div className="self-center sm:self-start">
            <img
              src={book.cover_url || bookNotFound}
              alt={`Cover of ${book.title}`}
              className="w-24 h-36 object-cover rounded-md shadow-sm"
            />
          </div>

          {/* Book Details */}
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
                <p className="text-sm text-gray-500 mt-1">{book.pages} pages</p>
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
      ))}
    </div>
  );
};

export default BookListing;
