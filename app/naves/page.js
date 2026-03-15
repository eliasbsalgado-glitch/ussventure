// ============================================
// NAVES CAPITANEAS — Esquadra da Frota Venture
// Sistemas de rastreio de naves online
// ============================================

import { getNaves } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Naves — USS Venture',
  description: 'Naves da esquadra da Frota Venture.',
};

export default function NavesPage() {
  const naves = getNaves();

  return (
    <div>
      <div className="lcars-hero">
        <h1>Naves Capitaneas</h1>
        <div className="subtitle">Esquadra docada na Estacao SB-245</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="lcars-grid">
        {naves.map((n, i) => (
          <Link key={i} href={`/naves/${n.slug}`} style={{ textDecoration: 'none' }}>
            <div className="lcars-card" style={{
              borderColor: n.status === 'Ativa' ? 'var(--lcars-sky)' : 'var(--lcars-red)',
              cursor: 'pointer',
            }}>
              <div className="lcars-card-header" style={{
                background: n.status === 'Ativa' ? 'var(--lcars-sky)' : 'var(--lcars-red)',
                color: n.status === 'Ativa' ? '#000' : '#fff',
              }}>
                {n.nome}
              </div>
              <div className="lcars-card-body">
                {/* Selo da nave */}
                {n.selo && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: 'var(--lcars-radius-sm)',
                    border: '1px solid #333',
                  }}>
                    <img
                      src={n.selo}
                      alt={`Selo ${n.nome}`}
                      style={{
                        maxWidth: '140px',
                        maxHeight: '140px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 0 8px rgba(153,153,255,0.3))',
                      }}
                    />
                  </div>
                )}

                {n.lema && (
                  <p style={{
                    fontStyle: 'italic',
                    color: 'var(--lcars-lavender)',
                    marginBottom: '10px',
                    fontSize: '0.85rem',
                  }}>
                    &quot;{n.lema}&quot;
                  </p>
                )}

                <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="lcars-badge blue">{n.tipo}</span>
                  <span className={`lcars-badge ${n.status === 'Ativa' ? 'green' : 'red'}`}>
                    {n.status}
                  </span>
                </div>
                <p style={{ marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--lcars-text-dim)' }}>Comandante:</strong>{' '}
                  <span style={{ color: 'var(--lcars-orange)' }}>{n.comandante}</span>
                </p>
                <p style={{
                  marginTop: '10px',
                  color: 'var(--lcars-text-dim)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Clique para detalhes →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
