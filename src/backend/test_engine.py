from main_engine import ReceitaPrincipalEngine
import logging

def test_engine():
    try:
        # Inicializar motor
        engine = ReceitaPrincipalEngine()
        
        # Testar execução de receita
        test_recipe = {
            'id': 'receita_teste',
            'steps': [
                {
                    'type': 'python',
                    'code': 'print("Olá da receita de teste!")'
                }
            ]
        }
        
        # Salvar receita de teste
        import json
        import os
        
        recipes_path = os.path.join(r"C:\Users\Usuario\Onedrive\ARQUIVOSDAPLATAFORMA", 'receitas')
        os.makedirs(recipes_path, exist_ok=True)
        
        with open(os.path.join(recipes_path, 'receita_teste.json'), 'w') as f:
            json.dump(test_recipe, f)
        
        # Executar receita de teste
        result = engine.execute_recipe('receita_teste')
        
        if result:
            print("Teste do motor bem-sucedido!")
        else:
            print("Teste do motor falhou!")
            
    except Exception as e:
        logging.error(f"Teste falhou: {str(e)}")
        print(f"Teste falhou: {str(e)}")

if __name__ == "__main__":
    test_engine()