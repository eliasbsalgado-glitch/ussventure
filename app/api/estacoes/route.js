// API: /api/estacoes — CRUD estacoes espaciais
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// GET — listar estacoes (publico)
export async function GET() {
  const rows = await sql`SELECT * FROM estacoes ORDER BY ordem, criado_em`;
  return NextResponse.json(rows.map(r => ({
    slug: r.slug, nome: r.nome, cor: r.cor, status: r.status || 'Ativa',
    dataConstrucao: r.data_construcao, construtorSlugs: r.construtor_slugs || [],
    lema: r.lema, descricao: r.descricao, descricaoExtra: r.descricao_extra,
    decks: r.decks || [], fotos: r.fotos || [], ordem: r.ordem,
  })));
}

// POST — criar estacao (admin)
export async function POST(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { nome, cor, status, dataConstrucao, construtorSlugs, lema, descricao, descricaoExtra, decks, fotos } = body;
  if (!nome?.trim()) return NextResponse.json({ error: 'Nome obrigatorio' }, { status: 400 });

  const slug = slugify(nome);
  const existing = await sql`SELECT slug FROM estacoes WHERE slug = ${slug}`;
  if (existing.length > 0) return NextResponse.json({ error: 'Estacao com esse nome ja existe' }, { status: 409 });

  const maxOrder = await sql`SELECT COALESCE(MAX(ordem), 0)::int as m FROM estacoes`;
  const ordem = (maxOrder[0]?.m || 0) + 1;

  await sql`
    INSERT INTO estacoes (slug, nome, cor, status, data_construcao, construtor_slugs, lema, descricao, descricao_extra, decks, fotos, ordem)
    VALUES (${slug}, ${nome.trim()}, ${cor || '#6688CC'}, ${status || 'Ativa'}, ${dataConstrucao || ''}, ${JSON.stringify(construtorSlugs || [])}::jsonb, ${lema || ''}, ${descricao || ''}, ${descricaoExtra || ''}, ${JSON.stringify(decks || [])}::jsonb, ${JSON.stringify(fotos || [])}::jsonb, ${ordem})
  `;

  return NextResponse.json({ ok: true, slug }, { status: 201 });
}

// PUT — editar estacao (admin)
export async function PUT(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, nome, cor, status, dataConstrucao, construtorSlugs, lema, descricao, descricaoExtra, decks, fotos } = body;
  if (!slug) return NextResponse.json({ error: 'Slug obrigatorio' }, { status: 400 });

  const existing = await sql`SELECT slug FROM estacoes WHERE slug = ${slug}`;
  if (existing.length === 0) return NextResponse.json({ error: 'Estacao nao encontrada' }, { status: 404 });

  await sql`
    UPDATE estacoes SET
      nome = COALESCE(${nome || null}, nome),
      cor = COALESCE(${cor || null}, cor),
      status = COALESCE(${status || null}, status),
      data_construcao = COALESCE(${dataConstrucao !== undefined ? dataConstrucao : null}, data_construcao),
      construtor_slugs = COALESCE(${construtorSlugs ? JSON.stringify(construtorSlugs) : null}::jsonb, construtor_slugs),
      lema = COALESCE(${lema !== undefined ? lema : null}, lema),
      descricao = COALESCE(${descricao !== undefined ? descricao : null}, descricao),
      descricao_extra = COALESCE(${descricaoExtra !== undefined ? descricaoExtra : null}, descricao_extra),
      decks = COALESCE(${decks ? JSON.stringify(decks) : null}::jsonb, decks),
      fotos = COALESCE(${fotos ? JSON.stringify(fotos) : null}::jsonb, fotos)
    WHERE slug = ${slug}
  `;

  return NextResponse.json({ ok: true });
}

// DELETE — excluir estacao (admin)
export async function DELETE(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { slug } = await request.json();
  if (!slug) return NextResponse.json({ error: 'Slug obrigatorio' }, { status: 400 });

  await sql`DELETE FROM estacoes WHERE slug = ${slug}`;
  return NextResponse.json({ ok: true });
}
