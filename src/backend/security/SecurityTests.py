"""
Testes de Segurança
"""
import requests
import socket
import ssl
import subprocess
from concurrent.futures import ThreadPoolExecutor

class SecurityTester:
    def __init__(self, base_url):
        self.base_url = base_url
        
    def test_sql_injection(self):
        """Testa vulnerabilidades de SQL Injection"""
        payloads = ["' OR '1'='1", "'; DROP TABLE users;--"]
        for payload in payloads:
            response = requests.post(f"{self.base_url}/login", json={
                "username": payload,
                "password": payload
            })
            if response.status_code == 200:
                return "VULNERÁVEL a SQL Injection"
        return "OK - SQL Injection"
    
    def test_xss(self):
        """Testa vulnerabilidades XSS"""
        payload = "<script>alert('xss')</script>"
        response = requests.post(f"{self.base_url}/api/data", json={
            "data": payload
        })
        if payload in response.text:
            return "VULNERÁVEL a XSS"
        return "OK - XSS"
    
    def test_ssl(self):
        """Testa configuração SSL"""
        hostname = self.base_url.split("://")[1]
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443)) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                # Verifica validade do certificado
                if not cert:
                    return "VULNERÁVEL - SSL/TLS"
        return "OK - SSL/TLS"
    
    def run_all_tests(self):
        """Executa todos os testes de segurança"""
        with ThreadPoolExecutor() as executor:
            tests = [
                executor.submit(self.test_sql_injection),
                executor.submit(self.test_xss),
                executor.submit(self.test_ssl)
            ]
            results = [test.result() for test in tests]
        return results