// API: /api/agenda — Gerenciamento de eventos da agenda por divisao
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

const DIVISAO_CHEFES = {
  'comando': { chefeSlug: 'ronnandrew-resident', nome: 'Comando', cor: '#CC6666' },
  'academia': { chefeSlug: 'achila16-resident', nome: 'Academia', cor: '#999999' },
  'ciencias': { chefeSlug: 'marchezini-winchester', nome: 'Ciencias', cor: '#6688CC' },
  'comunicacoes': { chefeSlug: 'tvashtar-uriza', nome: 'Comunicacoes', cor: '#66CC66' },
  'engenharia': { chefeSlug: 'laizamia-resident', nome: 'Engenharia', cor: '#FFAA00' },
  'operacoes': { chefeSlug: 'ludmilla-benoir', nome: 'Operacoes', cor: '#FFAA00' },
  'tatico': { chefeSlug: 'danielroma-resident', nome: 'Tatico', cor: '#CC6666' },
};

function getUserDivisao(session) {
  if (!session?.fichaSlug) return null;
  if (session.role === 'admin') return 'admin';
  for (const [key, val] of Object.entries(DIVISAO_CHEFES)) {
    if (val.chefeSlug === session.fichaSlug) return key;
  }
  return null;
}

// GET — listar eventos (publico)
export async function GET() {
  const rows = await sql`SELECT * FROM agenda_eventos ORDER BY data`;
  const eventos = rows.map(r => ({
    id: r.id, divisao: r.divisao, divisaoNome: r.divisao_nome, divisaoCor: r.divisao_cor,
    titulo: r.titulo, data: r.data, texto: r.texto, autorSlug: r.autor_slug, criadoEm: r.criado_em,
  }));
  return NextResponse.json(eventos);
}

// POST — criar evento
export async function POST(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const userDiv = getUserDivisao(session);
  if (!userDiv) return NextResponse.json({ error: 'Apenas chefes de divisao podem criar eventos' }, { status: 403 });

  const { divisao, titulo, data, texto } = await request.json();
  if (!titulo || !data) return NextResponse.json({ error: 'Titulo e data obrigatorios' }, { status: 400 });

  const targetDiv = (session.role === 'admin' && divisao) ? divisao : userDiv;
  if (targetDiv === 'admin' && !divisao) {
    return NextResponse.json({ error: 'Admin precisa especificar a divisao' }, { status: 400 });
  }

  const divInfo = DIVISAO_CHEFES[targetDiv];
  if (!divInfo && session.role !== 'admin') {
    return NextResponse.json({ error: 'Divisao invalida' }, { status: 400 });
  }

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const evento = {
    id, divisao: targetDiv, divisaoNome: divInfo?.nome || targetDiv, divisaoCor: divInfo?.cor || '#888',
    titulo, data, texto: texto || '', autorSlug: session.fichaSlug || 'admin', criadoEm: new Date().toISOString(),
  };

  await sql`
    INSERT INTO agenda_eventos (id, divisao, divisao_nome, divisao_cor, titulo, data, texto, autor_slug, criado_em)
    VALUES (${evento.id}, ${evento.divisao}, ${evento.divisaoNome}, ${evento.divisaoCor}, ${evento.titulo}, ${evento.data}, ${evento.texto}, ${evento.autorSlug}, ${evento.criadoEm})
  `;

  return NextResponse.json({ ok: true, evento }, { status: 201 });
}

// PUT — editar evento
export async function PUT(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const userDiv = getUserDivisao(session);
  if (!userDiv) return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });

  const { id, titulo, data, texto } = await request.json();
  const rows = await sql`SELECT * FROM agenda_eventos WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Evento nao encontrado' }, { status: 404 });

  if (session.role !== 'admin' && rows[0].divisao !== userDiv) {
    return NextResponse.json({ error: 'Sem permissao para editar este evento' }, { status: 403 });
  }

  await sql`
    UPDATE agenda_eventos SET
      titulo = COALESCE(${titulo || null}, titulo),
      data = COALESCE(${data || null}, data),
      texto = COALESCE(${texto !== undefined ? texto : null}, texto)
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}

// DELETE — remover evento
export async function DELETE(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const userDiv = getUserDivisao(session);
  if (!userDiv) return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });

  const { id } = await request.json();
  const rows = await sql`SELECT * FROM agenda_eventos WHERE id = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Evento nao encontrado' }, { status: 404 });

  if (session.role !== 'admin' && rows[0].divisao !== userDiv) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  await sql`DELETE FROM agenda_eventos WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
