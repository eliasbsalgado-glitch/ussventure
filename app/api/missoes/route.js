// API: /api/missoes — Lista e cria missões
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// GET — lista todas as missões (filtro opcional: ?nave=slug)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const naveFilter = searchParams.get('nave');

  let missoes;
  if (naveFilter) {
    missoes = await sql`
      SELECT id, nave_slug, titulo, data, texto, autor_slug, tripulantes, fotos, criado_em
      FROM missoes WHERE nave_slug = ${naveFilter}
      ORDER BY data DESC
    `;
  } else {
    missoes = await sql`
      SELECT id, nave_slug, titulo, data, texto, autor_slug, tripulantes, fotos, criado_em
      FROM missoes ORDER BY data DESC
    `;
  }

  return NextResponse.json(missoes);
}

// POST — capitão da nave ou admin cria missão
export async function POST(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const { naveSlug, titulo, data, texto, fotos, tripulantes } = await request.json();
  if (!naveSlug || !titulo || !data) {
    return NextResponse.json({ error: 'naveSlug, titulo e data obrigatorios' }, { status: 400 });
  }

  const isAdmin = session.role === 'admin';

  // Verificar se é capitão da nave
  if (!isAdmin) {
    const rows = await sql`SELECT capitao_slug FROM naves_crew WHERE nave_slug = ${naveSlug}`;
    const isCaptain = rows.length > 0 && session.fichaSlug && session.fichaSlug === rows[0].capitao_slug;
    if (!isCaptain) {
      return NextResponse.json({ error: 'Apenas o capitao da nave ou admin pode criar missoes' }, { status: 403 });
    }
  }

  const id = 'm' + Date.now().toString(36);
  const missao = {
    id,
    nave_slug: naveSlug,
    titulo,
    data,
    texto: texto || '',
    autor_slug: session.fichaSlug || session.login,
    tripulantes: Array.isArray(tripulantes) ? tripulantes : [],
    fotos: Array.isArray(fotos) ? fotos.filter(Boolean) : [],
  };

  await sql`
    INSERT INTO missoes (id, nave_slug, titulo, data, texto, autor_slug, tripulantes, fotos)
    VALUES (
      ${missao.id}, ${missao.nave_slug}, ${missao.titulo}, ${missao.data},
      ${missao.texto}, ${missao.autor_slug},
      ${JSON.stringify(missao.tripulantes)}::jsonb,
      ${JSON.stringify(missao.fotos)}::jsonb
    )
  `;

  return NextResponse.json({ ok: true, missao }, { status: 201 });
}
