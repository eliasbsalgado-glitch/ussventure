// API: /api/missoes/[id]/diarios — Diários pessoais de missão
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// POST — tripulante designado ou admin escreve diário
export async function POST(request, { params }) {
  const { id } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const rows = await sql`SELECT * FROM missoes WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  const missao = rows[0];
  const isAdmin = session.role === 'admin';
  const tripulantes = missao.tripulantes || [];
  const isParticipant = tripulantes.some(t => t.fichaSlug === session.fichaSlug);

  if (!isAdmin && !isParticipant) {
    return NextResponse.json({ error: 'Apenas tripulantes designados ou admin podem escrever diarios' }, { status: 403 });
  }

  const { texto } = await request.json();
  if (!texto || texto.trim().length === 0) {
    return NextResponse.json({ error: 'Texto obrigatorio' }, { status: 400 });
  }

  const diarios = missao.diarios || [];
  const entry = {
    id: 'd' + Date.now().toString(36),
    autorSlug: session.fichaSlug || session.login,
    nome: session.fichaSlug || session.login,
    data: new Date().toISOString().split('T')[0],
    texto: texto.trim(),
  };

  // Buscar nome real do autor
  if (session.fichaSlug) {
    const fichaRows = await sql`SELECT nome, patente FROM fichas WHERE slug = ${session.fichaSlug}`;
    if (fichaRows.length > 0) {
      entry.nome = fichaRows[0].nome;
      entry.patente = fichaRows[0].patente;
    }
  }

  diarios.push(entry);
  await sql`UPDATE missoes SET diarios = ${JSON.stringify(diarios)}::jsonb WHERE id = ${id}`;

  return NextResponse.json({ ok: true, entry }, { status: 201 });
}

// DELETE — autor ou admin exclui entrada de diário
export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const rows = await sql`SELECT * FROM missoes WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Missao nao encontrada' }, { status: 404 });

  const { diarioId } = await request.json();
  const diarios = rows[0].diarios || [];
  const entry = diarios.find(d => d.id === diarioId);
  if (!entry) return NextResponse.json({ error: 'Diario nao encontrado' }, { status: 404 });

  const isAdmin = session.role === 'admin';
  const isAuthor = entry.autorSlug === session.fichaSlug;
  if (!isAdmin && !isAuthor) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  const updated = diarios.filter(d => d.id !== diarioId);
  await sql`UPDATE missoes SET diarios = ${JSON.stringify(updated)}::jsonb WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}
