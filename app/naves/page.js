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
  const navesAtivas = naves.filter(n => n.status === 'Ativa');
  const navesDescomissionadas = naves.filter(n => n.status === 'Descomissionada');

  return (
    <div>
      <div className="lcars-hero">
        <h1>Naves Capitaneas</h1>
        <div className="subtitle">Esquadra docada na Estacao SB-245</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Naves ativas */}
      <div className="lcars-grid">
        {navesAtivas.map((n, i) => (
          <Link key={i} href={`/naves/${n.slug}`} style={{ textDecoration: 'none' }}>
            <div className="lcars-card" style={{
              borderColor: 'var(--lcars-sky)',
              cursor: 'pointer',
            }}>
              <div className="lcars-card-header" style={{
                background: 'var(--lcars-sky)',
                color: '#000',
              }}>
                {n.nome}
              </div>
              <div className="lcars-card-body">
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
                  <span className="lcars-badge green">
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

      {/* Naves descomissionadas — Memorial */}
      {navesDescomissionadas.length > 0 && (
        <>
          <div style={{ marginTop: '40px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 30px',
              background: 'rgba(204,68,68,0.15)',
              border: '1px solid var(--lcars-red)',
              borderRadius: 'var(--lcars-radius-sm)',
              color: 'var(--lcars-red)',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}>
              ★ Memorial — Naves Descomissionadas ★
            </div>
            <p style={{
              color: 'var(--lcars-text-dim)',
              fontSize: '0.8rem',
              marginTop: '8px',
              fontStyle: 'italic',
            }}>
              Em tributo aos que serviram com honra. Suas missoes permanecem na memoria da Frota.
            </p>
          </div>

          <div className="lcars-grid">
            {navesDescomissionadas.map((n, i) => (
              <Link key={i} href={`/naves/${n.slug}`} style={{ textDecoration: 'none' }}>
                <div className="lcars-card" style={{
                  borderColor: 'var(--lcars-red)',
                  cursor: 'pointer',
                  opacity: 0.85,
                }}>
                  <div className="lcars-card-header" style={{
                    background: 'var(--lcars-red)',
                    color: '#fff',
                  }}>
                    {n.nome}
                  </div>
                  <div className="lcars-card-body">
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
                            maxWidth: '120px',
                            maxHeight: '120px',
                            objectFit: 'contain',
                            filter: 'grayscale(40%) drop-shadow(0 0 6px rgba(204,68,68,0.3))',
                          }}
                        />
                      </div>
                    )}

                    <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="lcars-badge blue">{n.tipo}</span>
                      <span className="lcars-badge red">
                        {n.status}
                      </span>
                    </div>
                    <p style={{ marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--lcars-text-dim)' }}>Comandante:</strong>{' '}
                      <span style={{ color: 'var(--lcars-orange)' }}>{n.comandante}</span>
                    </p>
                    <p style={{
                      color: 'var(--lcars-text-dim)',
                      fontSize: '0.75rem',
                      marginTop: '8px',
                      fontStyle: 'italic',
                    }}>
                      {n.desc}
                    </p>
                    <p style={{
                      marginTop: '10px',
                      color: 'var(--lcars-text-dim)',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      Ver memorial →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
