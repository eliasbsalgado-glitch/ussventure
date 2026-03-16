// API: /api/fichas/[slug]/cursos — Adicionar cursos da Academia
// Auth: admin OU chefe_divisao da academia
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

export async function PUT(request, { params }) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  // Auth: admin OR chefe_divisao of academia
  const isAdmin = session.role === 'admin';
  const isChefAcademia = session.cargos?.includes('chefe_divisao') && session.divisaoSlug === 'academia';

  if (!isAdmin && !isChefAcademia) {
    return NextResponse.json({ error: 'Nao autorizado. Apenas admin ou chefe da Academia.' }, { status: 403 });
  }

  const { slug } = await params;
  const body = await request.json();

  // Validate action
  if (body.action !== 'add') {
    return NextResponse.json({ error: 'Acao invalida. Apenas "add" permitido.' }, { status: 400 });
  }

  // Validate curso data
  const { curso } = body;
  if (!curso || !curso.nome) {
    return NextResponse.json({ error: 'Nome do curso obrigatorio' }, { status: 400 });
  }

  // Fetch current ficha
  const rows = await sql`SELECT slug, nome, cursos FROM fichas WHERE slug = ${slug}`;
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Ficha nao encontrada' }, { status: 404 });
  }

  const currentCursos = rows[0].cursos || [];
  const newCurso = { nome: curso.nome, data: curso.data || new Date().toISOString().split('T')[0] };
  const updatedCursos = [...currentCursos, newCurso];

  await sql`
    UPDATE fichas SET cursos = ${JSON.stringify(updatedCursos)}::jsonb
    WHERE slug = ${slug}
  `;

  return NextResponse.json({
    ok: true,
    cursos: updatedCursos,
    oficialNome: rows[0].nome,
  });
}
