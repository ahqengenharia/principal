-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS ahq_database;
USE ahq_database;

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    logotipo VARCHAR(255),
    endereco VARCHAR(255) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    responsavel_tecnico VARCHAR(255) NOT NULL,
    codigo_ana VARCHAR(50) NOT NULL,
    email_contato VARCHAR(255) NOT NULL,
    celular_contato VARCHAR(20) NOT NULL,
    codigo_cliente VARCHAR(50) UNIQUE NOT NULL,
    numero_contrato VARCHAR(50) NOT NULL,
    coordenada_x DECIMAL(10,6) NOT NULL,
    coordenada_y DECIMAL(10,6) NOT NULL,
    coordenada_z DECIMAL(10,6) NOT NULL,
    referencial_coordenadas VARCHAR(50) NOT NULL,
    cloud_instance_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);