import pandas as pd
from datetime import datetime
import numpy as np
import re
import json
from typing import Dict, List, Any, Optional
from collections import defaultdict
import time
import requests

def get_book_cover(isbn: str) -> Optional[str]:
    """
    Retrieve book cover URL using multiple APIs, trying them in order until success.
    """
    if not isbn or pd.isna(isbn):
        return None
        
    # Clean ISBN - remove hyphens and spaces
    isbn = str(isbn).replace('-', '').replace(' ', '')
    
    # 1. Try Open Library API first
    openlibrary_url = f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
    
    try:
        response = requests.head(openlibrary_url)
        if response.status_code == 200 and int(response.headers.get('content-length', 0)) > 1000:
            return openlibrary_url
    except:
        pass
    
    # 2. Try Google Books API as fallback
    try:
        google_url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"
        response = requests.get(google_url)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('items'):
                image_links = data['items'][0].get('volumeInfo', {}).get('imageLinks', {})
                for size in ['thumbnail', 'smallThumbnail']:
                    if size in image_links:
                        return image_links[size]
    except:
        pass
    
    return None



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

    def get_monthly_rating_distribution(self, start_date=None, end_date=None):
        """
        Get rating distribution per month
        Returns: Dictionary with months as keys and rating distributions as values
        """
        df_period = self._filter_date_range(start_date, end_date)
        
        # Group by year, month, and rating
        monthly_ratings = df_period.groupby([
            df_period['Date Read'].dt.year,
            df_period['Date Read'].dt.month,
            'My Rating'
        ]).size().unstack(fill_value=0)
        
        # Calculate average rating per month
        monthly_avg_ratings = df_period.groupby([
            df_period['Date Read'].dt.year,
            df_period['Date Read'].dt.month
        ])['My Rating'].mean()
        
        # Format the results
        formatted_ratings = {}
        for (year, month) in monthly_ratings.index:
            month_name = datetime(year, month, 1).strftime('%Y-%m')
            formatted_ratings[month_name] = {
                'distribution': monthly_ratings.loc[(year, month)].to_dict(),
                'average': monthly_avg_ratings.loc[(year, month)]
            }
            
        return formatted_ratings

    def get_top_books_summary(self, start_date=None, end_date=None, n=5):
        """
        Get top n books based on rating
        Returns: List of dictionaries containing book details
        """
        df_period = self._filter_date_range(start_date, end_date)
        
        # Sort by rating (descending) and then by page count (descending) for ties
        top_books = df_period.sort_values(
            ['My Rating', 'Number of Pages'],
            ascending=[False, False]
        ).head(n)
        
        return [{
            'title': row['Title'],
            'author': row['Author'],
            'rating': row['My Rating'],
            'pages': row['Number of Pages'],
            'date_read': row['Date Read'].strftime('%Y-%m-%d')
        } for _, row in top_books.iterrows()]

    def get_all_books_read(self, start_date=None, end_date=None):
        """
        Get details for all books read in the specified period
        Returns: List of dictionaries containing book details
        """
        df_period = self._filter_date_range(start_date, end_date)
        
        # Sort by date read (descending)
        sorted_books = df_period.sort_values('Date Read', ascending=False)
        
        processed_books = []
        for _, row in sorted_books.iterrows():
            # Fetch cover URL with rate limiting
            cover_url = get_book_cover(row['ISBN'] if pd.notna(row['ISBN']) else None)
            
            book_data = {
                'title': row['Title'],
                'author': row['Author'],
                'rating': float(row['My Rating']) if row['My Rating'] > 0 else None,
                'pages': int(row['Number of Pages']) if pd.notna(row['Number of Pages']) else None,
                'date_read': row['Date Read'].strftime('%Y-%m-%d'),
                'review': self._clean_review_text(row['My Review']) if pd.notna(row['My Review']) else None,
                'isbn': row['ISBN'] if pd.notna(row['ISBN']) else None,
                'year_published': int(row['Year Published']) if pd.notna(row['Year Published']) else None,
                'cover_url': cover_url
            }
            processed_books.append(book_data)
            
            # Add delay between API calls to avoid rate limiting
            time.sleep(0.5)
            
        return processed_books



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

    def _calculate_reading_pace(self, df_period):
        date_range = (df_period['Date Read'].max() - df_period['Date Read'].min()).days
        books_per_day = len(df_period) / date_range if date_range > 0 else 0
        average_days_per_book = 1 / books_per_day if books_per_day > 0 else 0
        return average_days_per_book

    def get_statistics(self, start_date=None, end_date=None):
        """Get all statistics for the specified date range"""
        df_period = self._filter_date_range(start_date, end_date)
        
        if len(df_period) == 0:
            return "No books found in the specified date range."

        # Calculate reading hours
        reading_hours = (df_period['Number of Pages'].sum() * 2.5) / 60  # Assuming 2.5 mins per page
        reading_days = reading_hours / 24  

        # Convert books_per_month Period objects to strings
        books_per_month = (
            df_period['Date Read']
            .dt.to_period('M')
            .value_counts()
            .sort_index()
            .apply(lambda x: int(x))  # Convert count to int
            .to_dict()
        )
        
        # Convert Period index to string
        books_per_month = {str(k): v for k, v in books_per_month.items()}

        stats = {
            "Time_Period": {
                "start": start_date,
                "end": end_date
            },
            
            "Basic_Statistics": {
                "total_books": len(df_period),
                "total_pages": int(df_period['Number of Pages'].sum()),
                "estimated_words": int(df_period['Number of Pages'].sum() * 250),
                "estimated_hours": float(reading_hours),
                "estimated_days": float(reading_days)
            },
            
            "Rating_Statistics": {
                "average_rating": float(df_period['My Rating'].mean()),
                "rating_distribution": {str(k): int(v) for k, v in df_period['My Rating'].value_counts().sort_index().to_dict().items()}
            },
            
            "Reading_Patterns": {
                "books_per_month": books_per_month,
                "average_days_to_finish": float(self._calculate_reading_pace(df_period))
            },
            
            "Time_Comparisons": self._get_time_comparisons(reading_hours),
            
            "Book_Extremes": {
                "longest_book": {
                    "title": df_period.loc[df_period['Number of Pages'].idxmax(), 'Title'],
                    "author": df_period.loc[df_period['Number of Pages'].idxmax(), 'Author'],
                    "pages": int(df_period['Number of Pages'].max()),
                    "rating": float(df_period.loc[df_period['Number of Pages'].idxmax(), 'My Rating']),
                    "review": self._clean_review_text(df_period.loc[df_period['Number of Pages'].idxmax(), 'My Review'])
                },
                "shortest_book": {
                    "title": df_period.loc[df_period['Number of Pages'].idxmin(), 'Title'],
                    "author": df_period.loc[df_period['Number of Pages'].idxmin(), 'Author'],
                    "pages": int(df_period['Number of Pages'].min()),
                    "rating": float(df_period.loc[df_period['Number of Pages'].idxmin(), 'My Rating']),
                    "review": self._clean_review_text(df_period.loc[df_period['Number of Pages'].idxmin(), 'My Review'])
                }
            }
        }
        
        # Update highest and lowest rated to include cleaned reviews
        high_rated = df_period[df_period['My Rating'] == df_period['My Rating'].max()]
        low_rated = df_period[df_period['My Rating'] == df_period['My Rating'].min()]
        
        stats["Highest and Lowest Rated"] = {
            "highest_rated": [{
                'Title': row['Title'],
                'Author': row['Author'],
                'My Rating': float(row['My Rating']),
                'My Review': self._clean_review_text(row['My Review'])
            } for _, row in high_rated.iterrows()],
            
            "lowest_rated": [{
                'Title': row['Title'],
                'Author': row['Author'],
                'My Rating': float(row['My Rating']),
                'My Review': self._clean_review_text(row['My Review'])
            } for _, row in low_rated.iterrows()]
        }

        stats.update({
            "Monthly Rating Distribution": self.get_monthly_rating_distribution(start_date, end_date),
            "Top Books Summary": self.get_top_books_summary(start_date, end_date),
            "All Books Read": self.get_all_books_read(start_date, end_date)  # New section added
        })
        
        return stats
    

def export_to_json(stats: Dict, output_path: str,):
    """
    Export statistics to a JSON file
    Returns the stats dictionary for immediate use if needed
    """
    stats = stats

    # Convert any numpy/pandas types to native Python types for JSON serialization
    def convert_to_native_types(obj):
        if isinstance(obj, (np.integer, np.floating)):
            return float(obj)
        elif isinstance(obj, pd.Period):
            return str(obj)
        elif isinstance(obj, dict):
            return {key: convert_to_native_types(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [convert_to_native_types(item) for item in obj]
        return obj

    serializable_stats = convert_to_native_types(stats)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(serializable_stats, f, ensure_ascii=False, indent=2)

    return serializable_stats

if __name__ == "__main__":
    processor = GoodreadsDataProcessor('goodreads_library_export.csv')
    
    stats = processor.get_statistics(
        start_date='2024-01-01',
        end_date='2024-12-31'
    )

    export_to_json(stats, 'reading_stats_2024.json')