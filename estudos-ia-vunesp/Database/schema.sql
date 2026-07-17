-- database/schema.sql

-- Criação da tabela de resultados de estudos
CREATE TABLE resultados (
    id SERIAL PRIMARY KEY,
    materia VARCHAR(255) NOT NULL,
    acertou BOOLEAN NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ativação do Row Level Security (RLS) para proteger a tabela
ALTER TABLE resultados ENABLE ROW LEVEL SECURITY;
