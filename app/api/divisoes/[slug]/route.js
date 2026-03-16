// API: /api/divisoes/[slug] — Division data management
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// Mapping of division chiefs by fichaSlug (same as auth route)
const DIVISAO_CHEFES = {
  'marchezini-winchester': 'ciencias',
  'tvashtar-uriza': 'comunicacoes',
  'laizamia': 'engenharia',
  'ludmilla-benoir': 'operacoes',
  'danielroma': 'tatico',
  'achila16': 'academia',
};

// GET — retorna dados editáveis da divisão (descricao + departamentos)
export async function GET(request, { params }) {
  const { slug } = await params;
  const rows = await sql`SELECT * FROM divisoes_data WHERE divisao_slug = ${slug}`;
  if (rows.length === 0) {
    return NextResponse.json({ descricao: '', departamentos: [] });
  }
  return NextResponse.json({
    descricao: rows[0].descricao || '',
    departamentos: rows[0].departamentos || [],
  });
}

// PUT — chefe de divisão ou admin edita dados
export async function PUT(request, { params }) {
  const { slug } = await params;
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  // Check permission: must be chief of this division or admin
  const isAdmin = session.role === 'admin';
  const chiefDivisao = DIVISAO_CHEFES[session.fichaSlug];
  const isChief = chiefDivisao === slug;
  if (!isChief && !isAdmin) {
    return NextResponse.json({ error: 'Apenas o chefe desta divisao ou admin pode editar' }, { status: 403 });
  }

  const body = await request.json();
  const { action } = body;

  // Ensure entry exists
  let rows = await sql`SELECT * FROM divisoes_data WHERE divisao_slug = ${slug}`;
  if (rows.length === 0) {
    await sql`INSERT INTO divisoes_data (divisao_slug) VALUES (${slug})`;
    rows = await sql`SELECT * FROM divisoes_data WHERE divisao_slug = ${slug}`;
  }

  let descricao = rows[0].descricao || '';
  let departamentos = rows[0].departamentos || [];

  if (action === 'updateDescricao') {
    descricao = body.descricao || '';
  } else if (action === 'addDepartamento') {
    const { nome, chefeSlug, descricao: depDesc } = body;
    if (!nome?.trim()) return NextResponse.json({ error: 'Nome do departamento obrigatorio' }, { status: 400 });
    const id = `dep-${Date.now()}`;
    departamentos.push({ id, nome: nome.trim(), chefeSlug: chefeSlug || '', descricao: depDesc || '' });
  } else if (action === 'updateDepartamento') {
    const { id, nome, chefeSlug, descricao: depDesc } = body;
    const dep = departamentos.find(d => d.id === id);
    if (!dep) return NextResponse.json({ error: 'Departamento nao encontrado' }, { status: 404 });
    if (nome !== undefined) dep.nome = nome;
    if (chefeSlug !== undefined) dep.chefeSlug = chefeSlug;
    if (depDesc !== undefined) dep.descricao = depDesc;
  } else if (action === 'removeDepartamento') {
    const { id } = body;
    departamentos = departamentos.filter(d => d.id !== id);
  } else {
    return NextResponse.json({ error: 'Acao desconhecida' }, { status: 400 });
  }

  await sql`
    UPDATE divisoes_data SET
      descricao = ${descricao},
      departamentos = ${JSON.stringify(departamentos)}::jsonb
    WHERE divisao_slug = ${slug}
  `;

  return NextResponse.json({ ok: true, descricao, departamentos });
}
