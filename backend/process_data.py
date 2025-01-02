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
        print(f"\nChecking image size for: {url}")
        async with session.head(url, timeout=5, ssl=ssl_context) as response:
            print(f"Image check status: {response.status}")
            if response.status == 200:
                content_length = int(response.headers.get('content-length', 0))
                print(f"Image content length: {content_length}")
                return content_length > 1000  # Minimum 1KB size
            print(f"Image check failed with status: {response.status}")
    except Exception as e:
        print(f"Error checking image size for {url}: {str(e)}")
    return False

async def get_book_cover_async(isbn: str, title: str, author: str, session: aiohttp.ClientSession) -> Optional[str]:
    """
    Asynchronously retrieve book cover URL with improved error handling and fallbacks
    """
    print(f"\n{'='*50}")
    print(f"Starting cover search for: {title}")
    print(f"ISBN: {isbn}")
    print(f"Author: {author}")
    print(f"{'='*50}")

    # Configure timeout and SSL context
    timeout = aiohttp.ClientTimeout(total=10)
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    # Clean ISBN
    if isbn and not pd.isna(isbn):
        isbn = str(isbn).strip().replace('="', '').replace('"', '').replace('-', '').replace(' ', '')
        print(f"Cleaned ISBN: {isbn}")
    
    async def fetch_with_retry(url, max_retries=3):
        for attempt in range(max_retries):
            try:
                print(f"\nAttempt {attempt + 1}/{max_retries} for URL: {url}")
                async with session.get(url, timeout=timeout, ssl=ssl_context) as response:
                    status = response.status
                    print(f"Response status: {status}")
                    
                    if status == 200:
                        data = await response.json()
                        print(f"Success! First 200 chars of response: {str(data)[:200]}...")
                        return data
                    elif status == 429:
                        wait_time = 2 ** attempt
                        print(f"Rate limit (429) encountered. Waiting {wait_time} seconds...")
                        await asyncio.sleep(wait_time)
                        continue
                    elif status == 403:
                        print("Forbidden (403) - Likely API quota exceeded")
                        return None
                    else:
                        print(f"Unexpected status code: {status}")
                        if attempt < max_retries - 1:
                            print(f"Will retry in {attempt + 1} seconds...")
                            await asyncio.sleep(attempt + 1)
                        
            except asyncio.TimeoutError:
                print(f"Timeout on attempt {attempt + 1}")
            except Exception as e:
                print(f"Error on attempt {attempt + 1}: {str(e)}")
                print(f"Error type: {type(e)}")
            
            if attempt < max_retries - 1:
                print("Retrying...")
            else:
                print(f"All {max_retries} attempts failed")
        return None

    if isbn:
        # Try Google Books API first
        try:
            print("\nTrying Google Books API with ISBN...")
            google_url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&fields=items(volumeInfo(imageLinks))"
            print(f"Google Books URL: {google_url}")
            data = await fetch_with_retry(google_url)
            
            if data and data.get('items'):
                image_links = data['items'][0].get('volumeInfo', {}).get('imageLinks', {})
                if image_links:
                    cover_url = image_links.get('thumbnail', '').replace('http://', 'https://')
                    print(f"Found Google Books cover: {cover_url}")
                    if await check_image_size(cover_url, session, ssl_context):
                        print("Google Books cover validated successfully")
                        return cover_url
                    else:
                        print("Google Books cover failed size validation")
                else:
                    print("No image links found in Google Books response")
            else:
                print("No items found in Google Books response")
                
        except Exception as e:
            print(f"Google Books API error: {str(e)}")
            print(f"Error type: {type(e)}")

        # Try Open Library covers API
        try:
            print("\nTrying Open Library API with ISBN...")
            cover_url = f"https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg"
            print(f"Open Library URL: {cover_url}")
            
            async with session.head(cover_url, timeout=timeout, ssl=ssl_context) as response:
                print(f"Open Library response status: {response.status}")
                if response.status == 200:
                    content_length = int(response.headers.get('content-length', 0))
                    print(f"Content length: {content_length}")
                    if content_length > 1000:
                        print("Open Library cover validated successfully")
                        return cover_url
                    else:
                        print("Open Library cover too small (likely placeholder)")
                else:
                    print(f"Open Library request failed with status: {response.status}")
                    
        except Exception as e:
            print(f"Open Library API error: {str(e)}")
            print(f"Error type: {type(e)}")

    # If no ISBN or no cover found, try title search
    if title:
        try:
            print("\nTrying Google Books API with title search...")
            search_query = f"{title} {author}".strip() if author else title.strip()
            google_url = f"https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(search_query)}&fields=items(volumeInfo(imageLinks))"
            print(f"Search URL: {google_url}")
            
            data = await fetch_with_retry(google_url)
            if data and data.get('items'):
                image_links = data['items'][0].get('volumeInfo', {}).get('imageLinks', {})
                if image_links:
                    cover_url = image_links.get('thumbnail', '').replace('http://', 'https://')
                    print(f"Found cover via title search: {cover_url}")
                    if await check_image_size(cover_url, session, ssl_context):
                        print("Title search cover validated successfully")
                        return cover_url
                    else:
                        print("Title search cover failed size validation")
                else:
                    print("No image links found in title search response")
            else:
                print("No items found in title search response")
                
        except Exception as e:
            print(f"Title search error: {str(e)}")
            print(f"Error type: {type(e)}")

    print("\nNo cover found after trying all methods")
    return None

async def get_covers_batch(books: list[dict]) -> Dict[str, Optional[str]]:
    """
    Fetch multiple book covers concurrently and log results
    Returns a dictionary with book identifier (title + author) as key
    """
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    conn = aiohttp.TCPConnector(ssl=ssl_context)
    async with aiohttp.ClientSession(connector=conn) as session:
        tasks = []
        valid_books = []
        
        for book in books:
            if book and (book.get('isbn') or book.get('title')):
                tasks.append(get_book_cover_async(
                    isbn=book.get('isbn'),
                    title=book.get('title'),
                    author=book.get('author'),
                    session=session
                ))
                valid_books.append(book)
            else:
                print(f"Skipping invalid book entry (missing both ISBN and title)")
                
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        cover_urls = {}
        successful = 0
        failed = 0
        
        for book, result in zip(valid_books, results):
            # Create a unique identifier using title and author
            book_id = f"{book.get('title', '')}__{book.get('author', '')}"
            isbn = book.get('isbn')
            title = book.get('title', 'Unknown Title')
            
            if isinstance(result, Exception):
                print(f"Error fetching cover for book '{title}' (ISBN: {isbn}): {str(result)}")
                cover_urls[book_id] = None
                failed += 1
            elif result is None:
                print(f"No cover found for book '{title}' (ISBN: {isbn})")
                cover_urls[book_id] = None
                failed += 1
            else:
                print(f"Successfully retrieved cover for book '{title}' (ISBN: {isbn}): {result}")
                cover_urls[book_id] = result
                successful += 1
                
        print(f"\nSummary:")
        print(f"Total books processed: {len(valid_books)}")
        print(f"Successful retrievals: {successful}")
        print(f"Failed retrievals: {failed}")
        
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
            title = self._clean_title(row['Title'])
            author = row['Author']
            # Use the same book identifier as in get_covers_batch
            book_id = f"{title}__{author}"
            
            book_data = {
                'title': title,
                'author': author,
                'rating': float(row['My Rating']) if row['My Rating'] > 0 else None,
                'pages': int(float(row['Number of Pages'])) if pd.notna(row['Number of Pages']) else None,
                'date_read': row['Date Read'].strftime('%Y-%m-%d'),
                'review': self._clean_review_text(row['My Review']) if pd.notna(row['My Review']) else None,
                'isbn': row['ISBN'] if pd.notna(row['ISBN']) else None,
                'year_published': int(row['Year Published']) if pd.notna(row['Year Published']) else None,
                'cover_url': cover_urls.get(book_id)
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
        
        if len(df_period) == 0:
            return "No books found in the specified date range."

        # Get all books first (includes covers)
        all_books = self.get_all_books_read(start_date, end_date)
        # Create a mapping of title to cover URL
        cover_url_map = {book['title']: book['cover_url'] for book in all_books}

        # Rest of your existing stats calculations...
        reading_hours = (df_period['Number of Pages'].sum() * 2.5) / 60
        reading_days = reading_hours / 24
        
        # Convert books_per_month Period objects to strings
        books_per_month = (
            df_period['Date Read']
            .dt.to_period('M')
            .value_counts()
            .sort_index()
            .apply(lambda x: int(x))
            .to_dict()
        )
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
            
            # Update Book_Extremes to include cover URLs
            "Book_Extremes": {
                "longest_book": {
                    "title": self._clean_title(df_period.loc[df_period['Number of Pages'].idxmax(), 'Title']),
                    "author": df_period.loc[df_period['Number of Pages'].idxmax(), 'Author'],
                    "pages": int(df_period['Number of Pages'].max()),
                    "rating": float(df_period.loc[df_period['Number of Pages'].idxmax(), 'My Rating']),
                    "review": self._clean_review_text(df_period.loc[df_period['Number of Pages'].idxmax(), 'My Review']),
                    "cover_url": cover_url_map.get(self._clean_title(df_period.loc[df_period['Number of Pages'].idxmax(), 'Title']))
                },
                "shortest_book": {
                    "title": self._clean_title(df_period.loc[df_period['Number of Pages'].idxmin(), 'Title']),
                    "author": df_period.loc[df_period['Number of Pages'].idxmin(), 'Author'],
                    "pages": int(df_period['Number of Pages'].min()),
                    "rating": float(df_period.loc[df_period['Number of Pages'].idxmin(), 'My Rating']),
                    "review": self._clean_review_text(df_period.loc[df_period['Number of Pages'].idxmin(), 'My Review']),
                    "cover_url": cover_url_map.get(self._clean_title(df_period.loc[df_period['Number of Pages'].idxmin(), 'Title']))
                }
            }
        }

        # Update with high/low ratings
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

        # Add the remaining sections
        stats.update({
            "Monthly Rating Distribution": self.get_monthly_rating_distribution(start_date, end_date),
            "Top Books Summary": self.get_top_books_summary(start_date, end_date),
            "All Books Read": all_books  # Already includes cover URLs
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