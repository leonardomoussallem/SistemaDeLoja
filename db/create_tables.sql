-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela de Subcategorias
CREATE TABLE IF NOT EXISTS subcategorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria_id INTEGER NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  CONSTRAINT unique_subcategoria UNIQUE (nome, categoria_id)
);

-- Tabela de Produtos (atualizada para usar categoria_id e subcategoria_id)
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  custo DECIMAL(10,2) NOT NULL,
  estoque INTEGER NOT NULL,
  categoria_id INTEGER NOT NULL,
  subcategoria_id INTEGER NOT NULL,
  estoque_minimo INTEGER NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id)
);

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  forma_pagamento VARCHAR(20) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  lucro DECIMAL(10,2) NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);