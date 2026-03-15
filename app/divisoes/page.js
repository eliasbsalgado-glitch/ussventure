// ============================================
// DIVISOES — Organizacao operacional da Venture
// Carregando dados de departamentos classificados
// ============================================

import Link from 'next/link';
import { getDivisoes } from '@/lib/data';

export const metadata = {
  title: 'Divisoes — USS Venture',
  description: 'Divisoes operacionais da Frota Venture.',
};

export default function DivisoesPage() {
  const divisoes = getDivisoes();
  const totalAtivos = divisoes.reduce((sum, d) => sum + d.qtd, 0);

  return (
    <div>
      <div className="lcars-hero">
        <h1>Divisoes Operacionais</h1>
        <div className="subtitle">Organizacao do Grupo USS Venture — {totalAtivos} tripulantes</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="lcars-grid">
        {divisoes.map((d, i) => (
          <Link key={i} href={`/divisoes/${d.slug}`} style={{ textDecoration: 'none' }}>
            <div className="lcars-card lcars-card-hover" style={{
              borderColor: d.cor,
              cursor: 'pointer',
            }}>
              <div className="lcars-card-header" style={{ background: d.cor, color: '#000' }}>
                {d.nome}
              </div>
              <div className="lcars-card-body">
                <div style={{ marginBottom: '12px' }}>
                  <span className="lcars-badge" style={{ background: d.cor, color: '#000' }}>
                    {d.corNome}
                  </span>
                  <span className="lcars-badge blue" style={{ marginLeft: '6px' }}>
                    {d.qtd} tripulantes
                  </span>
                </div>
                {d.chefe && (
                  <p style={{ color: 'var(--lcars-orange)', marginBottom: '8px', fontSize: '0.85rem' }}>
                    ★ Chefe: {d.chefe}
                  </p>
                )}
                <p>{d.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
