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
  tripulantes JSONB DEFAULT '[]',
  missoes JSONB DEFAULT '[]',
  fotos JSONB DEFAULT '[]'
);

-- Indice para busca rapida por nome (para endpoint SL)
CREATE INDEX IF NOT EXISTS idx_fichas_nome_lower ON fichas (LOWER(nome));
CREATE INDEX IF NOT EXISTS idx_fichas_divisao ON fichas (divisao);
