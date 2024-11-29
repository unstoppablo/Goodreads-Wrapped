import React from "react";
import { Star } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import bookNotFound from "@/components/media/book_not_found.jpeg";

const BookListing = ({ data, sortOrder = "desc", maxBooks = 3 }) => {
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

  return (
    <div className="space-y-3">
      {sortedBooks.map((book, index) => (
        <div
          key={`${book.title}-${index}`}
          className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          {/* Book Cover */}
          <img
            src={book.cover_url || bookNotFound}
            alt={`Cover of ${book.title}`}
            className="w-20 h-28 object-cover rounded-md shadow-sm flex-shrink-0"
          />

          {/* Book Details - Using justify-between for even spacing */}
          <div className="flex flex-col items-start justify-between h-28">
            <h3 className="font-medium text-gray-900 text-base">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <div className="flex items-center gap-2">
              <RatingStars rating={book.rating} />
              <span className="text-sm text-gray-500">{book.pages} pgs</span>
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
      ))}
    </div>
  );
};

export default BookListing;
