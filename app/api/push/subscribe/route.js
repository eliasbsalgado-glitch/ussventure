// API: /api/push/subscribe — Gerenciar push subscriptions
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

// POST — Salvar subscription
export async function POST(request) {
  try {
    const { subscription } = await request.json();
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Subscription invalida' }, { status: 400 });
    }

    const endpoint = subscription.endpoint;

    // Verificar se ja existe
    const existing = await sql`
      SELECT id FROM push_subscriptions WHERE endpoint = ${endpoint}
    `;

    if (existing.length > 0) {
      // Atualizar subscription existente
      await sql`
        UPDATE push_subscriptions
        SET subscription = ${JSON.stringify(subscription)}, atualizado_em = NOW()
        WHERE endpoint = ${endpoint}
      `;
    } else {
      // Inserir nova
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      await sql`
        INSERT INTO push_subscriptions (id, endpoint, subscription, criado_em, atualizado_em)
        VALUES (${id}, ${endpoint}, ${JSON.stringify(subscription)}, NOW(), NOW())
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUSH] Erro ao salvar subscription:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE — Remover subscription
export async function DELETE(request) {
  try {
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint requerido' }, { status: 400 });
    }

    await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUSH] Erro ao remover subscription:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
