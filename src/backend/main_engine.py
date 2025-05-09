"""
Motor Principal com Recursos de Segurança e IA
"""
import os
import sys
import json
import logging
from openai import OpenAI
from datetime import datetime
from security.SecurityConfig import SecurityConfig
from security.AntiTamperConfig import CodeIntegrityMonitor
from watchdog.observers import Observer

# Configurar pasta base e logs
BASE_PATH = os.path.join('C:', 'PLATAFORMA AHQ TESTE')
LOG_PATH = os.path.join(BASE_PATH, 'logs')

# Criar pastas necessárias
os.makedirs(BASE_PATH, exist_ok=True)
os.makedirs(LOG_PATH, exist_ok=True)

print(f"Pasta base criada em: {BASE_PATH}")
print(f"Pasta de logs criada em: {LOG_PATH}")

# Configurar logging
logging.basicConfig(
    filename=os.path.join(LOG_PATH, 'engine.log'),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class AIAgent:
    """Agente de IA para tarefas específicas"""
    def __init__(self, role, client):
        self.role = role
        self.client = client
        self.context = []
        
    async def process_task(self, task):
        """Processa uma tarefa usando o modelo GPT"""
        try:
            messages = [
                {"role": "system", "content": f"Você é um {self.role} especializado."},
                *self.context,
                {"role": "user", "content": task}
            ]
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=2000
            )
            
            result = response.choices[0].message.content
            self.context.append({"role": "assistant", "content": result})
            return result
            
        except Exception as e:
            logging.error(f"Erro no processamento da IA: {str(e)}")
            raise

class GLPIIntegration:
    """Gerenciador de integração com GLPI"""
    def __init__(self, config):
        self.config = config
        self.base_url = config.get('url', 'http://localhost/glpi')
        
    def customize_interface(self, client_data):
        """Customiza a interface do GLPI com dados do cliente"""
        try:
            # Implementa customização visual
            custom_css = f"""
                .glpi-header {{
                    background: #fff;
                    padding: 10px;
                }}
                .client-logo {{
                    content: url("{client_data.get('logotipo')}");
                    max-height: 50px;
                }}
                .client-info {{
                    font-size: 14px;
                    color: #333;
                }}
            """
            
            # Salva customização
            css_path = os.path.join(self.base_url, 'css', 'custom.css')
            with open(css_path, 'w') as f:
                f.write(custom_css)
                
            return True
        except Exception as e:
            logging.error(f"Erro na customização do GLPI: {str(e)}")
            return False

class ReceitaPrincipalEngine:
    """Motor Principal com IA"""
    def __init__(self):
        """Inicializa o motor principal"""
        self.base_path = BASE_PATH
        self.github_repo = "https://github.com/ahqengenharia/aqua-logic-weaver.git"
        
        print(f"Inicializando motor principal em: {self.base_path}")
        
        # Inicializa cliente OpenAI
        self.ai_client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            organization=os.getenv('OPENAI_ORG_ID')
        )
        
        # Inicializa GLPI
        self.glpi = GLPIIntegration({
            'url': os.getenv('GLPI_URL'),
            'api_token': os.getenv('GLPI_API_TOKEN')
        })
        
        # Inicializa agentes
        self.software_engineer = AIAgent("engenheiro de software", self.ai_client)
        self.programmer = AIAgent("programador", self.ai_client)
        
        # Configurações de segurança
        self.security_config = SecurityConfig(None)
        self.code_monitor = CodeIntegrityMonitor(self.base_path)
        self.observer = Observer()
        self.observer.schedule(self.code_monitor, self.base_path, recursive=True)
        self.observer.start()
        
        logging.info(f"Motor principal inicializado em: {self.base_path}")
        
    def execute_recipe_20(self, client_data):
        """Executa a receita 20 - Integração GLPI"""
        try:
            logging.info(f"Iniciando execução da receita 20 para cliente: {client_data.get('razao_social')}")
            
            # Customiza interface do GLPI
            customization_success = self.glpi.customize_interface(client_data)
            
            if not customization_success:
                raise Exception("Falha na customização do GLPI")
                
            logging.info("Receita 20 executada com sucesso")
            return True
            
        except Exception as e:
            logging.error(f"Erro na execução da receita 20: {str(e)}")
            raise
            
    def __del__(self):
        """Limpa recursos ao destruir objeto"""
        self.observer.stop()
        self.observer.join()

# Exemplo de uso
if __name__ == "__main__":
    engine = ReceitaPrincipalEngine()