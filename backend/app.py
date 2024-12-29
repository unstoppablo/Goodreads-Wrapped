from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
import os
from process_data import GoodreadsDataProcessor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "10 per minute"]
)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'csv'}

@app.after_request
def add_security_headers(response):
    headers = {
        'Content-Security-Policy': "default-src 'self'",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
    }
    for key, value in headers.items():
        response.headers[key] = value
    return response

@app.route('/test', methods=['GET'])
@limiter.limit("10 per minute")
def test():
    return jsonify({"status": "working"})

@app.route('/validate', methods=['POST'])
@limiter.limit("10 per minute")
def validate_file():
    print("Validate route hit!")
    print("Request files:", request.files)
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file type'}), 400

    filename = secure_filename(file.filename.replace(" ", "_"))
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(filepath)
        processor = GoodreadsDataProcessor(filepath)
        
        validation_result = processor.validate_goodreads_csv()
        return jsonify(validation_result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

@app.route('/analyze', methods=['POST'])
@limiter.limit("10 per minute")
def analyze_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    file.stream.seek(0)  # Rewind the file pointer
    
    filename = secure_filename(file.filename.replace(" ", "_"))
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(filepath)
        # Add debug print
        print(f"File saved, size: {os.path.getsize(filepath)}")
        processor = GoodreadsDataProcessor(filepath)
        stats = processor.get_statistics(start_date='2024-01-01', end_date='2024-12-31')
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
if __name__ == '__main__':
  app.run(debug=False, host='0.0.0.0', port=5001)