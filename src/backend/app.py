
from flask import Flask
from flask_cors import CORS
from routes.json_processor import json_processor_bp
from routes.template_routes import template_bp
from routes.data_consistency import data_consistency_bp
from routes.external_integrations import external_integrations_bp
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(json_processor_bp)
app.register_blueprint(template_bp, url_prefix='/api/template')
app.register_blueprint(data_consistency_bp)
app.register_blueprint(external_integrations_bp, url_prefix='/api/external')

# Configure upload folder
UPLOAD_FOLDER = os.path.join('src', 'backend', 'assets', 'images', 'templates')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configure data upload folder
DATA_UPLOAD_FOLDER = os.path.join('src', 'backend', 'assets', 'data_uploads')
os.makedirs(DATA_UPLOAD_FOLDER, exist_ok=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
