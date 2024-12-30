import requests
import os
import concurrent.futures
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Alternative cover sources if Open Library fails
COVER_SOURCES = [
    "https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg",
    "https://covers.openlibrary.org/b/isbn/{isbn}-S.jpg",
    "https://openlibrary.org/works/{olid}/cover.jpg"
]

def find_book_details(book):
    """
    Find book details using Open Library Search API.
    
    Args:
        book (str): Book title or ISBN
    
    Returns:
        dict: Book details including ISBN and Open Library ID
    """
    try:
        # Determine if input is ISBN or title
        if book.replace('-', '').isdigit():
            # If it's an ISBN, use ISBN search
            search_url = f"https://openlibrary.org/search.json?isbn={book.replace('-', '')}"
        else:
            # If it's a title, use title search
            encoded_title = requests.utils.quote(book)
            search_url = f"https://openlibrary.org/search.json?title={encoded_title}"
        
        response = requests.get(search_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('docs'):
                first_doc = data['docs'][0]
                
                # Prioritize 13-digit ISBNs
                isbns = first_doc.get('isbn', [])
                isbn13 = [isbn for isbn in isbns if len(isbn) == 13]
                isbn10 = [isbn for isbn in isbns if len(isbn) == 10]
                
                return {
                    'isbn': isbn13[0] if isbn13 else (isbn10[0] if isbn10 else None),
                    'olid': first_doc.get('key', '').split('/')[-1] if 'key' in first_doc else None
                }
        
        logger.warning(f"No details found for: {book}")
        return None
    
    except requests.RequestException as e:
        logger.error(f"Error searching for book: {book}. Error: {e}")
        return None

def download_book_cover(book, output_dir='book_covers'):
    """
    Download book cover with multiple fallback strategies.
    
    Args:
        book (str): Book title or ISBN
        output_dir (str): Directory to save covers
    
    Returns:
        str or None: Path to downloaded cover, or None if no cover found
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Get book details
    book_details = find_book_details(book)
    
    if not book_details or not (book_details.get('isbn') or book_details.get('olid')):
        logger.warning(f"No book details found for: {book}")
        return None
    
    # Try multiple cover sources
    for cover_template in COVER_SOURCES:
        try:
            # Format URL with available identifiers
            if '{isbn}' in cover_template:
                if not book_details.get('isbn'):
                    continue
                cover_url = cover_template.format(isbn=book_details['isbn'])
            elif '{olid}' in cover_template:
                if not book_details.get('olid'):
                    continue
                cover_url = cover_template.format(olid=book_details['olid'])
            else:
                continue
            
            # Download cover
            response = requests.get(cover_url, timeout=10)
            
            # Validate image
            if (response.status_code == 200 and 
                len(response.content) > 1000 and  # Minimum file size check
                response.headers.get('content-type', '').startswith('image')):
                
                # Generate filename
                identifier = book_details['isbn'] or book_details['olid']
                output_path = os.path.join(output_dir, f"{identifier}_cover.jpg")
                
                # Save image
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                
                logger.info(f"Cover downloaded for {book}: {output_path}")
                return output_path
        
        except requests.RequestException as e:
            logger.warning(f"Cover download failed for {book}: {e}")
    
    logger.warning(f"No cover found for {book}")
    return None

def download_book_covers_parallel(books, output_dir='book_covers', max_workers=5):
    """
    Download book covers in parallel with error handling.
    
    Args:
        books (list): List of ISBNs or book titles
        output_dir (str): Directory to save book covers
        max_workers (int): Maximum concurrent downloads
    
    Returns:
        list: List of successfully downloaded cover paths
    """
    successful_downloads = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_book = {
            executor.submit(download_book_cover, book, output_dir): book 
            for book in books
        }
        
        for future in concurrent.futures.as_completed(future_to_book):
            book = future_to_book[future]
            try:
                result = future.result()
                if result:
                    successful_downloads.append(result)
                
                # Small delay to prevent overwhelming the server
                time.sleep(0.5)
            
            except Exception as exc:
                logger.error(f"{book} generated an exception: {exc}")
    
    logger.info(f"Total successful downloads: {len(successful_downloads)} out of {len(books)} books")
    return successful_downloads

# Example usage
if __name__ == "__main__":
    books = [
        "La sombra del viento"  # Another book title
    ]
    
    download_book_covers_parallel(books)