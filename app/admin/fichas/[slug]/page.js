'use client';

// Editar Ficha de Servico
import { useState, useEffect, use } from 'react';
import FichaForm from '@/components/FichaForm';
import Link from 'next/link';

export default function EditarFichaPage({ params }) {
  const { slug } = use(params);
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/fichas/${slug}`)
      .then(r => r.json())
      .then(data => { setFicha(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>
        Carregando registros...
      </div>
    );
  }

  if (!ficha || ficha.error) {
    return (
      <div className="lcars-panel">
        <div className="lcars-panel-header red">Erro</div>
        <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--lcars-red)' }}>Ficha nao encontrada.</p>
          <Link href="/admin" className="lcars-btn blue">Voltar ao Painel</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        <Link href="/admin" style={{ color: 'var(--lcars-text-dim)' }}>← Painel Admin</Link>
      </div>

      <div className="lcars-hero">
        <h1>Editar Ficha</h1>
        <div className="subtitle">{ficha.nome}</div>
      </div>

      <div className="lcars-bar gradient" />

      <FichaForm initial={ficha} isEdit={true} />
    </div>
  );
}
