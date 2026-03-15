// API: /api/naves/[slug] — Crew management
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

// GET — retorna tripulação e missões de uma nave
export async function GET(request, { params }) {
  const { slug } = await params;
  const crew = getCrew();
  const naveCrew = crew[slug] || { capitaoSlug: null, tripulantes: [], missoes: [] };
  return NextResponse.json(naveCrew);
}

// PUT — capitão ou admin gerencia tripulação
export async function PUT(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const crew = getCrew();
  if (!crew[slug]) {
    crew[slug] = { capitaoSlug: null, tripulantes: [], missoes: [] };
  }

  const naveCrew = crew[slug];

  // Verificar se é capitão ou admin
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitaoSlug;
  const isAdmin = session.role === 'admin';
  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao ou admin podem gerenciar a tripulacao' }, { status: 403 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === 'addTripulante') {
    const { fichaSlug, posto } = body;
    if (!fichaSlug) return NextResponse.json({ error: 'fichaSlug obrigatorio' }, { status: 400 });
    // Verificar se já existe
    if (naveCrew.tripulantes.find(t => t.fichaSlug === fichaSlug)) {
      return NextResponse.json({ error: 'Tripulante ja embarcado' }, { status: 409 });
    }
    naveCrew.tripulantes.push({ fichaSlug, posto: posto || 'Tripulante' });
    saveCrew(crew);
    return NextResponse.json({ ok: true, tripulantes: naveCrew.tripulantes });
  }

  if (action === 'removeTripulante') {
    const { fichaSlug } = body;
    // Não permitir remover o capitão
    if (fichaSlug === naveCrew.capitaoSlug) {
      return NextResponse.json({ error: 'Nao e possivel remover o capitao' }, { status: 400 });
    }
    naveCrew.tripulantes = naveCrew.tripulantes.filter(t => t.fichaSlug !== fichaSlug);
    saveCrew(crew);
    return NextResponse.json({ ok: true, tripulantes: naveCrew.tripulantes });
  }

  if (action === 'updatePosto') {
    const { fichaSlug, posto } = body;
    const trip = naveCrew.tripulantes.find(t => t.fichaSlug === fichaSlug);
    if (!trip) return NextResponse.json({ error: 'Tripulante nao encontrado' }, { status: 404 });
    trip.posto = posto;
    saveCrew(crew);
    return NextResponse.json({ ok: true, tripulantes: naveCrew.tripulantes });
  }

  if (action === 'setCapitao') {
    if (!isAdmin) return NextResponse.json({ error: 'Apenas admin pode definir capitao' }, { status: 403 });
    naveCrew.capitaoSlug = body.capitaoSlug || null;
    saveCrew(crew);
    return NextResponse.json({ ok: true });
  }

  if (action === 'addFoto') {
    const { url, legenda } = body;
    if (!url) return NextResponse.json({ error: 'URL obrigatoria' }, { status: 400 });
    if (!naveCrew.fotos) naveCrew.fotos = [];
    naveCrew.fotos.push({ url, legenda: legenda || '' });
    saveCrew(crew);
    return NextResponse.json({ ok: true, fotos: naveCrew.fotos });
  }

  if (action === 'removeFoto') {
    const { index } = body;
    if (!naveCrew.fotos || !naveCrew.fotos[index]) {
      return NextResponse.json({ error: 'Foto nao encontrada' }, { status: 404 });
    }
    naveCrew.fotos.splice(index, 1);
    saveCrew(crew);
    return NextResponse.json({ ok: true, fotos: naveCrew.fotos });
  }

  return NextResponse.json({ error: 'Acao desconhecida' }, { status: 400 });
}
