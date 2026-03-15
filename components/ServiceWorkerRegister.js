'use client';

// ============================================
// SW REGISTER — Registra o Service Worker
// Componente client-side para evitar inline scripts
// ============================================

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[SW] Falha ao registrar:', err);
      });
    }
  }, []);

  return null;
}
