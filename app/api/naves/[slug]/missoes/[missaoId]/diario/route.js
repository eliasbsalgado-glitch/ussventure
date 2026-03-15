// API: /api/naves/[slug]/missoes/[missaoId]/diario — Personal diary entries
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

// GET — retorna diários de uma missão específica
export async function GET(request, { params }) {
  const { slug, missaoId } = await params;
  const crew = getCrew();
  const naveCrew = crew[slug];
  if (!naveCrew) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  const missao = (naveCrew.missoes || []).find(m => m.id === missaoId);
  if (!missao) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  return NextResponse.json(missao);
}

// POST — tripulante da nave adiciona diário pessoal à missão
export async function POST(request, { params }) {
  const { slug, missaoId } = await params;
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const crew = getCrew();
  const naveCrew = crew[slug];
  if (!naveCrew) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  // Verificar se é tripulante da nave
  const isCrew = naveCrew.tripulantes.some(t => t.fichaSlug === session.fichaSlug);
  const isAdmin = session.role === 'admin';
  if (!isCrew && !isAdmin) {
    return NextResponse.json({ error: 'Apenas tripulantes da nave podem adicionar diarios' }, { status: 403 });
  }

  const missao = (naveCrew.missoes || []).find(m => m.id === missaoId);
  if (!missao) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  const { texto } = await request.json();
  if (!texto) {
    return NextResponse.json({ error: 'Texto obrigatorio' }, { status: 400 });
  }

  if (!missao.diarios) missao.diarios = [];

  const diario = {
    autorSlug: session.fichaSlug,
    autorNome: session.login,
    data: new Date().toISOString().split('T')[0],
    texto,
  };

  missao.diarios.push(diario);
  saveCrew(crew);

  return NextResponse.json({ ok: true, diario }, { status: 201 });
}

// DELETE — capitão exclui qualquer diário, tripulante exclui o próprio
export async function DELETE(request, { params }) {
  const { slug, missaoId } = await params;
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const crew = getCrew();
  const naveCrew = crew[slug];
  if (!naveCrew) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  const missao = (naveCrew.missoes || []).find(m => m.id === missaoId);
  if (!missao) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  const { diarioIndex } = await request.json();
  if (diarioIndex === undefined || !missao.diarios || !missao.diarios[diarioIndex]) {
    return NextResponse.json({ error: 'Diario nao encontrado' }, { status: 404 });
  }

  const diario = missao.diarios[diarioIndex];
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitaoSlug;
  const isAdmin = session.role === 'admin';
  const isOwner = session.fichaSlug && session.fichaSlug === diario.autorSlug;

  if (!isCaptain && !isAdmin && !isOwner) {
    return NextResponse.json({ error: 'Sem permissao para excluir este diario' }, { status: 403 });
  }

  missao.diarios.splice(diarioIndex, 1);
  saveCrew(crew);

  return NextResponse.json({ ok: true, diarios: missao.diarios });
}
