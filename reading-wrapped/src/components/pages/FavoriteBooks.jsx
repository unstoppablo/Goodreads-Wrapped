import React from "react";
import { Star } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TopBooks = ({ data }) => {
  // Get top 5 books by rating
  const topBooks = [...data["All Books Read"]]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

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

  return (
    <div className="space-y-4">
      {topBooks.map((book, index) => (
        <div
          key={`${book.title}-${index}`}
          className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          {/* Book Cover */}
          <div className="self-center sm:self-start">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={`Cover of ${book.title}`}
                className="w-24 h-36 object-cover rounded-md shadow-sm"
              />
            ) : (
              <div className="w-24 h-36 bg-gray-100 rounded-md shadow-sm flex items-center justify-center">
                <span className="text-gray-400 text-xs text-center px-2">
                  No cover available
                </span>
              </div>
            )}
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

export default TopBooks;
