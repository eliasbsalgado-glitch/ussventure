// ============================================
// CONTOS DA FROTA — Literatura da Frota Venture
// Contos escritos pelo Comodoro Kharan
// ============================================

import Link from 'next/link';
import { getContos } from '@/lib/data';

export const metadata = {
  title: 'Contos da Frota — USS Venture',
  description: 'Contos da Frota Venture escritos pelo Comodoro Kharan. Historias que narram a fundacao e as missoes da Frota.',
};

const arcoCores = {
  'o-inicio': { cor: 'var(--lcars-sky)', badge: '#2288CC' },
  'a-fusao': { cor: 'var(--lcars-orange)', badge: '#CC8800' },
  'a-missao-final': { cor: 'var(--lcars-red)', badge: '#CC4444' },
};

export default function ContosPage() {
  const arcos = getContos();

  return (
    <div>
      <div className="lcars-hero">
        <h1>Contos da Frota</h1>
        <div className="subtitle">Literatura — Escritos pelo Comodoro Kharan</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Intro */}
      <div className="lcars-panel" style={{ marginBottom: '24px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-lavender)', color: '#000' }}>
          Arquivo Literario
        </div>
        <div className="lcars-panel-body" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--lcars-text-light)', lineHeight: '1.7', margin: 0 }}>
            Coletanea de contos escritos pelo <strong style={{ color: 'var(--lcars-orange)' }}>Comodoro Kharan</strong>, narrando
            a historia da Frota Venture desde sua fundacao ate suas maiores missoes.
            Os contos estao organizados em tres arcos narrativos, apresentados em ordem cronologica.
          </p>
        </div>
      </div>

      {/* Arcos */}
      {arcos.map((arco) => {
        const cores = arcoCores[arco.slug] || { cor: 'var(--lcars-sky)', badge: '#2288CC' };
        return (
          <div key={arco.slug} className="lcars-panel" style={{ marginBottom: '24px', borderColor: cores.cor }}>
            <div className="lcars-panel-header" style={{ background: cores.cor, color: '#000' }}>
              {arco.titulo}
            </div>
            <div className="lcars-panel-body" style={{ padding: '20px' }}>
              <p style={{ color: 'var(--lcars-text-light)', lineHeight: '1.6', marginBottom: '16px' }}>
                {arco.descricao}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: cores.cor,
                  border: `1px solid ${cores.cor}`,
                  fontSize: '0.65rem',
                }}>
                  {arco.capitulos.length} CAPITULOS
                </span>
                <span className="lcars-badge" style={{
                  background: 'rgba(255,170,0,0.15)',
                  color: 'var(--lcars-orange)',
                  border: '1px solid var(--lcars-orange)',
                  fontSize: '0.65rem',
                }}>
                  ✍ {arco.autor}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {arco.capitulos.map((cap) => (
                  <Link
                    key={cap.slug}
                    href={`/historico/contos/${cap.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 16px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid #333',
                      borderRadius: 'var(--lcars-radius-sm)',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    className="lcars-card-hover"
                    >
                      <div style={{
                        width: '36px', height: '36px',
                        borderRadius: '50%',
                        background: cores.cor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 700, color: '#000',
                        flexShrink: 0,
                      }}>
                        {cap.numero}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.9rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '2px',
                          color: 'var(--lcars-text-light)',
                        }}>
                          {cap.titulo}
                        </div>
                        <div style={{
                          fontSize: '0.7rem', color: 'var(--lcars-text-dim)',
                          marginTop: '2px',
                        }}>
                          Capitulo {cap.numero} — {arco.titulo}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', color: 'var(--lcars-text-dim)', fontSize: '1.2rem' }}>
                        ▸
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
        <Link href="/historico" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar para Historico
        </Link>
      </div>
    </div>
  );
}
