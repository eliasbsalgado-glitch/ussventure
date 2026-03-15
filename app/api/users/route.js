// API: /api/users — Gerenciamento de usuarios (admin only)
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// POST — criar usuario para tripulante
export async function POST(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { login, senha, fichaSlug } = await request.json();
  if (!login || !senha) {
    return NextResponse.json({ error: 'Login e senha obrigatorios' }, { status: 400 });
  }

  const existing = await sql`SELECT login FROM users WHERE login = ${login}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Usuario ja existe' }, { status: 409 });
  }

  await sql`INSERT INTO users (login, senha, role, ficha_slug) VALUES (${login}, ${senha}, 'tripulante', ${fichaSlug || null})`;
  return NextResponse.json({ ok: true, login }, { status: 201 });
}

// GET — listar usuarios (admin only)
export async function GET(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const rows = await sql`SELECT login, role, ficha_slug FROM users`;
  const sanitized = {};
  for (const r of rows) {
    sanitized[r.login] = { role: r.role, fichaSlug: r.ficha_slug };
  }
  return NextResponse.json(sanitized);
}

// PUT — alterar senha ou ficha de usuario (admin only)
export async function PUT(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { login, novaSenha, fichaSlug } = await request.json();
  if (!login) return NextResponse.json({ error: 'Login obrigatorio' }, { status: 400 });

  const existing = await sql`SELECT login FROM users WHERE login = ${login}`;
  if (existing.length === 0) return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });

  if (novaSenha) await sql`UPDATE users SET senha = ${novaSenha} WHERE login = ${login}`;
  if (fichaSlug !== undefined) await sql`UPDATE users SET ficha_slug = ${fichaSlug} WHERE login = ${login}`;

  return NextResponse.json({ ok: true, login });
}

// DELETE — remover acesso de usuario (admin only)
export async function DELETE(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { login } = await request.json();
  if (!login) return NextResponse.json({ error: 'Login obrigatorio' }, { status: 400 });

  const existing = await sql`SELECT login, role FROM users WHERE login = ${login}`;
  if (existing.length === 0) return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });

  if (existing[0].role === 'admin') {
    return NextResponse.json({ error: 'Nao e possivel excluir o administrador' }, { status: 403 });
  }

  await sql`DELETE FROM users WHERE login = ${login}`;
  return NextResponse.json({ ok: true });
}
