// API: /api/push/setup — Criar tabela push_subscriptions (executar 1x)
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id TEXT PRIMARY KEY,
        endpoint TEXT UNIQUE NOT NULL,
        subscription TEXT NOT NULL,
        criado_em TIMESTAMPTZ DEFAULT NOW(),
        atualizado_em TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    return NextResponse.json({ ok: true, msg: 'Tabela push_subscriptions criada/verificada.' });
  } catch (err) {
    console.error('[PUSH SETUP] Erro:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
