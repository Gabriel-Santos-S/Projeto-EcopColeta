
DROP DATABASE IF EXISTS reciclame;
CREATE DATABASE reciclame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE reciclame;


CREATE TABLE tipo_residuo (
  id_tipo INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: pessoa
CREATE TABLE pessoa (
  cpf CHAR(11) PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  endereco_rua VARCHAR(150),
  endereco_numero VARCHAR(20),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_uf CHAR(2),
  data_nascimento DATE,
  telefone VARCHAR(20),
  email VARCHAR(150)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criar a tabela grupos_usuarios
CREATE TABLE grupos_usuarios (
    ID VARCHAR(36) PRIMARY KEY,
    nivel_acesso ENUM('adm', 'usuario', 'externo') NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf CHAR(11) NOT NULL,
    FOREIGN KEY (cpf) REFERENCES pessoa(cpf) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: empresa
CREATE TABLE empresa (
  cnpj CHAR(14) PRIMARY KEY,
  razao_social VARCHAR(200) NOT NULL,
  area_atuacao VARCHAR(150)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: cooperativa
CREATE TABLE cooperativa (
  id_coop INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  endereco_rua VARCHAR(150),
  endereco_numero VARCHAR(20),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_uf CHAR(2),
  capacidade_processamento INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: ponto_coleta
CREATE TABLE ponto_coleta (
  id_ponto INT AUTO_INCREMENT PRIMARY KEY,
  localizacao VARCHAR(255) NOT NULL,
  capacidade INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: recompensa (catálogo)
CREATE TABLE recompensa (
  id_recompensa INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  valor DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: residuo
CREATE TABLE residuo (
  id_residuo INT AUTO_INCREMENT PRIMARY KEY,
  id_tipo INT NOT NULL,
  peso DECIMAL(10,3) NOT NULL,
  data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_coop INT,
  cnpj_empresa CHAR(14),
  CONSTRAINT fk_residuo_tipo FOREIGN KEY (id_tipo) REFERENCES tipo_residuo(id_tipo) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_residuo_coop FOREIGN KEY (id_coop) REFERENCES cooperativa(id_coop) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_residuo_empresa FOREIGN KEY (cnpj_empresa) REFERENCES empresa(cnpj) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: material_especial (especialização de residuo)
CREATE TABLE material_especial (
  id_residuo INT PRIMARY KEY,
  tipo_especial VARCHAR(100),
  cuidado_armazenamento TEXT,
  CONSTRAINT fk_material_residuo FOREIGN KEY (id_residuo) REFERENCES residuo(id_residuo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: ponto_coleta_aceita (multivalorada: tipos aceitos por ponto)
CREATE TABLE ponto_coleta_aceita (
  id_ponto INT NOT NULL,
  id_tipo INT NOT NULL,
  PRIMARY KEY (id_ponto, id_tipo),
  CONSTRAINT fk_ponto_aceita_ponto FOREIGN KEY (id_ponto) REFERENCES ponto_coleta(id_ponto) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ponto_aceita_tipo FOREIGN KEY (id_tipo) REFERENCES tipo_residuo(id_tipo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: coleta
CREATE TABLE coleta (
  id_coleta INT AUTO_INCREMENT PRIMARY KEY,
  data DATETIME NOT NULL,
  status ENUM('agendada','em_andamento','concluida','cancelada') DEFAULT 'agendada',
  cpf CHAR(11) NOT NULL,
  id_ponto INT NOT NULL,
  CONSTRAINT fk_coleta_pessoa FOREIGN KEY (cpf) REFERENCES pessoa(cpf) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_coleta_ponto FOREIGN KEY (id_ponto) REFERENCES ponto_coleta(id_ponto) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: coleta_residuo (associativa M:N)
CREATE TABLE coleta_residuo (
  id_coleta INT NOT NULL,
  id_residuo INT NOT NULL,
  peso_coletado DECIMAL(10,3),
  peso_coletado INT DEFAULT 1,
  PRIMARY KEY (id_coleta, id_residuo),
  CONSTRAINT fk_cr_coleta FOREIGN KEY (id_coleta) REFERENCES coleta(id_coleta) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cr_residuo FOREIGN KEY (id_residuo) REFERENCES residuo(id_residuo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: pessoa_recompensa (histórico M:N Pessoa <-> Recompensa)
CREATE TABLE pessoa_recompensa (
  id_historico INT AUTO_INCREMENT PRIMARY KEY,
  cpf CHAR(11) NOT NULL,
  id_recompensa INT NOT NULL,
  data_concessao DATETIME DEFAULT CURRENT_TIMESTAMP,
  valor_utilizado DECIMAL(10,2),
  observacao VARCHAR(255),
  CONSTRAINT fk_pr_pessoa FOREIGN KEY (cpf) REFERENCES pessoa(cpf) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pr_recompensa FOREIGN KEY (id_recompensa) REFERENCES recompensa(id_recompensa) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índices úteis
CREATE INDEX idx_residuo_tipo ON residuo(id_tipo);
CREATE INDEX idx_residuo_coop ON residuo(id_coop);
CREATE INDEX idx_coleta_status ON coleta(status);
CREATE INDEX idx_coleta_data ON coleta(data);

-- Alterações

ALTER TABLE residuo
MODIFY data_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;



INSERT INTO tipo_residuo (id_tipo, nome, descricao) VALUES
(1,'Plástico','Plásticos em geral (PET, PE, etc.)'),
(2,'Vidro','Vidro (garrafas, frascos)'),
(3,'Papel','Papel/cartão'),
(4,'Metal','Metais (latas, alumínio)'),
(5,'Eletrônico','Resíduos elétricos/electrônicos'),
(6,'Orgânico','Resíduo orgânico'),
(7,'Perigoso','Resíduos perigosos (químicos)');

INSERT INTO pessoa (cpf, nome, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_uf, data_nascimento, telefone, email) VALUES
('00000000000','Mariana Silva','Rua A','123','Centro','CidadeX','SP','1995-04-10','11999990000','mariana@example.com'),
('11111111111','Carlos Souza','Av. B','456','Jardim','CidadeY','SP','1988-11-01','11988880000','carlos@example.com'),
('22222222222','Gabriel Santos','Av. C','343','Metropole','Taguatinga','DF','2005-09-07','11988880000','gabriel@gmail.com');

INSERT INTO recompensa (id_recompensa, tipo, valor) VALUES
(1,'Cupom Desconto Loja Parceira',50.00),
(2,'Vale-transporte (por pontos)',10.00),
(3,'Doação a ONG (R$ por kg)',5.00);


