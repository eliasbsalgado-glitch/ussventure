// API: /api/fichas/[slug] — GET, PUT, DELETE individual
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request, { params }) {
  const { slug } = await params;
  const rows = await sql`SELECT * FROM fichas WHERE slug = ${slug}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  const row = rows[0];
  const ficha = {
    slug: row.slug, nome: row.nome, nascimentoSL: row.nascimento_sl, cidade: row.cidade,
    raca: row.raca, admissao: row.admissao, patente: row.patente, divisao: row.divisao,
    departamento: row.departamento, foto: row.foto, historia: row.historia,
    timeline: row.timeline || [], condecoracoes: row.condecoracoes || [],
    cursos: row.cursos || [], diarios: row.diarios || [], createdAt: row.created_at,
  };
  return NextResponse.json(ficha);
}

export async function PUT(request, { params }) {
  const { slug } = await params;
  const body = await request.json();

  const existing = await sql`SELECT slug FROM fichas WHERE slug = ${slug}`;
  if (existing.length === 0) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  await sql`
    UPDATE fichas SET
      nome = COALESCE(${body.nome || null}, nome),
      nascimento_sl = COALESCE(${body.nascimentoSL || null}, nascimento_sl),
      cidade = COALESCE(${body.cidade || null}, cidade),
      raca = COALESCE(${body.raca || null}, raca),
      admissao = COALESCE(${body.admissao || null}, admissao),
      patente = COALESCE(${body.patente || null}, patente),
      divisao = COALESCE(${body.divisao || null}, divisao),
      departamento = COALESCE(${body.departamento || null}, departamento),
      foto = COALESCE(${body.foto || null}, foto),
      historia = COALESCE(${body.historia || null}, historia),
      timeline = COALESCE(${body.timeline ? JSON.stringify(body.timeline) : null}::jsonb, timeline),
      condecoracoes = COALESCE(${body.condecoracoes ? JSON.stringify(body.condecoracoes) : null}::jsonb, condecoracoes),
      cursos = COALESCE(${body.cursos ? JSON.stringify(body.cursos) : null}::jsonb, cursos),
      diarios = COALESCE(${body.diarios ? JSON.stringify(body.diarios) : null}::jsonb, diarios)
    WHERE slug = ${slug}
  `;

  const updated = await sql`SELECT * FROM fichas WHERE slug = ${slug}`;
  return NextResponse.json(updated[0]);
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  const existing = await sql`SELECT slug FROM fichas WHERE slug = ${slug}`;
  if (existing.length === 0) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  await sql`DELETE FROM fichas WHERE slug = ${slug}`;
  return NextResponse.json({ ok: true });
}
