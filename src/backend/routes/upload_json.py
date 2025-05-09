import json
import pandas as pd
from flask import Blueprint, request, jsonify
import psycopg2
from sqlalchemy import create_engine
import os

upload_json_bp = Blueprint('upload_json', __name__)

# Configuração do PostgreSQL
DB_CONFIG = {
    'host': 'localhost',
    'database': 'ahq_database',
    'user': 'postgres',
    'password': 'sua_senha'
}

@upload_json_bp.route('/api/upload-json', methods=['POST'])
def upload_json():
    try:
        # Recebe o arquivo JSON
        json_data = request.get_json()
        
        # Converte para DataFrame
        df = pd.DataFrame(json_data)
        
        # Salva em Excel
        excel_path = r'C:\localhost\ahq\templates\dados_upload.xlsx'
        df.to_excel(excel_path, index=False)
        
        # Salva em CSV para visualização
        csv_path = r'C:\localhost\ahq\templates\dados_preview.csv'
        df.to_csv(csv_path, index=False)
        
        # Conecta ao PostgreSQL e salva os dados
        engine = create_engine(f'postgresql://{DB_CONFIG["user"]}:{DB_CONFIG["password"]}@{DB_CONFIG["host"]}/{DB_CONFIG["database"]}')
        df.to_sql('dados_upload', engine, if_exists='append', index=False)
        
        # Retorna amostra dos dados para preview
        preview_data = df.head(5).to_dict('records')
        
        return jsonify({
            'success': True,
            'message': 'Arquivo processado com sucesso',
            'preview': preview_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao processar arquivo: {str(e)}'
        }), 500