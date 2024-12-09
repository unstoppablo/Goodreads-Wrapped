import React from "react";
import { Star, StarHalf } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Ratings = ({ data }) => {
  const { average_rating, rating_distribution } = data.Rating_Statistics;
  const allBooks = data["All Books Read"];

  const getRatingMessage = (rating) => {
    if (rating >= 3.8) {
      return {
        message:
          "You have excellent taste in books! Your high average rating shows you're great at picking books you'll enjoy.",
        className: "bg-green-50 text-green-700",
      };
    } else if (rating >= 3.2) {
      return {
        message:
          "You're a balanced reader who's not afraid to be critical. Your ratings show thoughtful consideration of each book.",
        className: "bg-blue-50 text-blue-700",
      };
    } else {
      return {
        message:
          "Looks like it's been a challenging reading year. Remember, being critical is good - it means you have high standards!",
        className: "bg-purple-50 text-purple-700",
      };
    }
  };

  const getBooksForRating = (targetRating) => {
    return allBooks.filter((book) => Number(book.rating) === targetRating);
  };

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="inline-block w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="inline-block w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      );
    }

    return <div className="flex gap-0.5 items-center">{stars}</div>;
  };

  const totalBooks = Object.values(rating_distribution).reduce(
    (a, b) => a + b,
    0
  );

  const allMonths = [
    { name: "Jan", key: "2024-01" },
    { name: "Feb", key: "2024-02" },
    { name: "Mar", key: "2024-03" },
    { name: "Apr", key: "2024-04" },
    { name: "May", key: "2024-05" },
    { name: "Jun", key: "2024-06" },
    { name: "Jul", key: "2024-07" },
    { name: "Aug", key: "2024-08" },
    { name: "Sep", key: "2024-09" },
    { name: "Oct", key: "2024-10" },
    { name: "Nov", key: "2024-11" },
    { name: "Dec", key: "2024-12" },
  ];

  return (
    <div className="space-y-6 px-2">
      {/* Average Rating Card */}
      <div className="rounded-lg bg-white border border-gray-200 p-4 text-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {average_rating.toFixed(1)}
        </div>
        <div className="text-sm text-gray-500">Average Rating</div>
      </div>

      {/* Rating Message */}
      <div
        className={`rounded-lg p-4 ${
          getRatingMessage(average_rating).className
        }`}
      >
        <p className="text-sm">{getRatingMessage(average_rating).message}</p>
      </div>

      {/* Rating Distribution Table */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Rating Distribution
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2].map((rating) => {
            const count = rating_distribution[rating] || 0;
            const percentage = ((count / totalBooks) * 100).toFixed(1);
            const books = getBooksForRating(rating);

            return (
              <Popover key={rating}>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-24 text-sm">
                      <RatingStars rating={rating} />
                    </div>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-32 text-sm text-gray-600 text-right">
                      <span className="font-medium">{count}</span> book
                      {count !== 1 ? "s" : ""}
                      <span className="text-gray-400 ml-1">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm mb-3">
                      Books rated {rating} stars: {books.length}
                    </h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {books.length > 0 ? (
                        books.map((book, index) => (
                          <div
                            key={index}
                            className="text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0"
                          >
                            <div className="font-medium">{book.title}</div>
                            <div className="flex justify-between text-gray-500 text-xs">
                              <span>{book.author}</span>
                              <span>{book.pages} pages</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">
                          No books found with this rating
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>

      {/* Monthly Ratings Trend section remains the same */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Average Rating per Month
        </h3>
        <div className="space-y-3">
          {allMonths.map(({ name, key }) => {
            const monthData = data["Monthly Rating Distribution"][key];
            const hasRating = monthData && monthData.average > 0;

            return (
              <div key={key} className="flex items-center gap-2">
                <div className="w-12 text-sm font-medium text-gray-700">
                  {name}
                </div>
                {hasRating ? (
                  <>
                    <div className="w-14 text-sm text-gray-900 font-medium">
                      {monthData.average.toFixed(1)}
                    </div>
                    <div className="flex-1">
                      <RatingStars rating={monthData.average} />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 text-sm text-gray-400">
                    No ratings yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Ratings;
