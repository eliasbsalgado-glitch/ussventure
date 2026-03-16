// API: /api/honrarias — CRUD de honrarias/condecoracoes
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// GET — listar honrarias (publico)
export async function GET() {
  const rows = await sql`SELECT * FROM honrarias ORDER BY categoria, ordem, nome`;
  const honrarias = rows.map(r => ({
    id: r.id,
    categoria: r.categoria,
    nome: r.nome,
    descricao: r.descricao,
    imagem: r.imagem,
    ordem: r.ordem,
    criadoEm: r.criado_em,
  }));
  return NextResponse.json(honrarias);
}

// POST — criar honraria (admin only)
export async function POST(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { categoria, nome, descricao, imagem } = await request.json();
  if (!categoria || !nome) {
    return NextResponse.json({ error: 'Categoria e nome obrigatorios' }, { status: 400 });
  }

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // Get next order number for this category
  const maxOrder = await sql`SELECT COALESCE(MAX(ordem), 0)::int as max_ordem FROM honrarias WHERE categoria = ${categoria}`;
  const ordem = (maxOrder[0]?.max_ordem || 0) + 1;

  await sql`
    INSERT INTO honrarias (id, categoria, nome, descricao, imagem, ordem)
    VALUES (${id}, ${categoria}, ${nome}, ${descricao || ''}, ${imagem || ''}, ${ordem})
  `;

  return NextResponse.json({
    ok: true,
    honraria: { id, categoria, nome, descricao: descricao || '', imagem: imagem || '', ordem },
  }, { status: 201 });
}

// PUT — editar honraria (admin only)
export async function PUT(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { id, categoria, nome, descricao, imagem, ordem } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID obrigatorio' }, { status: 400 });

  const existing = await sql`SELECT id FROM honrarias WHERE id = ${id}`;
  if (existing.length === 0) return NextResponse.json({ error: 'Honraria nao encontrada' }, { status: 404 });

  await sql`
    UPDATE honrarias SET
      categoria = COALESCE(${categoria || null}, categoria),
      nome = COALESCE(${nome || null}, nome),
      descricao = COALESCE(${descricao !== undefined ? descricao : null}, descricao),
      imagem = COALESCE(${imagem !== undefined ? imagem : null}, imagem),
      ordem = COALESCE(${ordem !== undefined ? ordem : null}, ordem)
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}

// DELETE — excluir honraria (admin only)
export async function DELETE(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID obrigatorio' }, { status: 400 });

  const existing = await sql`SELECT id FROM honrarias WHERE id = ${id}`;
  if (existing.length === 0) return NextResponse.json({ error: 'Honraria nao encontrada' }, { status: 404 });

  await sql`DELETE FROM honrarias WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
