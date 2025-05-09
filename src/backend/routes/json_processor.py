from flask import Blueprint, request, jsonify, current_app
import json
import pandas as pd
import os
from datetime import datetime

json_processor_bp = Blueprint('json_processor', __name__)

SAVE_PATHS = [
    "src/backend/assets/images/templates/",
    "C:/Users/Usuario/OneDrive/ARQUIVOS DA PLATAFORMA TESTE"
]

def ensure_directories():
    for path in SAVE_PATHS:
        os.makedirs(path, exist_ok=True)

@json_processor_bp.route('/api/data/process-json', methods=['POST'])
def process_json():
    try:
        ensure_directories()
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if not file:
            return jsonify({'error': 'Empty file'}), 400

        # Read JSON content
        json_data = json.load(file)
        
        # Convert to DataFrame
        df = pd.DataFrame([json_data]) if isinstance(json_data, dict) else pd.DataFrame(json_data)
        
        # Generate timestamp for filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save files in specified directories
        for path in SAVE_PATHS:
            excel_path = os.path.join(path, f"data_{timestamp}.xlsx")
            json_path = os.path.join(path, f"data_{timestamp}.json")
            
            df.to_excel(excel_path, index=False)
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, indent=2, ensure_ascii=False)
        
        # Print data for debugging
        print("DataFrame Contents:")
        print(df)
        print("\nJSON Contents:")
        print(json.dumps(json_data, indent=2, ensure_ascii=False))

        # Prepare preview data
        preview = {
            'fields': df.columns.tolist(),
            'values': df.to_dict('records'),
            'summary': {
                'total_rows': len(df),
                'total_columns': len(df.columns)
            },
            'raw_json': json_data
        }

        return jsonify({
            'success': True,
            'message': 'Arquivo processado com sucesso',
            'preview': preview
        })

    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({'error': str(e)}), 500

@json_processor_bp.route('/api/data/preview', methods=['GET'])
def get_data_preview():
    try:
        # Get the most recent file from the first save path
        path = SAVE_PATHS[0]
        json_files = [f for f in os.listdir(path) if f.endswith('.json')]
        
        if not json_files:
            return jsonify({'error': 'No data files found'}), 404
            
        latest_file = max(json_files, key=lambda x: os.path.getctime(os.path.join(path, x)))
        file_path = os.path.join(path, latest_file)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
            
        df = pd.DataFrame([json_data]) if isinstance(json_data, dict) else pd.DataFrame(json_data)
        
        preview = {
            'fields': df.columns.tolist(),
            'values': df.to_dict('records'),
            'summary': {
                'total_rows': len(df),
                'total_columns': len(df.columns)
            },
            'raw_json': json_data
        }
        
        return jsonify(preview)
        
    except Exception as e:
        print(f"Error getting preview: {str(e)}")
        return jsonify({'error': str(e)}), 500