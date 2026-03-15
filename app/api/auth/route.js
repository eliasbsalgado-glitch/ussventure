// API: /api/auth — Login e sessao simples com cookie
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request) {
  const { action, login, senha } = await request.json();

  if (action === 'login') {
    const rows = await sql`SELECT login, senha, role, ficha_slug FROM users WHERE login = ${login}`;
    if (rows.length === 0 || rows[0].senha !== senha) {
      return NextResponse.json({ error: 'Login ou senha invalidos' }, { status: 401 });
    }

    const user = rows[0];
    const session = {
      login: user.login,
      role: user.role,
      fichaSlug: user.ficha_slug || null,
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
