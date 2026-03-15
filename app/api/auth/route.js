// API: /api/auth — Login e sessao simples com cookie
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

export async function POST(request) {
  const { action, login, senha } = await request.json();

  if (action === 'login') {
    const users = getUsers();
    const user = users[login];
    if (!user || user.senha !== senha) {
      return NextResponse.json({ error: 'Login ou senha invalidos' }, { status: 401 });
    }

    const session = {
      login,
      role: user.role,
      fichaSlug: user.fichaSlug || null,
    };

    const res = NextResponse.json(session);
    res.cookies.set('session', JSON.stringify(session), {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
    return res;
  }

  if (action === 'logout') {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete('session');
    return res;
  }

  if (action === 'me') {
    const cookie = request.cookies.get('session');
    if (!cookie) return NextResponse.json({ logged: false });
    try {
      const session = JSON.parse(cookie.value);
      return NextResponse.json({ logged: true, ...session });
    } catch {
      return NextResponse.json({ logged: false });
    }
  }

  return NextResponse.json({ error: 'Acao desconhecida' }, { status: 400 });
}
