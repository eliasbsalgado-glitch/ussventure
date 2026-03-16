// API: /api/auth — Login e sessao simples com cookie
// Detecta automaticamente cargos (capitao, chefe_divisao) pelo fichaSlug
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

// Mapa de chefes de divisao (mesma fonte do agenda)
const DIVISAO_CHEFES = {
  'comando': { chefeSlug: 'ronnandrew-resident', nome: 'Comando' },
  'academia': { chefeSlug: 'achila16-resident', nome: 'Academia' },
  'ciencias': { chefeSlug: 'marchezini-winchester', nome: 'Ciencias' },
  'comunicacoes': { chefeSlug: 'tvashtar-uriza', nome: 'Comunicacoes' },
  'engenharia': { chefeSlug: 'laizamia-resident', nome: 'Engenharia' },
  'operacoes': { chefeSlug: 'ludmilla-benoir', nome: 'Operacoes' },
  'tatico': { chefeSlug: 'danielroma-resident', nome: 'Tatico' },
};

// Mapa de capitaes de naves ativas (hardcoded, mesmo fonte do data.js)
const NAVES_CAPITAES = {
  'adventure': { capitaoSlug: 'elemer-piek', nome: 'USS Adventure NCC 74508' },
  'altotting': { capitaoSlug: 'ronnandrew-resident', nome: 'USS Altotting NCC 171133' },
  'serenity': { capitaoSlug: 'marchezini-winchester', nome: 'USS Serenity NCC 7777' },
  'suidara': { capitaoSlug: 'kharan-resident', nome: 'USS Suidara NCC 7808' },
};

function detectCargos(fichaSlug) {
  const cargos = [];
  let naveSlug = null;
  let divisaoSlug = null;

  if (!fichaSlug) return { cargos, naveSlug, divisaoSlug };

  // Verificar se eh capitao de alguma nave
  for (const [slug, nave] of Object.entries(NAVES_CAPITAES)) {
    if (nave.capitaoSlug === fichaSlug) {
      cargos.push('capitao');
      naveSlug = slug;
      break;
    }
  }

  // Verificar se eh chefe de alguma divisao
  for (const [slug, div] of Object.entries(DIVISAO_CHEFES)) {
    if (div.chefeSlug === fichaSlug) {
      cargos.push('chefe_divisao');
      divisaoSlug = slug;
      break;
    }
  }

  return { cargos, naveSlug, divisaoSlug };
}

export async function POST(request) {
  const { action, login, senha } = await request.json();

  if (action === 'login') {
    const rows = await sql`SELECT login, senha, role, ficha_slug FROM users WHERE login = ${login}`;
    if (rows.length === 0 || rows[0].senha !== senha) {
      return NextResponse.json({ error: 'Login ou senha invalidos' }, { status: 401 });
    }

    const user = rows[0];
    const { cargos, naveSlug, divisaoSlug } = detectCargos(user.ficha_slug);

    const session = {
      login: user.login,
      role: user.role,
      fichaSlug: user.ficha_slug || null,
      cargos,
      naveSlug,
      divisaoSlug,
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
