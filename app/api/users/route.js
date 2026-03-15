// API: /api/users — Gerenciamento de usuarios (admin only)
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

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

  const users = getUsers();
  if (users[login]) {
    return NextResponse.json({ error: 'Usuario ja existe' }, { status: 409 });
  }

  users[login] = {
    senha,
    role: 'tripulante',
    fichaSlug: fichaSlug || null,
  };

  saveUsers(users);
  return NextResponse.json({ ok: true, login }, { status: 201 });
}

// GET — listar usuarios (admin only)
export async function GET(request) {
  const session = getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const users = getUsers();
  // Remove senhas do retorno
  const sanitized = {};
  for (const [k, v] of Object.entries(users)) {
    sanitized[k] = { role: v.role, fichaSlug: v.fichaSlug };
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

  const users = getUsers();
  if (!users[login]) return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });

  if (novaSenha) users[login].senha = novaSenha;
  if (fichaSlug !== undefined) users[login].fichaSlug = fichaSlug;
  saveUsers(users);

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

  const users = getUsers();
  if (!users[login]) return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });

  // Não permitir excluir o admin
  if (users[login].role === 'admin') {
    return NextResponse.json({ error: 'Nao e possivel excluir o administrador' }, { status: 403 });
  }

  delete users[login];
  saveUsers(users);

  return NextResponse.json({ ok: true });
}
