# Goodreads CSV Analyzer Backend

A Flask-based backend service that processes and analyzes Goodreads library export files. This service provides endpoints for validating and analyzing reading statistics from Goodreads CSV exports.

## 🌟 Features

- CSV validation for Goodreads export format
- Comprehensive reading statistics analysis
- Book cover image fetching from multiple sources
- Rate limiting to prevent abuse
- CORS support for frontend integration
- Secure file handling with automatic cleanup

## 🛠️ Technical Stack

- **Framework**: Flask
- **Security**: Flask-Limiter, CORS headers
- **Data Processing**: Pandas, NumPy
- **External APIs**: Google Books API, Open Library API
- **Async Operations**: aiohttp for concurrent cover image fetching

## 📋 API Endpoints

### Test Endpoint

```
GET /test
```

- Simple health check endpoint
- Rate limit: 10 requests per minute per IP address
- Returns: `{"status": "working"}`

### Validate File

```
POST /validate
```

- Validates Goodreads CSV format and structure
- Rate limit: 10 requests per minute per IP address
- Accepts: CSV file upload (max 16MB)
- Returns: Validation status and basic file statistics

### Analyze File

```
POST /analyze
```

- Performs comprehensive analysis of reading data
- Rate limit: 10 requests per minute per IP address
- Accepts: CSV file upload (max 16MB)
- Returns: Detailed statistics including:
  - Basic reading statistics
  - Rating distributions
  - Reading patterns
  - Time comparisons
  - Book extremes (longest/shortest)
  - Monthly rating distributions
  - Top books summary
  - Complete book list with cover images

## 🚀 Deployment

Currently deployed on Render's free tier:

- Initial requests may take up to 40 seconds due to cold starts
- Service spins down after periods of inactivity
- Automatic cleanup of uploaded files after processing

## 💻 Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python app.py
   ```
   The server will start on port 5001.

## 📁 File Structure

```
backend/
├── app.py              # Main Flask application
├── process_data.py     # Data processing logic
└── uploads/            # Temporary file storage (auto-cleaned)
```

## 🔒 Security Features

- File size restrictions (16MB max)
- Automatic file cleanup after processing
- Secure filename handling
- Content Security Policy headers
- XSS protection headers
- CORS configuration
- Rate limiting on all endpoints

## ⚠️ Important Notes

1. **File Processing**:

   - Only CSV files are accepted
   - Files are temporarily stored and automatically deleted after processing
   - Maximum file size is 16MB

2. **Rate Limiting**:

   - Rate limits are enforced per IP address to ensure fair usage:
     - 100 requests per day per IP address
     - 10 requests per minute per IP address
   - These limits apply independently to each endpoint
   - The limits help prevent abuse while allowing normal usage patterns

3. **Book Cover Images**:

   - Fetched asynchronously from multiple sources
   - Sources include Google Books API and Open Library
   - Fallback mechanisms for missing ISBNs

4. **Performance**:
   - Free tier deployment may experience cold starts
   - Large CSV files may take longer to process
   - Concurrent cover image fetching improves performance

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License
