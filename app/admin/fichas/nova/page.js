'use client';

// Nova Ficha de Servico
import FichaForm from '@/components/FichaForm';
import Link from 'next/link';

export default function NovaFichaPage() {
  return (
    <div>
      <div style={{ marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        <Link href="/admin" style={{ color: 'var(--lcars-text-dim)' }}>← Painel Admin</Link>
      </div>

      <div className="lcars-hero">
        <h1>Nova Ficha de Servico</h1>
        <div className="subtitle">Registrar novo tripulante no banco de dados</div>
      </div>

      <div className="lcars-bar gradient" />

      <FichaForm isEdit={false} />
    </div>
  );
}
