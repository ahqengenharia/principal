
from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime

# Create blueprint
data_consistency_bp = Blueprint('data_consistency', __name__)

# Temporary storage for uploaded files (in a real app, this would be a database)
UPLOAD_FOLDER = os.path.join('src', 'backend', 'assets', 'data_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def z_score(data, column):
    """Calculate Z-Score for a dataframe column"""
    mean = data[column].mean()
    std = data[column].std()
    
    if std == 0:
        return data, []
        
    data['z_score'] = abs((data[column] - mean) / std)
    outliers = data[data['z_score'] > 3].copy()
    
    return data, outliers.to_dict('records')

def modified_z_score(data, column):
    """Calculate Modified Z-Score for a dataframe column"""
    median = data[column].median()
    # Calculate MAD: median absolute deviation
    mad = np.median(abs(data[column] - median))
    
    if mad == 0:
        return data, []
        
    data['modified_z_score'] = abs(0.6745 * (data[column] - median) / mad)
    outliers = data[data['modified_z_score'] > 3.5].copy()
    
    return data, outliers.to_dict('records')

@data_consistency_bp.route('/api/data/upload-consistency', methods=['POST'])
def upload_consistency_data():
    """Handle data upload for consistency analysis"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file part'}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
            
        # Get file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        # Process file based on extension
        if file_ext in ['.csv']:
            df = pd.read_csv(file)
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file)
        elif file_ext in ['.txt']:
            # Try to determine delimiter
            content = file.read().decode('utf-8')
            file.seek(0)  # Reset file pointer
            
            # Check first line for common delimiters
            first_line = content.split('\n')[0]
            if '\t' in first_line:
                delimiter = '\t'
            elif ',' in first_line:
                delimiter = ','
            else:
                delimiter = ' '
                
            df = pd.read_csv(file, delimiter=delimiter)
        else:
            return jsonify({'success': False, 'error': 'Unsupported file format'}), 400
            
        # Save to database (simulated by saving to file)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        save_path = os.path.join(UPLOAD_FOLDER, f'data_{timestamp}.json')
        
        # Convert DataFrame to JSON and save
        df.to_json(save_path, orient='records')
        
        # Return the data for immediate use
        return jsonify({
            'success': True,
            'message': f'File processed successfully with {len(df)} records',
            'data': json.loads(df.to_json(orient='records'))
        })
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@data_consistency_bp.route('/api/data/validate', methods=['POST'])
def validate_data():
    """Validate data using Z-Score or Modified Z-Score"""
    try:
        data = request.json
        if not data or 'data' not in data or not data['data']:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        df = pd.DataFrame(data['data'])
        column = data.get('column')
        method = data.get('method', 'zScore')
        
        if not column:
            # Use first numeric column as default
            numeric_cols = df.select_dtypes(include=np.number).columns
            if len(numeric_cols) > 0:
                column = numeric_cols[0]
            else:
                return jsonify({'success': False, 'error': 'No numeric column found'}), 400
        
        # Apply selected method
        if method == 'zScore':
            _, outliers = z_score(df, column)
        else:
            _, outliers = modified_z_score(df, column)
        
        # Save to database (simulated)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        db_path = os.path.join(UPLOAD_FOLDER, 'dados-brutos.json')
        
        with open(db_path, 'w') as f:
            json.dump(data['data'], f)
            
        return jsonify({
            'success': True,
            'outliers': outliers,
            'totalRecords': len(df),
            'outliersCount': len(outliers)
        })
        
    except Exception as e:
        print(f"Error validating data: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
