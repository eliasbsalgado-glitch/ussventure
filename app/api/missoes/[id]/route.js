// API: /api/missoes/[id] — Detalhes, edição e exclusão de missão
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

async function canManageMission(session, missao) {
  if (!session) return false;
  if (session.role === 'admin') return true;
  // Capitão da nave?
  const rows = await sql`SELECT capitao_slug FROM naves_crew WHERE nave_slug = ${missao.nave_slug}`;
  return rows.length > 0 && session.fichaSlug && session.fichaSlug === rows[0].capitao_slug;
}

// GET — detalhes de uma missão
export async function GET(request, { params }) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM missoes WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

// PUT — editar missão (capitão ou admin)
export async function PUT(request, { params }) {
  const { id } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const rows = await sql`SELECT * FROM missoes WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  const missao = rows[0];
  if (!(await canManageMission(session, missao))) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  const body = await request.json();
  const titulo = body.titulo || missao.titulo;
  const data = body.data || missao.data;
  const texto = body.texto !== undefined ? body.texto : missao.texto;
  const fotos = body.fotos !== undefined ? (Array.isArray(body.fotos) ? body.fotos.filter(Boolean) : []) : missao.fotos;
  const tripulantes = body.tripulantes !== undefined ? body.tripulantes : missao.tripulantes;

  await sql`
    UPDATE missoes SET
      titulo = ${titulo}, data = ${data}, texto = ${texto},
      fotos = ${JSON.stringify(fotos)}::jsonb,
      tripulantes = ${JSON.stringify(tripulantes)}::jsonb
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}

// DELETE — excluir missão (capitão ou admin)
export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const rows = await sql`SELECT * FROM missoes WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  if (!(await canManageMission(session, rows[0]))) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  await sql`DELETE FROM missoes WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
