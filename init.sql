-- Script de inicialização do banco de dados DeathBoard
-- Este script cria as tabelas necessárias para o funcionamento do sistema

USE deathboard;

-- Tabela de Vendedores
CREATE TABLE IF NOT EXISTS Vendedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    foto_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_contratacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de SDRs (Sales Development Representatives)
CREATE TABLE IF NOT EXISTS SDRs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    foto_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_contratacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS Vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendedor_id INT NOT NULL,
    valor_venda DECIMAL(10,2) NOT NULL,
    data_venda DATE NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES Vendedores(id) ON DELETE RESTRICT
);

-- Tabela de Reuniões
CREATE TABLE IF NOT EXISTS Reunioes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sdr_id INT,
    vendedor_id INT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_agendamento DATETIME NOT NULL,
    data_realizacao DATETIME,
    status ENUM('agendada', 'realizada', 'cancelada') DEFAULT 'agendada',
    cliente_nome VARCHAR(255),
    cliente_empresa VARCHAR(255),
    cliente_email VARCHAR(255),
    cliente_telefone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sdr_id) REFERENCES SDRs(id) ON DELETE SET NULL,
    FOREIGN KEY (vendedor_id) REFERENCES Vendedores(id) ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX idx_vendas_vendedor_id ON Vendas(vendedor_id);
CREATE INDEX idx_vendas_data_venda ON Vendas(data_venda);
CREATE INDEX idx_reunioes_sdr_id ON Reunioes(sdr_id);
CREATE INDEX idx_reunioes_vendedor_id ON Reunioes(vendedor_id);
CREATE INDEX idx_reunioes_data_agendamento ON Reunioes(data_agendamento);
CREATE INDEX idx_reunioes_status ON Reunioes(status);
CREATE INDEX idx_vendedores_ativo ON Vendedores(ativo);
CREATE INDEX idx_sdrs_ativo ON SDRs(ativo);

-- Inserir dados de exemplo (opcional)
INSERT IGNORE INTO Vendedores (nome, email) VALUES 
('João Silva', 'joao.silva@empresa.com'),
('Maria Santos', 'maria.santos@empresa.com'),
('Pedro Costa', 'pedro.costa@empresa.com');

INSERT IGNORE INTO SDRs (nome, email) VALUES 
('Ana Oliveira', 'ana.oliveira@empresa.com'),
('Carlos Lima', 'carlos.lima@empresa.com'),
('Fernanda Rocha', 'fernanda.rocha@empresa.com');

-- Inserir algumas vendas de exemplo
INSERT IGNORE INTO Vendas (vendedor_id, valor_venda, data_venda, descricao) VALUES 
(1, 5000.00, CURDATE(), 'Venda de software empresarial'),
(2, 3500.00, CURDATE(), 'Venda de consultoria'),
(3, 7500.00, CURDATE(), 'Venda de licenças');

-- Inserir algumas reuniões de exemplo
INSERT IGNORE INTO Reunioes (sdr_id, titulo, data_agendamento, status, cliente_nome) VALUES 
(1, 'Apresentação de Produto', DATE_ADD(NOW(), INTERVAL 1 DAY), 'agendada', 'Empresa ABC'),
(2, 'Demonstração', DATE_ADD(NOW(), INTERVAL 2 DAY), 'agendada', 'Empresa XYZ'),
(3, 'Follow-up', DATE_ADD(NOW(), INTERVAL -1 DAY), 'realizada', 'Empresa 123'); 