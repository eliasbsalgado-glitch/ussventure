// ============================================
// PATENTES — Hierarquia da Frota Venture
// Classificacao de nivel de acesso confirmada
// ============================================

import { getPatentes } from '@/lib/data';

export const metadata = {
  title: 'Patentes — USS Venture',
  description: 'Hierarquia de patentes da Frota Venture.',
};

const patentColors = {
  1: 'var(--lcars-orange)',
  2: 'var(--lcars-orange)',
  3: 'var(--lcars-orange)',
  4: 'var(--lcars-red)',
  5: 'var(--lcars-red)',
  6: 'var(--lcars-lavender)',
  7: 'var(--lcars-lavender)',
  8: 'var(--lcars-blue)',
  9: 'var(--lcars-blue)',
  10: 'var(--lcars-sky)',
  11: 'var(--lcars-teal)',
  12: 'var(--lcars-teal)',
  13: '#888',
};

export default function PatentesPage() {
  const patentes = getPatentes();

  return (
    <div>
      <div className="lcars-hero">
        <h1>Estrutura de Patentes</h1>
        <div className="subtitle">Hierarquia Militar — Frota Venture</div>
      </div>

      <div className="lcars-bar gradient" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {patentes.map((p, i) => (
          <div key={i} className="lcars-card" style={{ borderColor: patentColors[p.hierarquia] || '#666' }}>
            <div style={{
              display: 'flex',
              alignItems: 'stretch',
              overflow: 'hidden',
              borderRadius: 'var(--lcars-radius-sm)',
            }}>
              <div style={{
                width: '60px',
                background: patentColors[p.hierarquia] || '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#000',
                flexShrink: 0,
              }}>
                {p.hierarquia}
              </div>
              <div style={{ padding: '14px 20px', flex: 1 }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: patentColors[p.hierarquia] || '#ccc',
                  marginBottom: '4px',
                }}>
                  {p.nome}
                </div>
                <div style={{ color: 'var(--lcars-text-light)', fontSize: '0.85rem' }}>
                  {p.desc}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
