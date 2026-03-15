'use client';

// ============================================
// NOTIFICATION BUTTON — Ativar/desativar push
// Botao LCARS para gerenciar notificacoes
// ============================================

import { useState, useEffect } from 'react';

export default function NotificationButton() {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Verificar suporte
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setSupported(false);
      return;
    }

    // Verificar permissao atual
    setPermission(Notification.permission);

    // Verificar se ja esta inscrito
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, []);

  async function subscribe() {
    setLoading(true);
    try {
      // 1. Pedir permissao
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        setLoading(false);
        return;
      }

      // 2. Pegar VAPID public key
      const vapidRes = await fetch('/api/push/vapid');
      const { publicKey } = await vapidRes.json();
      if (!publicKey) {
        console.error('[PUSH] VAPID key nao disponivel');
        setLoading(false);
        return;
      }

      // 3. Converter VAPID key para Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      // 4. Criar subscription
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // 5. Enviar para o servidor
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      setIsSubscribed(true);
    } catch (err) {
      console.error('[PUSH] Erro ao ativar:', err);
    }
    setLoading(false);
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        // Remover do servidor
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        // Remover localmente
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error('[PUSH] Erro ao desativar:', err);
    }
    setLoading(false);
  }

  if (!supported) return null;
  if (permission === 'denied') return null;

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={loading}
      title={isSubscribed ? 'Desativar notificacoes' : 'Ativar notificacoes'}
      style={{
        background: 'none',
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        padding: '4px 8px',
        fontSize: '1.1rem',
        color: isSubscribed ? 'var(--lcars-gold, #FF9900)' : 'var(--lcars-text-dim, #888)',
        opacity: loading ? 0.5 : 1,
        transition: 'color 0.3s ease, transform 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
      onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'scale(1.15)'; }}
      onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
    >
      {isSubscribed ? '🔔' : '🔕'}
      <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {loading ? '...' : (isSubscribed ? 'ON' : 'OFF')}
      </span>
    </button>
  );
}

// Helper: converter VAPID base64 para Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
