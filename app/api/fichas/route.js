// API: /api/fichas — CRUD para fichas de servico
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const divisao = searchParams.get('divisao');

  let rows;
  if (divisao) {
    rows = await sql`
      SELECT * FROM fichas
      WHERE LOWER(TRANSLATE(divisao, 'áàãâéêíóôõúüçÁÀÃÂÉÊÍÓÔÕÚÜÇ', 'aaaaeeiooouucaaaaeeiooouuc')) = ${divisao}
      ORDER BY nome
    `;
  } else {
    rows = await sql`SELECT * FROM fichas ORDER BY nome`;
  }
  return NextResponse.json(rows);
}

export async function POST(request) {
  const body = await request.json();
  let slug = slugify(body.nome || 'sem-nome');

  // Check duplicate slug
  const existing = await sql`SELECT slug FROM fichas WHERE slug = ${slug}`;
  if (existing.length > 0) {
    slug = slug + '-' + Date.now();
  }

  await sql`
    INSERT INTO fichas (slug, nome, nascimento_sl, cidade, raca, admissao, patente, divisao, departamento, foto, historia, timeline, condecoracoes, cursos, created_at)
    VALUES (
      ${slug},
      ${body.nome || ''},
      ${body.nascimentoSL || ''},
      ${body.cidade || ''},
      ${body.raca || ''},
      ${body.admissao || ''},
      ${body.patente || ''},
      ${body.divisao || ''},
      ${body.departamento || ''},
      ${body.foto || ''},
      ${body.historia || ''},
      ${JSON.stringify(body.timeline || [])},
      ${JSON.stringify(body.condecoracoes || [])},
      ${JSON.stringify(body.cursos || [])},
      ${new Date().toISOString()}
    )
  `;

  const ficha = { slug, nome: body.nome, patente: body.patente, divisao: body.divisao };
  return NextResponse.json(ficha, { status: 201 });
}
