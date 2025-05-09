
from flask import Blueprint, request, jsonify
import requests
import os
import base64
import mimetypes
import uuid

external_integrations_bp = Blueprint('external_integrations', __name__)

@external_integrations_bp.route('/base44/proxy', methods=['GET', 'POST'])
def base44_proxy():
    """
    Proxy requests to Base44 platform to avoid CORS issues
    """
    if request.method == 'GET':
        try:
            url = request.args.get('url')
            if not url or not url.startswith('https://app.base44.com'):
                return jsonify({"error": "Invalid URL parameter"}), 400

            response = requests.get(url)
            return jsonify({
                "status": response.status_code,
                "data": response.text,
                "headers": dict(response.headers)
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            url = data.get('url')
            payload = data.get('payload', {})
            
            if not url or not url.startswith('https://app.base44.com'):
                return jsonify({"error": "Invalid URL parameter"}), 400

            response = requests.post(url, json=payload)
            return jsonify({
                "status": response.status_code,
                "data": response.text,
                "headers": dict(response.headers)
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@external_integrations_bp.route('/base44/status', methods=['GET'])
def base44_status():
    """
    Check if Base44 platform is accessible
    """
    try:
        response = requests.get('https://app.base44.com/api/health')
        return jsonify({
            "status": "online" if response.status_code == 200 else "offline",
            "code": response.status_code
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@external_integrations_bp.route('/base44/upload-template', methods=['POST'])
def upload_template():
    """
    Upload a template to Base44
    """
    try:
        data = request.get_json()
        content = data.get('content')
        app_id = data.get('appId')
        is_binary = data.get('isBinary', False)
        
        if not content or not app_id:
            return jsonify({"error": "Missing content or appId"}), 400
        
        # Create directory for templates if it doesn't exist    
        template_dir = os.path.join('src', 'backend', 'assets', 'templates')
        os.makedirs(template_dir, exist_ok=True)
        
        # Generate unique filename based on app ID and timestamp
        import time
        timestamp = int(time.time())
        unique_id = str(uuid.uuid4())[:8]
        
        if is_binary:
            # Handle binary content (Office documents with VBA macros)
            try:
                # Decode base64 content
                binary_content = base64.b64decode(content)
                
                # Save as binary file with appropriate extension
                template_path = os.path.join(template_dir, f'base44_template_{app_id}_{timestamp}_{unique_id}.docx')
                with open(template_path, 'wb') as f:
                    f.write(binary_content)
                
                # Try to upload to Base44 directly
                try:
                    with open(template_path, 'rb') as f:
                        files = {'file': (f'template_{unique_id}.docx', f, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
                        response = requests.post(
                            f'https://app.base44.com/api/apps/{app_id}/templates/upload',
                            files=files
                        )
                        
                        if response.status_code == 200:
                            return jsonify({
                                "status": "success",
                                "message": "Binary template uploaded to Base44 successfully",
                                "path": template_path,
                                "type": "binary",
                                "base44_response": response.json()
                            })
                        else:
                            print(f"Base44 upload failed with status: {response.status_code}")
                except Exception as upload_error:
                    print(f"Base44 direct upload error: {str(upload_error)}")
                
                return jsonify({
                    "status": "success",
                    "message": "Binary template stored successfully",
                    "path": template_path,
                    "type": "binary"
                })
            except Exception as binary_error:
                return jsonify({
                    "error": f"Binary file processing error: {str(binary_error)}"
                }), 500
        else:
            # Handle text content
            template_path = os.path.join(template_dir, f'base44_template_{app_id}_{timestamp}_{unique_id}.txt')
            with open(template_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
            return jsonify({
                "status": "success",
                "message": "Template stored successfully",
                "path": template_path,
                "type": "text"
            })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@external_integrations_bp.route('/base44/replace-variables', methods=['POST'])
def replace_template_variables():
    """
    Replace variables in a template
    """
    try:
        data = request.get_json()
        template_id = data.get('templateId')
        variables = data.get('variables', {})
        app_id = data.get('appId')
        
        if not template_id or not app_id:
            return jsonify({"error": "Missing templateId or appId"}), 400
        
        # Forward the request to Base44
        response = requests.post(
            f'https://app.base44.com/api/apps/{app_id}/templates/{template_id}/variables',
            json=variables
        )
        
        if response.status_code == 200:
            return jsonify({
                "status": "success",
                "message": "Variables replaced successfully",
                "base44_response": response.json()
            })
        else:
            return jsonify({
                "status": "error",
                "message": f"Failed to replace variables: {response.status_code}",
                "base44_response": response.text
            }), response.status_code
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
