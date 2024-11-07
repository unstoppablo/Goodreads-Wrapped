import pandas as pd
from datetime import datetime
import numpy as np
import re

class GoodreadsDataProcessor:
    def __init__(self, csv_path):
        """Initialize with path to CSV file"""
        self.df = pd.read_csv(csv_path)
        self._process_dates()
        
    def _process_dates(self):
        """Convert date strings to datetime objects"""
        date_columns = ['Date Read', 'Date Added']
        for col in date_columns:
            self.df[col] = pd.to_datetime(self.df[col], format='%m/%d/%y', errors='coerce')
        
    def _filter_date_range(self, start_date=None, end_date=None):
        """
        Filter dataframe for specified date range based on 'Date Read'
        If no dates specified, returns all read books
        """
        # Start with books marked as 'read'
        mask = self.df['Exclusive Shelf'] == 'read'
        
        if start_date:
            mask &= self.df['Date Read'] >= pd.to_datetime(start_date)
        if end_date:
            mask &= self.df['Date Read'] <= pd.to_datetime(end_date)
            
        return self.df[mask].copy()

    def _clean_review_text(self, review, max_length=500):
        """
        Clean review text:
        - Truncate to max_length
        - Censor swear words
        - Add ellipsis if truncated
        """
        if not isinstance(review, str):
            return ""
            
        # Dictionary of swear words and their censored versions
        swear_words = {
            'fuck': 'fu@@',
            'fucking': 'fu@@ing',
            'shit': 'sh!t',
            'damn': 'd@mn',
            'ass': '@ss'
        }
        
        # Truncate text
        if len(review) > max_length:
            review = review[:max_length] + "..."
            
        # Replace swear words (case insensitive)
        for word, replacement in swear_words.items():
            review = re.sub(re.compile(word, re.IGNORECASE), replacement, review)
            
        return review

    def _get_time_comparisons(self, hours):
        """
        Generate interesting time comparisons
        """
        avg_marathon_pace = 4.5  # hours for average marathon completion
        taylor_song_avg = 3.5  # minutes per song
        baby_shark_length = 1.5  # minutes
        iss_orbit_time = 1.5  # hours per orbit
        beaver_dam_time = 20  # hours per dam

        return [
            f"Watching the entire Lord of the Rings trilogy {hours/11.4:.1f} times (precious!)",
            f"Binging all seasons of The Office (US) {hours/73:.1f} times!",
            f"Taking {hours/15:.1f} flights from NY to LA <airplane emoji>",
            f"Listening to Taylor Swift's entire discography {hours/(274 * taylor_song_avg / 60):.1f} times (we're never ever getting that time back!)",
            f"Playing 'Baby Shark' {hours*60/baby_shark_length:.1f} times (doo doo doo doo doo doo... sorry!)",
            f"The International Space Station could orbit Earth {hours/iss_orbit_time:.1f} times (assuming its not flat <emoji here of eyes>)",
            f"Running {hours/(avg_marathon_pace):.1f} marathons at an average pace of {avg_marathon_pace} hours (no couch potatoes here!)",
            f"A beaver could build {hours/beaver_dam_time:.1f} dams (damn!)"
        ]

    def get_statistics(self, start_date=None, end_date=None):
        """Get all statistics for the specified date range"""
        df_period = self._filter_date_range(start_date, end_date)
        
        if len(df_period) == 0:
            return "No books found in the specified date range."

        # Calculate reading hours
        reading_hours = (df_period['Number of Pages'].sum() * 2.5) / 60  # Assuming 2.5 mins per page
        reading_days = reading_hours / 24  

        stats = {
            "Time Period": {
                "start": start_date,
                "end": end_date
            },
            
            "Basic Statistics": {
                "total_books": len(df_period),
                "total_pages": df_period['Number of Pages'].sum(),
                "estimated_words": df_period['Number of Pages'].sum() * 250,
                "estimated_hours": reading_hours,
                "estimated_days": reading_days 
            },
            
            "Rating Statistics": {
                "average_rating": df_period['My Rating'].mean(),
                "rating_distribution": df_period['My Rating'].value_counts().sort_index().to_dict()
            },
            
            "Reading Patterns": {
                "books_per_month": df_period['Date Read'].dt.to_period('M').value_counts().sort_index().to_dict(),
                "average_days_to_finish": (df_period['Date Read'] - df_period['Date Added']).dt.days.mean()
            },
            
            "Time Comparisons": self._get_time_comparisons(reading_hours),
            
            "Book Extremes": {
                "longest_book": {
                    "title": df_period.loc[df_period['Number of Pages'].idxmax(), 'Title'],
                    "author": df_period.loc[df_period['Number of Pages'].idxmax(), 'Author'],
                    "pages": df_period['Number of Pages'].max(),
                    "rating": df_period.loc[df_period['Number of Pages'].idxmax(), 'My Rating'],
                    "review": self._clean_review_text(df_period.loc[df_period['Number of Pages'].idxmax(), 'My Review'])
                },
                "shortest_book": {
                    "title": df_period.loc[df_period['Number of Pages'].idxmin(), 'Title'],
                    "author": df_period.loc[df_period['Number of Pages'].idxmin(), 'Author'],
                    "pages": df_period['Number of Pages'].min(),
                    "rating": df_period.loc[df_period['Number of Pages'].idxmin(), 'My Rating'],
                    "review": self._clean_review_text(df_period.loc[df_period['Number of Pages'].idxmin(), 'My Review'])
                }
            },
        }
        
        # Update highest and lowest rated to include cleaned reviews
        high_rated = df_period[df_period['My Rating'] == df_period['My Rating'].max()]
        low_rated = df_period[df_period['My Rating'] == df_period['My Rating'].min()]
        
        stats["Highest and Lowest Rated"] = {
            "highest_rated": [{
                'Title': row['Title'],
                'Author': row['Author'],
                'My Rating': row['My Rating'],
                'My Review': self._clean_review_text(row['My Review'])
            } for _, row in high_rated.iterrows()],
            
            "lowest_rated": [{
                'Title': row['Title'],
                'Author': row['Author'],
                'My Rating': row['My Rating'],
                'My Review': self._clean_review_text(row['My Review'])
            } for _, row in low_rated.iterrows()]
        }
        
        return stats

def print_statistics(stats):
   """Pretty print the statistics"""
   if isinstance(stats, str):
       print(stats)
       return

   print("\n=== READING STATISTICS ===")
   print(f"\nTime Period: {stats['Time Period']['start']} to {stats['Time Period']['end']}")
   
   print("\n=== BASIC STATISTICS ===")
   basic = stats['Basic Statistics']
   print(f"Total Books Read: {basic['total_books']}")
   print(f"Total Pages: {basic['total_pages']:,}")  # Added comma separator here too for consistency
   print(f"Estimated Words: {basic['estimated_words']:,}")
   print(f"Estimated Reading Time: {basic['estimated_hours']:,.1f} hours ({basic['estimated_days']:.1f} days)")
   
   print("\n=== RATING STATISTICS ===")
   rating_stats = stats['Rating Statistics']
   print(f"Average Rating: {rating_stats['average_rating']:.2f}")
   print("\nRating Distribution:")
   for rating, count in rating_stats['rating_distribution'].items():
       print(f"  {rating} stars: {count} book(s)")
   
   print("\n=== READING PATTERNS ===")
   patterns = stats['Reading Patterns']
   print(f"Average Days to Finish a Book: {patterns['average_days_to_finish']:.1f}")
   print("\nBooks Read per Month:")
   for month, count in patterns['books_per_month'].items():
       print(f"  {month}: {count} book(s)")
       
   print("\n=== TIME COMPARISONS ===")
   for comparison in stats['Time Comparisons']:
       print(f"• {comparison}")
   
   print("\n=== LONGEST AND SHORTEST BOOKS ===")
   longest = stats['Book Extremes']['longest_book']
   shortest = stats['Book Extremes']['shortest_book']
   print(f"Longest: {longest['title']} by {longest['author']}")
   print(f"  • {longest['pages']:,} pages")  # Added comma separator here too
   print(f"  • Rating: {longest['rating']}/5")
   if longest['review']:
       print(f"  • Review: {longest['review']}")
       
   print(f"\nShortest: {shortest['title']} by {shortest['author']}")
   print(f"  • {shortest['pages']:,} pages")  # Added comma separator here too
   print(f"  • Rating: {shortest['rating']}/5")
   if shortest['review']:
       print(f"  • Review: {shortest['review']}")
   
   print("\n=== HIGHEST AND LOWEST RATED BOOKS ===")
   print("\nHighest Rated:")
   for book in stats['Highest and Lowest Rated']['highest_rated']:
       print(f"• {book['Title']} by {book['Author']} ({book['My Rating']} stars)")
       if book['My Review']:
           print(f"  Review: {book['My Review']}")
   
   print("\nLowest Rated:")
   for book in stats['Highest and Lowest Rated']['lowest_rated']:
       print(f"• {book['Title']} by {book['Author']} ({book['My Rating']} stars)")
       if book['My Review']:
           print(f"  Review: {book['My Review']}")


# Example usage remains the same...
# Example usage:
if __name__ == "__main__":
    # Initialize processor
    processor = GoodreadsDataProcessor('goodreads_library_export.csv')
    
    # Get statistics for 2024
    stats_2024 = processor.get_statistics(
        start_date='2024-01-01',
        end_date='2024-12-31'
    )
    
    # Print statistics
    print_statistics(stats_2024)
    
    # You could also get statistics for any other time period, for example:
    # Last 5 years
    # stats_5years = processor.get_statistics(
    #     start_date='2019-01-01',
    #     end_date='2024-12-31'
    # )
    
    # Specific month
    # stats_january = processor.get_statistics(
    #     start_date='2024-01-01',
    #     end_date='2024-01-31'
    # )