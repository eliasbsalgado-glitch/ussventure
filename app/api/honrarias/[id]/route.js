// API: /api/honrarias/[id] — Detalhe de honraria + oficiais condecorados
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

// GET — buscar honraria por ID + oficiais que a possuem
export async function GET(request, { params }) {
  const { id } = await params;

  // 1. Buscar honraria
  const rows = await sql`SELECT * FROM honrarias WHERE id = ${id}`;
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Honraria nao encontrada' }, { status: 404 });
  }

  const honraria = {
    id: rows[0].id,
    categoria: rows[0].categoria,
    nome: rows[0].nome,
    descricao: rows[0].descricao,
    imagem: rows[0].imagem,
    ordem: rows[0].ordem,
  };

  // 2. Buscar oficiais cujo array condecoracoes contem este ID
  const oficiais = await sql`
    SELECT slug, nome, patente, divisao, foto
    FROM fichas
    WHERE condecoracoes @> ${JSON.stringify([id])}::jsonb
    ORDER BY nome
  `;

  return NextResponse.json({
    honraria,
    oficiais: oficiais.map(o => ({
      slug: o.slug,
      nome: o.nome,
      patente: o.patente,
      divisao: o.divisao,
      foto: o.foto,
    })),
    total: oficiais.length,
  });
}
