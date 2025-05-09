"""
Configuração de Segurança Principal
"""
import os
import jwt
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from passlib.hash import pbkdf2_sha256
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from functools import wraps

class SecurityConfig:
    def __init__(self, app):
        """Inicializa configurações de segurança"""
        self.app = app
        self.key = Fernet.generate_key()
        self.cipher_suite = Fernet(self.key)
        
        # Configurações de segurança HTTP
        Talisman(app, 
                force_https=True,
                strict_transport_security=True,
                session_cookie_secure=True)
        
        # Rate limiting
        self.limiter = Limiter(
            app,
            key_func=get_remote_address,
            default_limits=["200 per day", "50 per hour"]
        )
        
        # Configuração JWT
        self.JWT_SECRET = os.environ.get('JWT_SECRET', 'seu-segredo-super-secreto')
        self.JWT_EXPIRATION = timedelta(hours=1)
        
    def generate_token(self, user_id):
        """Gera token JWT"""
        return jwt.encode(
            {
                'user_id': user_id,
                'exp': datetime.utcnow() + self.JWT_EXPIRATION
            },
            self.JWT_SECRET,
            algorithm='HS256'
        )
    
    def verify_token(self, token):
        """Verifica token JWT"""
        try:
            return jwt.decode(token, self.JWT_SECRET, algorithms=['HS256'])
        except:
            return None
    
    def hash_password(self, password):
        """Hash de senha usando PBKDF2"""
        return pbkdf2_sha256.hash(password)
    
    def verify_password(self, password, hash):
        """Verifica senha"""
        return pbkdf2_sha256.verify(password, hash)
    
    def require_auth(self, f):
        """Decorator para rotas que requerem autenticação"""
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            
            if not token:
                return {'message': 'Token não fornecido'}, 401
                
            user = self.verify_token(token)
            if not user:
                return {'message': 'Token inválido'}, 401
                
            return f(*args, **kwargs)
        return decorated