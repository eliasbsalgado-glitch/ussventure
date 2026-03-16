-- Schema para Frota Venture — Vercel Postgres (Neon)

-- Fichas de servico dos tripulantes
CREATE TABLE IF NOT EXISTS fichas (
  slug TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  nascimento_sl TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  raca TEXT DEFAULT '',
  admissao TEXT DEFAULT '',
  patente TEXT DEFAULT '',
  divisao TEXT DEFAULT '',
  departamento TEXT DEFAULT '',
  foto TEXT DEFAULT '',
  historia TEXT DEFAULT '',
  timeline JSONB DEFAULT '[]',
  condecoracoes JSONB DEFAULT '[]',
  cursos JSONB DEFAULT '[]',
  diarios JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios do sistema
CREATE TABLE IF NOT EXISTS users (
  login TEXT PRIMARY KEY,
  senha TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'tripulante',
  ficha_slug TEXT REFERENCES fichas(slug) ON DELETE SET NULL
);

-- Eventos da agenda
CREATE TABLE IF NOT EXISTS agenda_eventos (
  id TEXT PRIMARY KEY,
  divisao TEXT NOT NULL,
  divisao_nome TEXT DEFAULT '',
  divisao_cor TEXT DEFAULT '#888',
  titulo TEXT NOT NULL,
  data TEXT NOT NULL,
  texto TEXT DEFAULT '',
  autor_slug TEXT DEFAULT '',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tripulação e dados das naves
CREATE TABLE IF NOT EXISTS naves_crew (
  nave_slug TEXT PRIMARY KEY,
  capitao_slug TEXT,
  classe TEXT DEFAULT '',
  tipo TEXT DEFAULT '',
  status TEXT DEFAULT 'Ativa',
  tripulantes JSONB DEFAULT '[]',
  missoes JSONB DEFAULT '[]',
  fotos JSONB DEFAULT '[]'
);

-- Missoes da frota (cada nave)
CREATE TABLE IF NOT EXISTS missoes (
  id TEXT PRIMARY KEY,
  nave_slug TEXT NOT NULL,
  titulo TEXT NOT NULL,
  data TEXT NOT NULL,
  texto TEXT DEFAULT '',
  autor_slug TEXT DEFAULT '',
  tripulantes JSONB DEFAULT '[]',
  diarios JSONB DEFAULT '[]',
  fotos JSONB DEFAULT '[]',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Honrarias / Condecoracoes da Frota
CREATE TABLE IF NOT EXISTS honrarias (
  id TEXT PRIMARY KEY,
  categoria TEXT NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  imagem TEXT DEFAULT '',
  ordem INT DEFAULT 0,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Dados editaveis das divisoes (descricao, departamentos)
CREATE TABLE IF NOT EXISTS divisoes_data (
  divisao_slug TEXT PRIMARY KEY,
  descricao TEXT DEFAULT '',
  departamentos JSONB DEFAULT '[]'
);

-- Indice para busca rapida por nome (para endpoint SL)
CREATE INDEX IF NOT EXISTS idx_fichas_nome_lower ON fichas (LOWER(nome));
CREATE INDEX IF NOT EXISTS idx_fichas_divisao ON fichas (divisao);
CREATE INDEX IF NOT EXISTS idx_missoes_nave ON missoes (nave_slug);
CREATE INDEX IF NOT EXISTS idx_missoes_data ON missoes (data DESC);
CREATE INDEX IF NOT EXISTS idx_honrarias_categoria ON honrarias (categoria);
