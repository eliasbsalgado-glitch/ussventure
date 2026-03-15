// API: /api/naves/[slug]/missoes — Mission management
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CREW_FILE = path.join(process.cwd(), 'data', 'naves_crew.json');

function getCrew() {
  if (!fs.existsSync(CREW_FILE)) return {};
  return JSON.parse(fs.readFileSync(CREW_FILE, 'utf-8'));
}

function saveCrew(data) {
  fs.writeFileSync(CREW_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// GET — lista missões de uma nave
export async function GET(request, { params }) {
  const { slug } = await params;
  const crew = getCrew();
  const naveCrew = crew[slug];
  if (!naveCrew) return NextResponse.json([]);
  return NextResponse.json(naveCrew.missoes || []);
}

// POST — capitão cria nova missão
export async function POST(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const crew = getCrew();
  if (!crew[slug]) {
    return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });
  }

  const naveCrew = crew[slug];
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitaoSlug;
  const isAdmin = session.role === 'admin';

  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao pode criar missoes' }, { status: 403 });
  }

  const { titulo, data, texto, fotos } = await request.json();
  if (!titulo || !data || !texto) {
    return NextResponse.json({ error: 'Titulo, data e texto obrigatorios' }, { status: 400 });
  }

  const id = 'm' + Date.now().toString(36);

  const missao = {
    id,
    titulo,
    data,
    texto,
    autorSlug: session.fichaSlug || session.login,
    fotos: Array.isArray(fotos) ? fotos.filter(Boolean) : [],
    diarios: [],
  };

  if (!naveCrew.missoes) naveCrew.missoes = [];
  naveCrew.missoes.unshift(missao); // mais recente primeiro
  saveCrew(crew);

  return NextResponse.json({ ok: true, missao }, { status: 201 });
}

// PUT — capitão edita missão existente
export async function PUT(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const crew = getCrew();
  if (!crew[slug]) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  const naveCrew = crew[slug];
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitaoSlug;
  const isAdmin = session.role === 'admin';
  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao pode editar missoes' }, { status: 403 });
  }

  const { missaoId, titulo, data, texto, fotos } = await request.json();
  const missao = (naveCrew.missoes || []).find(m => m.id === missaoId);
  if (!missao) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  if (titulo) missao.titulo = titulo;
  if (data) missao.data = data;
  if (texto) missao.texto = texto;
  if (fotos !== undefined) missao.fotos = Array.isArray(fotos) ? fotos.filter(Boolean) : [];
  saveCrew(crew);

  return NextResponse.json({ ok: true, missao });
}

// DELETE — capitão exclui missão
export async function DELETE(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const crew = getCrew();
  if (!crew[slug]) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  const naveCrew = crew[slug];
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitaoSlug;
  const isAdmin = session.role === 'admin';
  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao pode excluir missoes' }, { status: 403 });
  }

  const { missaoId } = await request.json();
  const idx = (naveCrew.missoes || []).findIndex(m => m.id === missaoId);
  if (idx === -1) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  naveCrew.missoes.splice(idx, 1);
  saveCrew(crew);

  return NextResponse.json({ ok: true, missoes: naveCrew.missoes });
}
