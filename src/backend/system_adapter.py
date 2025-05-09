"""
Sistema de Adaptação para Múltiplas Plataformas
"""
import os
import platform
import json
from pathlib import Path
import logging
from typing import Dict, Any

class SystemAdapter:
    def __init__(self):
        """Inicializa o adaptador do sistema"""
        self.setup_logging()
        self.base_paths = self.get_base_paths()
        
    def setup_logging(self):
        """Configura o sistema de logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('system_adapter.log'),
                logging.StreamHandler()
            ]
        )
        
    def get_base_paths(self) -> Dict[str, Dict[str, str]]:
        """
        Define os caminhos base para cada sistema operacional
        Retorna um dicionário com os caminhos para cada SO
        """
        return {
            'windows': {
                'data': r'C:\PLATAFORMA AHQ TESTE',
                'temp': r'C:\temp\ahq',
                'logs': r'C:\PLATAFORMA AHQ TESTE\logs'
            },
            'linux': {
                'data': '/opt/ahq/data',
                'temp': '/tmp/ahq',
                'logs': '/var/log/ahq'
            },
            'darwin': {  # macOS
                'data': '/Users/Shared/AHQ/data',
                'temp': '/tmp/ahq',
                'logs': '/var/log/ahq'
            },
            'android': {
                'data': '/storage/emulated/0/AHQ/data',
                'temp': '/data/local/tmp/ahq',
                'logs': '/sdcard/AHQ/logs'
            },
            'ios': {
                'data': '/var/mobile/AHQ/data',
                'temp': '/tmp/ahq',
                'logs': '/var/mobile/AHQ/logs'
            }
        }
        
    def detect_system(self) -> str:
        """
        Detecta o sistema operacional atual
        Retorna o nome do sistema operacional em minúsculas
        """
        system = platform.system().lower()
        if system == 'darwin':
            return 'macos'
        return system
        
    def create_directories(self, system: str):
        """
        Cria os diretórios necessários para o sistema especificado
        """
        paths = self.base_paths.get(system, self.base_paths['linux'])
        for path in paths.values():
            Path(path).mkdir(parents=True, exist_ok=True)
            logging.info(f'Diretório criado/verificado: {path}')
            
    def adapt_system(self, device_type: str, os_type: str) -> Dict[str, Any]:
        """
        Adapta o sistema para o dispositivo e SO especificados
        Retorna configurações específicas para o cliente
        """
        logging.info(f'Adaptando sistema para: {device_type} - {os_type}')
        
        # Cria diretórios necessários
        self.create_directories(os_type)
        
        # Configurações específicas para cada tipo de dispositivo/SO
        configs = {
            'paths': self.base_paths[os_type],
            'device_type': device_type,
            'os_type': os_type,
            'screen_resolution': self.get_default_resolution(device_type),
            'features': self.get_features_config(device_type, os_type)
        }
        
        return configs
    
    def get_default_resolution(self, device_type: str) -> Dict[str, int]:
        """
        Retorna a resolução padrão baseada no tipo de dispositivo
        """
        resolutions = {
            'mobile': {'width': 360, 'height': 640},
            'desktop': {'width': 1920, 'height': 1080}
        }
        return resolutions.get(device_type, resolutions['desktop'])
    
    def get_features_config(self, device_type: str, os_type: str) -> Dict[str, bool]:
        """
        Retorna configuração de recursos baseada no dispositivo e SO
        """
        base_features = {
            'offline_mode': True,
            'push_notifications': True,
            'location_services': True,
            'file_upload': True,
            'camera_access': device_type == 'mobile',
            'gps_tracking': device_type == 'mobile',
            'desktop_notifications': device_type == 'desktop'
        }
        
        # Ajustes específicos por SO
        if os_type == 'ios':
            base_features.update({
                'file_system_access': False,
                'background_processing': False
            })
        
        return base_features

