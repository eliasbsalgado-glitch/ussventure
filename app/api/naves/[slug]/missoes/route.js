// API: /api/naves/[slug]/missoes — Mission management
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// GET — lista missões de uma nave
export async function GET(request, { params }) {
  const { slug } = await params;
  const rows = await sql`SELECT missoes FROM naves_crew WHERE nave_slug = ${slug}`;
  if (rows.length === 0) return NextResponse.json([]);
  return NextResponse.json(rows[0].missoes || []);
}

// POST — capitão cria nova missão
export async function POST(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const rows = await sql`SELECT * FROM naves_crew WHERE nave_slug = ${slug}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  const naveCrew = rows[0];
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitao_slug;
  const isAdmin = session.role === 'admin';
  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao pode criar missoes' }, { status: 403 });
  }

  const { titulo, data, texto, fotos } = await request.json();
  if (!titulo || !data || !texto) {
    return NextResponse.json({ error: 'Titulo, data e texto obrigatorios' }, { status: 400 });
  }

  const missoes = naveCrew.missoes || [];
  const missao = {
    id: 'm' + Date.now().toString(36),
    titulo, data, texto,
    autorSlug: session.fichaSlug || session.login,
    fotos: Array.isArray(fotos) ? fotos.filter(Boolean) : [],
    diarios: [],
  };

  missoes.unshift(missao);
  await sql`UPDATE naves_crew SET missoes = ${JSON.stringify(missoes)}::jsonb WHERE nave_slug = ${slug}`;

  return NextResponse.json({ ok: true, missao }, { status: 201 });
}

// PUT — capitão edita missão existente
export async function PUT(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const rows = await sql`SELECT * FROM naves_crew WHERE nave_slug = ${slug}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  const naveCrew = rows[0];
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitao_slug;
  const isAdmin = session.role === 'admin';
  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao pode editar missoes' }, { status: 403 });
  }

  const { missaoId, titulo, data, texto, fotos } = await request.json();
  const missoes = naveCrew.missoes || [];
  const missao = missoes.find(m => m.id === missaoId);
  if (!missao) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  if (titulo) missao.titulo = titulo;
  if (data) missao.data = data;
  if (texto) missao.texto = texto;
  if (fotos !== undefined) missao.fotos = Array.isArray(fotos) ? fotos.filter(Boolean) : [];

  await sql`UPDATE naves_crew SET missoes = ${JSON.stringify(missoes)}::jsonb WHERE nave_slug = ${slug}`;
  return NextResponse.json({ ok: true, missao });
}

// DELETE — capitão exclui missão
export async function DELETE(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const rows = await sql`SELECT * FROM naves_crew WHERE nave_slug = ${slug}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Nave nao encontrada' }, { status: 404 });

  const naveCrew = rows[0];
  const isCaptain = session.fichaSlug && session.fichaSlug === naveCrew.capitao_slug;
  const isAdmin = session.role === 'admin';
  if (!isCaptain && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o capitao pode excluir missoes' }, { status: 403 });
  }

  const { missaoId } = await request.json();
  const missoes = (naveCrew.missoes || []).filter(m => m.id !== missaoId);

  await sql`UPDATE naves_crew SET missoes = ${JSON.stringify(missoes)}::jsonb WHERE nave_slug = ${slug}`;
  return NextResponse.json({ ok: true, missoes });
}
