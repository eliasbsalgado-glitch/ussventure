// API: /api/naves/[slug] — Crew management + ship info editing
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// GET — retorna tripulação, missões e info da nave
export async function GET(request, { params }) {
  const { slug } = await params;
  const rows = await sql`SELECT * FROM naves_crew WHERE nave_slug = ${slug}`;
  if (rows.length === 0) {
    return NextResponse.json({ capitaoSlug: null, classe: '', tipo: '', status: 'Ativa', tripulantes: [], missoes: [], fotos: [] });
  }
  const r = rows[0];
  return NextResponse.json({
    capitaoSlug: r.capitao_slug,
    classe: r.classe || '',
    tipo: r.tipo || '',
    status: r.status || 'Ativa',
    tripulantes: r.tripulantes || [],
    missoes: r.missoes || [],
    fotos: r.fotos || [],
  });
}

// PUT — capitão ou admin gerencia tripulação e info da nave
export async function PUT(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  // Ensure entry exists
  let rows = await sql`SELECT * FROM naves_crew WHERE nave_slug = ${slug}`;
  if (rows.length === 0) {
    await sql`INSERT INTO naves_crew (nave_slug) VALUES (${slug})`;
    rows = await sql`SELECT * FROM naves_crew WHERE nave_slug = ${slug}`;
  }

  const naveCrew = {
    capitaoSlug: rows[0].capitao_slug,
    classe: rows[0].classe || '',
    tipo: rows[0].tipo || '',
    status: rows[0].status || 'Ativa',
    tripulantes: rows[0].tripulantes || [],
    missoes: rows[0].missoes || [],
    fotos: rows[0].fotos || [],
  };

  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitaoSlug;
  const isAdmin = session.role === 'admin';
  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao ou admin podem gerenciar a nave' }, { status: 403 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === 'addTripulante') {
    const { fichaSlug, posto } = body;
    if (!fichaSlug) return NextResponse.json({ error: 'fichaSlug obrigatorio' }, { status: 400 });
    if (naveCrew.tripulantes.find(t => t.fichaSlug === fichaSlug)) {
      return NextResponse.json({ error: 'Tripulante ja embarcado' }, { status: 409 });
    }
    naveCrew.tripulantes.push({ fichaSlug, posto: posto || 'Tripulante' });
  } else if (action === 'removeTripulante') {
    const { fichaSlug } = body;
    if (fichaSlug === naveCrew.capitaoSlug) {
      return NextResponse.json({ error: 'Nao e possivel remover o capitao' }, { status: 400 });
    }
    naveCrew.tripulantes = naveCrew.tripulantes.filter(t => t.fichaSlug !== fichaSlug);
  } else if (action === 'updatePosto') {
    const { fichaSlug, posto } = body;
    const trip = naveCrew.tripulantes.find(t => t.fichaSlug === fichaSlug);
    if (!trip) return NextResponse.json({ error: 'Tripulante nao encontrado' }, { status: 404 });
    trip.posto = posto;
  } else if (action === 'setCapitao') {
    if (!isAdmin) return NextResponse.json({ error: 'Apenas admin pode definir capitao' }, { status: 403 });
    naveCrew.capitaoSlug = body.capitaoSlug || null;
  } else if (action === 'updateInfo') {
    // Update ship metadata (classe, tipo, status)
    if (body.classe !== undefined) naveCrew.classe = body.classe;
    if (body.tipo !== undefined) naveCrew.tipo = body.tipo;
    if (body.status !== undefined) naveCrew.status = body.status;
  } else if (action === 'addFoto') {
    const { url, legenda } = body;
    if (!url) return NextResponse.json({ error: 'URL obrigatoria' }, { status: 400 });
    naveCrew.fotos.push({ url, legenda: legenda || '' });
  } else if (action === 'removeFoto') {
    const { index } = body;
    if (!naveCrew.fotos || !naveCrew.fotos[index]) {
      return NextResponse.json({ error: 'Foto nao encontrada' }, { status: 404 });
    }
    naveCrew.fotos.splice(index, 1);
  } else {
    return NextResponse.json({ error: 'Acao desconhecida' }, { status: 400 });
  }

  await sql`
    UPDATE naves_crew SET
      capitao_slug = ${naveCrew.capitaoSlug},
      classe = ${naveCrew.classe},
      tipo = ${naveCrew.tipo},
      status = ${naveCrew.status},
      tripulantes = ${JSON.stringify(naveCrew.tripulantes)}::jsonb,
      fotos = ${JSON.stringify(naveCrew.fotos)}::jsonb
    WHERE nave_slug = ${slug}
  `;

  return NextResponse.json({
    ok: true,
    classe: naveCrew.classe,
    tipo: naveCrew.tipo,
    status: naveCrew.status,
    tripulantes: naveCrew.tripulantes,
    fotos: naveCrew.fotos,
  });
}
