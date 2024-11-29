import React from "react";
import { Star, StarHalf } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

// First page: Overall Ratings
export const RatingsOverview = ({ data }) => {
  const { average_rating, rating_distribution } = data.Rating_Statistics;
  const allBooks = data["All Books Read"];

  const getRatingMessage = (rating) => {
    if (rating >= 3.8) {
      return {
        message:
          "You have excellent taste in books! Your high average rating shows you're great at picking books you'll enjoy.",
        className: "bg-green-950/50 border border-green-900/30 text-green-200",
      };
    } else if (rating >= 3.2) {
      return {
        message:
          "You're a balanced reader who's not afraid to be critical. Your ratings show thoughtful consideration of each book.",
        className: "bg-blue-950/50 border border-blue-900/30 text-blue-200",
      };
    } else {
      return {
        message:
          "Looks like it's been a challenging reading year. Remember, being critical is good - it means you have high standards!",
        className:
          "bg-purple-950/50 border border-purple-900/30 text-purple-200",
      };
    }
  };

  const getBooksForRating = (targetRating) => {
    return allBooks.filter((book) => Number(book.rating) === targetRating);
  };

  const totalBooks = Object.values(rating_distribution).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Average Rating Card */}
        <div className="rounded-lg bg-gray-900/80 border border-gray-800 p-4 text-center">
          <div className="text-3xl font-bold text-gray-100 mb-2">
            ✨ {average_rating.toFixed(1)} ✨
          </div>
          <div className="text-sm text-gray-400">Average Book Rating</div>
        </div>

        {/* Rating Message */}
        <div
          className={`rounded-lg p-4 ${
            getRatingMessage(average_rating).className
          }`}
        >
          <p className="text-sm">{getRatingMessage(average_rating).message}</p>
        </div>

        {/* Rating Distribution */}
        <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
          <h3 className="text-base font-medium text-gray-100 mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = rating_distribution[rating] || 0;
              const percentage = ((count / totalBooks) * 100).toFixed(1);
              const books = getBooksForRating(rating);

              return (
                <Popover key={rating}>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <div className="w-24 text-sm">
                        <RatingStars rating={rating} />
                      </div>
                      <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-32 text-sm text-gray-300 text-right">
                        <span className="font-medium">{count}</span> book
                        {count !== 1 ? "s" : ""}
                        <span className="text-gray-500 ml-1">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 bg-gray-900 border-gray-700">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm mb-3 text-gray-100">
                        Books rated {rating} stars: {books.length}
                      </h4>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {books.length > 0 ? (
                          books.map((book, index) => (
                            <div
                              key={index}
                              className="text-sm border-b border-gray-800 last:border-0 pb-2 last:pb-0"
                            >
                              <div className="font-medium text-gray-200">
                                {book.title}
                              </div>
                              <div className="flex justify-between text-gray-400 text-xs">
                                <span>{book.author}</span>
                                <span>{book.pages} pages</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400">
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
      </div>
    </div>
  );
};

// Second page: Monthly Ratings
export const MonthlyRatings = ({ data }) => {
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

  // Find the highest rated month
  const getBestMonth = () => {
    let bestMonth = null;
    let highestRating = 0;

    months.forEach((month) => {
      const monthData = data["Monthly Rating Distribution"][month.key];
      if (monthData && monthData.average > highestRating) {
        highestRating = monthData.average;
        bestMonth = month;
      }
    });

    const monthMessages = {
      January: "Starting the year strong! 🎉",
      February: "Feeling the love for books! ❤️",
      March: "Springing forward with great reads! 🌸",
      April: "Showered with amazing books! 🌧️",
      May: "May the great books be with you! ⭐",
      June: "Kicking off summer with stellar reads! ☀️",
      July: "Heating up with hot reads! 🌞",
      August: "Ending summer on a high note! 🏖️",
      September: "Fall-ing for great books! 🍂",
      October: "Treating yourself to great reads! 🎃",
      November: "Giving thanks for good books! 🍁",
      December: "Ending the year with a bang! 🎄",
    };

    return bestMonth
      ? {
          name: bestMonth.name,
          rating: highestRating,
          message: monthMessages[bestMonth.name],
        }
      : null;
  };

  const bestMonth = getBestMonth();

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {bestMonth && (
          <div className="rounded-lg bg-blue-950/50 p-4 text-blue-300 border border-blue-900/30">
            <span className="block text-lg font-medium text-blue-200 mb-2">
              {bestMonth.message}
            </span>
            <span className="block text-sm">
              Your favorite reading month was{" "}
              <span className="text-base font-bold">{bestMonth.name}</span>,
              with an average rating of{" "}
              <span className="text-base font-bold">
                {bestMonth.rating.toFixed(1)}
              </span>
            </span>
          </div>
        )}

        <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
          <h3 className="text-base font-medium text-gray-100 mb-4">
            Average Rating per Month
          </h3>
          <div className="space-y-3">
            {months.map((month) => {
              const monthData = data["Monthly Rating Distribution"][month.key];
              const hasRating = monthData && monthData.average > 0;

              return (
                <div key={month.key} className="flex items-center gap-2">
                  <div className="w-12 text-sm font-medium text-gray-300">
                    {month.shortName}
                  </div>
                  {hasRating ? (
                    <>
                      <div className="w-14 text-sm text-gray-200 font-medium">
                        {monthData.average.toFixed(1)}
                      </div>
                      <div className="flex-1">
                        <RatingStars rating={monthData.average} />
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 text-sm text-gray-500">
                      No ratings yet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export with both components
const Ratings = { RatingsOverview, MonthlyRatings };
export default Ratings;
