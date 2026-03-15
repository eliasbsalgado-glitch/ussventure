// ============================================
// PUSH NOTIFICATION HELPER — Web Push API
// Envia push notifications para todos os inscritos
// ============================================

import webpush from 'web-push';
import sql from '@/lib/db';

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:admin@frotaventure.com';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
}

// Enviar notificacao para todos os inscritos
export async function sendPushToAll(title, body, url = '/') {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.warn('[PUSH] VAPID keys nao configuradas, pulando notificacao');
    return { sent: 0, failed: 0 };
  }

  const rows = await sql`SELECT id, subscription FROM push_subscriptions`;
  if (rows.length === 0) return { sent: 0, failed: 0 };

  const payload = JSON.stringify({ title, body, url });
  let sent = 0;
  let failed = 0;
  const toRemove = [];

  for (const row of rows) {
    try {
      const sub = typeof row.subscription === 'string'
        ? JSON.parse(row.subscription)
        : row.subscription;
      await webpush.sendNotification(sub, payload);
      sent++;
    } catch (err) {
      failed++;
      // Se a subscription expirou ou foi revogada, marcar para remocao
      if (err.statusCode === 404 || err.statusCode === 410) {
        toRemove.push(row.id);
      }
    }
  }

  // Limpar subscriptions invalidas
  if (toRemove.length > 0) {
    for (const id of toRemove) {
      await sql`DELETE FROM push_subscriptions WHERE id = ${id}`;
    }
  }

  console.log(`[PUSH] Enviado: ${sent}, Falhou: ${failed}, Removido: ${toRemove.length}`);
  return { sent, failed, removed: toRemove.length };
}
