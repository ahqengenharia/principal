"""
Configuração Anti-Adulteração
"""
import hashlib
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class CodeIntegrityMonitor(FileSystemEventHandler):
    def __init__(self, base_path):
        self.base_path = base_path
        self.file_hashes = {}
        self.initialize_hashes()
        
    def initialize_hashes(self):
        """Inicializa hashes dos arquivos"""
        for root, _, files in os.walk(self.base_path):
            for file in files:
                if file.endswith(('.py', '.js', '.tsx')):
                    path = os.path.join(root, file)
                    self.file_hashes[path] = self.calculate_hash(path)
    
    def calculate_hash(self, file_path):
        """Calcula hash do arquivo"""
        with open(file_path, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()
    
    def on_modified(self, event):
        """Monitora modificações nos arquivos"""
        if event.src_path.endswith(('.py', '.js', '.tsx')):
            new_hash = self.calculate_hash(event.src_path)
            if event.src_path in self.file_hashes:
                if new_hash != self.file_hashes[event.src_path]:
                    print(f"ALERTA: Modificação detectada em {event.src_path}")
                    # Aqui você pode adicionar ações como notificar administradores,
                    # reverter mudanças, etc.