// API: /api/diarios — Diarios de bordo pessoais
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// GET — listar diarios de um tripulante
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 });

  const session = getSession(request);
  const rows = await sql`SELECT diarios FROM fichas WHERE slug = ${slug}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Ficha nao encontrada' }, { status: 404 });

  const diarios = rows[0].diarios || [];
  const isOwner = session && (session.fichaSlug === slug || session.role === 'admin');
  const filtered = isOwner ? diarios : diarios.filter(d => d.publico);

  return NextResponse.json(filtered);
}

// POST — adicionar entrada no diario
export async function POST(request) {
  const session = getSession(request);
  if (!session || !session.fichaSlug) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const rows = await sql`SELECT diarios FROM fichas WHERE slug = ${session.fichaSlug}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Ficha nao encontrada' }, { status: 404 });

  const diarios = rows[0].diarios || [];
  const entry = {
    id: Date.now().toString(),
    data: body.data || new Date().toISOString().split('T')[0],
    texto: body.texto || '',
    publico: body.publico !== undefined ? body.publico : true,
    createdAt: new Date().toISOString(),
  };

  diarios.unshift(entry);
  await sql`UPDATE fichas SET diarios = ${JSON.stringify(diarios)}::jsonb WHERE slug = ${session.fichaSlug}`;

  return NextResponse.json(entry, { status: 201 });
}

// DELETE — remover entrada do diario
export async function DELETE(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('id');
  const slug = session.role === 'admin' ? searchParams.get('slug') : session.fichaSlug;

  if (!slug || !entryId) return NextResponse.json({ error: 'Parametros invalidos' }, { status: 400 });

  const rows = await sql`SELECT diarios FROM fichas WHERE slug = ${slug}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Ficha nao encontrada' }, { status: 404 });

  const diarios = (rows[0].diarios || []).filter(d => d.id !== entryId);
  await sql`UPDATE fichas SET diarios = ${JSON.stringify(diarios)}::jsonb WHERE slug = ${slug}`;

  return NextResponse.json({ ok: true });
}
