import pandas as pd
from datetime import datetime
import numpy as np
import re
import json
from typing import Dict,Optional
import time
import requests
import math
import aiohttp
import asyncio
import ssl
import urllib

async def check_image_size(url: str, session: aiohttp.ClientSession, ssl_context) -> bool:
    """
    Check if an image URL returns a valid-sized image (> 1KB)
    """
    try:
        async with session.head(url, timeout=5, ssl=ssl_context) as response:
            if response.status == 200:
                content_length = int(response.headers.get('content-length', 0))
                return content_length > 1000  # Minimum 1KB size
    except Exception as e:
        print(f"Error checking image size for {url}: {str(e)}")
    return False

async def get_book_cover_async(isbn: str, title: str, author: str, session: aiohttp.ClientSession) -> Optional[str]:
    """
    Asynchronously retrieve book cover URL using multiple APIs, with title fallback and size verification
    """
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    # First try by ISBN if available
    if isbn and not pd.isna(isbn):
        isbn = str(isbn).strip().replace('="', '').replace('"', '').replace('-', '').replace(' ', '')
        
        # Try Open Library API with small image size
        openlibrary_url = f"https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg"
        if await check_image_size(openlibrary_url, session, ssl_context):
            return openlibrary_url
        
        # Try Google Books API
        try:
            google_url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&fields=items(volumeInfo(imageLinks))"
            async with session.get(google_url, timeout=5, ssl=ssl_context) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get('items'):
                        image_links = data['items'][0].get('volumeInfo', {}).get('imageLinks', {})
                        for size in ['thumbnail', 'smallThumbnail']:  # Try both sizes, verify each
                            if size in image_links:
                                img_url = image_links[size].replace('http://', 'https://')
                                if await check_image_size(img_url, session, ssl_context):
                                    return img_url
        except Exception as e:
            print(f"Google Books error for ISBN {isbn}: {str(e)}")
    
    # If no cover found by ISBN, try by title + author
    if title and not pd.isna(title):
        title = title.strip()
        author = str(author).strip() if author and not pd.isna(author) else ""
        search_query = f"{title} {author}".strip()
        
        try:
            # Try Google Books API with title + author
            google_url = f"https://www.googleapis.com/books/v1/volumes?q={search_query}&fields=items(volumeInfo(imageLinks))"
            async with session.get(google_url, timeout=5, ssl=ssl_context) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get('items'):
                        image_links = data['items'][0].get('volumeInfo', {}).get('imageLinks', {})
                        for size in ['thumbnail', 'smallThumbnail']:
                            if size in image_links:
                                img_url = image_links[size].replace('http://', 'https://')
                                if await check_image_size(img_url, session, ssl_context):
                                    return img_url
        except Exception as e:
            print(f"Google Books error for title search '{search_query}': {str(e)}")
        
        try:
            # Try Open Library API with title search
            encoded_title = urllib.parse.quote(title)
            openlibrary_search_url = f"https://openlibrary.org/search.json?title={encoded_title}&fields=cover_i"
            async with session.get(openlibrary_search_url, timeout=5, ssl=ssl_context) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get('docs') and len(data['docs']) > 0 and data['docs'][0].get('cover_i'):
                        cover_id = data['docs'][0]['cover_i']
                        img_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                        if await check_image_size(img_url, session, ssl_context):
                            return img_url
        except Exception as e:
            print(f"Open Library error for title search '{title}': {str(e)}")
    
    return None

async def get_covers_batch(books: list[dict]) -> Dict[str, Optional[str]]:
    """
    Fetch multiple book covers concurrently and log results
    """
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    conn = aiohttp.TCPConnector(ssl=ssl_context)
    async with aiohttp.ClientSession(connector=conn) as session:
        tasks = []
        for book in books:
            if book:  # Only process non-None books
                tasks.append(get_book_cover_async(
                    isbn=book.get('isbn'),
                    title=book.get('title'),
                    author=book.get('author'),
                    session=session
                ))
            else:
                print(f"Skipping invalid book entry")
                tasks.append(None)
                
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        cover_urls = {}
        for book, result in zip(books, results):
            if not book:
                continue
                
            isbn = book.get('isbn')
            title = book.get('title')
            
            if isinstance(result, Exception):
                print(f"Error fetching cover for book '{title}' (ISBN: {isbn}): {str(result)}")
                cover_urls[isbn] = None
            elif result is None:
                print(f"No cover found for book '{title}' (ISBN: {isbn})")
                cover_urls[isbn] = None
            else:
                print(f"Successfully retrieved cover for book '{title}' (ISBN: {isbn}): {result}")
                cover_urls[isbn] = result
                
        print(f"\nSummary:")
        print(f"Total books processed: {len(books)}")
        print(f"Successful retrievals: {len([url for url in cover_urls.values() if url is not None])}")
        print(f"Failed retrievals: {len([url for url in cover_urls.values() if url is None])}")
        
        return cover_urls

class GoodreadsDataProcessor:
    def __init__(self, csv_path):
        self.df = pd.read_csv(csv_path)
        self._process_dates()
        
    def _process_dates(self):
        date_columns = ['Date Read', 'Date Added']
        for col in date_columns:
            self.df[col] = pd.to_datetime(self.df[col], format='%Y/%m/%d', errors='coerce')
    
    def _clean_title(self, title):
        """
        Clean book title by removing series information in parentheses
        Example: "Things Fall Apart (The African Trilogy, #1)" -> "Things Fall Apart"
        """
        if not isinstance(title, str):
            return title
            
        # Remove series information in parentheses, including nested parentheses
        cleaned_title = re.sub(r'\s*\([^)]*\)', '', title).strip()
        return cleaned_title
    
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


    def validate_goodreads_csv(self):
        """
        Validate Goodreads CSV file for required columns and basic data integrity
        
        Args:
            csv_path (str): Path to the CSV file
        
        Returns:
            dict: Validation results with status and error messages
        """
        try:
            
            # Required columns for basic processing
            required_columns = [
                'Title', 'Author', 'My Rating', 'Number of Pages', 
                'Date Read', 'Exclusive Shelf', 'ISBN', 
                'Year Published', 'My Review'
            ]
            
            # Check for required columns
            missing_columns = [col for col in required_columns if col not in self.df.columns]
            if missing_columns:
                return {
                    'status': False, 
                    'error': f'Missing required columns: {", ".join(missing_columns)}'
                }
            
            # Basic data integrity checks
            # Check if any rows exist
            if len(self.df) == 0:
                return {
                    'status': False, 
                    'error': 'CSV file is empty'
                }
            
            # Check for read books
            read_books = self.df[self.df['Exclusive Shelf'] == 'read']
            if len(read_books) == 0:
                return {
                    'status': False, 
                    'error': 'No books marked as "read" found'
                }
            
            # Date parsing check
            try:
                pd.to_datetime(self.df['Date Read'], format='%m/%d/%y', errors='raise')
            except:
                return {
                    'status': False, 
                    'error': 'Invalid date format in "Date Read" column'
                }
            
            return {
                'status': True,
                'total_books': len(self.df),
                'read_books': len(read_books)
            }
        
        except Exception as e:
            return {
                'status': False, 
                'error': f'Validation error: {str(e)}'
            }

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
            'title': self._clean_title(row['Title']),
            'author': row['Author'],
            'rating': row['My Rating'],
            'pages': row['Number of Pages'],
            'date_read': row['Date Read'].strftime('%Y-%m-%d')
        } for _, row in top_books.iterrows()]


    def get_all_books_read(self, start_date=None, end_date=None):
        """
        Get details for all books read in the specified period with concurrent cover fetching
        """
        df_period = self._filter_date_range(start_date, end_date)
        sorted_books = df_period.sort_values('Date Read', ascending=False)
        
        # Prepare books data for cover fetching
        books_data = []
        for _, row in sorted_books.iterrows():
            book = {
                'isbn': row['ISBN'] if pd.notna(row['ISBN']) else None,
                'title': self._clean_title(row['Title']) if pd.notna(row['Title']) else None,
                'author': row['Author'] if pd.notna(row['Author']) else None
            }
            books_data.append(book)
        
        # Fetch covers for all books
        cover_urls = asyncio.run(get_covers_batch(books_data))
        
        # Process all books with their covers
        processed_books = []
        for _, row in sorted_books.iterrows():
            isbn = row['ISBN'] if pd.notna(row['ISBN']) else None
            book_data = {
                'title': self._clean_title(row['Title']),
                'author': row['Author'],
                'rating': float(row['My Rating']) if row['My Rating'] > 0 else None,
                'pages': int(float(row['Number of Pages'])) if pd.notna(row['Number of Pages']) else None,
                'date_read': row['Date Read'].strftime('%Y-%m-%d'),
                'review': self._clean_review_text(row['My Review']) if pd.notna(row['My Review']) else None,
                'isbn': isbn,
                'year_published': int(row['Year Published']) if pd.notna(row['Year Published']) else None,
                'cover_url': cover_urls.get(isbn)
            }
            processed_books.append(book_data)
        
        return processed_books




    def _get_time_comparisons(self, hours):
        """
        Generate interesting time comparisons
        """
        taylor_song_avg = 3.5  # minutes per song
        baby_shark_length = 1.5  # minutes
        iss_orbit_time = 1.5  # hours per orbit


        return [
            f"Watching the entire Lord of the Rings trilogy {math.ceil(hours/11.4):,} times  💍",
            f"Binging all seasons of The Office (US) {math.ceil(hours/73):,} times 📎 ",
            f"Taking {math.ceil(hours/15):,} flights from New York to Los Angeles 🛫",
            f"Listening to Taylor Swift's entire discography {math.ceil(hours/(274 * taylor_song_avg / 60)):,} times 🎵",
            f"Playing 'Baby Shark' {math.ceil(hours*60/baby_shark_length):,} times 🦈",
            f"Watching the International Space Station orbit Earth {math.ceil(hours/iss_orbit_time):,} times 🚀"
        ]

    def _calculate_reading_pace(self, df_period):
        date_range = (df_period['Date Read'].max() - df_period['Date Read'].min()).days
        books_per_day = len(df_period) / date_range if date_range > 0 else 0
        average_days_per_book = 1 / books_per_day if books_per_day > 0 else 0
        return average_days_per_book

    def get_statistics(self, start_date=None, end_date=None):
        df_period = self._filter_date_range(start_date, end_date)
        
        print("Total rows in dataframe:", len(self.df))
        print("Date range:", start_date, "to", end_date)
        print("Books in period:", len(df_period))
        print("Sample of dates:", self.df['Date Read'].head())
        print("Sample of filtered dates:", df_period['Date Read'].head())
        
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
                    "title": self._clean_title(df_period.loc[df_period['Number of Pages'].idxmax(), 'Title']),
                    "author": df_period.loc[df_period['Number of Pages'].idxmax(), 'Author'],
                    "pages": int(df_period['Number of Pages'].max()),
                    "rating": float(df_period.loc[df_period['Number of Pages'].idxmax(), 'My Rating']),
                    "review": self._clean_review_text(df_period.loc[df_period['Number of Pages'].idxmax(), 'My Review'])
                },
                "shortest_book": {
                    "title": self._clean_title(df_period.loc[df_period['Number of Pages'].idxmin(), 'Title']),
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
    start_time = time.time()
    
    print("Starting Goodreads data processing...")
    processor = GoodreadsDataProcessor('goodreads_library_export.csv')
    print(f"Processor initialization took: {time.time() - start_time:.2f} seconds")
    
    stats_start = time.time()
    stats = processor.get_statistics(
        start_date='2024-01-01',
        end_date='2024-12-31'
    )
    print(f"Statistics generation took: {time.time() - stats_start:.2f} seconds")
    
    export_start = time.time()
    export_to_json(stats, 'reading_stats_2024.json')
    print(f"JSON export took: {time.time() - export_start:.2f} seconds")
    
    print(f"\nTotal execution time: {time.time() - start_time:.2f} seconds")