
from flask import Blueprint, jsonify, request
import requests
import os
import re
from flask_cors import CORS
from bs4 import BeautifulSoup

template_bp = Blueprint('template', __name__)
CORS(template_bp)

@template_bp.route('/fetch-google-drive-template', methods=['GET'])
def fetch_google_drive_template():
    try:
        # Google Drive file ID from the provided URL
        file_id = "1e-h4qX668S7NWVQicgJSxVG6uxYBFBBb"
        
        # First, get the download URL
        session = requests.Session()
        
        # Try to get the export link for HTML format
        response = session.get(f"https://drive.google.com/uc?id={file_id}&export=download")
        
        if response.status_code != 200:
            return jsonify({"error": "Failed to access Google Drive file"}), 400
        
        # Parse the content as HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract main content (this is simplified, might need adjustment)
        content = str(soup.body) if soup.body else str(soup)
        
        # Remove any potentially harmful scripts (basic security)
        soup = BeautifulSoup(content, 'html.parser')
        for script in soup.find_all('script'):
            script.decompose()
            
        # Re-extract cleaned content    
        content = str(soup)
        
        return jsonify({"content": content})
    except Exception as e:
        print(f"Error fetching template: {str(e)}")
        return jsonify({"error": str(e)}), 500

@template_bp.route('/save', methods=['POST'])
def save_template():
    try:
        content = request.json.get('content')
        if not content:
            return jsonify({"error": "No content provided"}), 400
            
        # Here you could save the template to a file or database
        # For this example, we'll just return success
        return jsonify({"success": True, "message": "Template saved successfully"})
    except Exception as e:
        print(f"Error saving template: {str(e)}")
        return jsonify({"error": str(e)}), 500

@template_bp.route('/upload', methods=['POST'])
def upload_template():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        # Save the file temporarily
        filename = file.filename
        filepath = os.path.join('src', 'backend', 'assets', 'templates', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        file.save(filepath)
        
        # Read the file content
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        return jsonify({"success": True, "content": content})
    except Exception as e:
        print(f"Error processing uploaded template: {str(e)}")
        return jsonify({"error": str(e)}), 500
