// ============================================
// TRIBUNAS QUARKS — Galeria de Capas
// Revistas do acervo historico da Frota Venture
// ============================================

import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Tribunas Quarks — USS Venture',
  description: 'Acervo completo das revistas Tribunas Quarks da Frota Venture. 42 edicoes historicas.',
};

const tribunas = [
  { numero: 1, capa: '/img/tribunas/Tribuna Quark N.01 - pq.jpg' },
  { numero: 2, capa: '/img/tribunas/Tribuna Quark N.02 - pq.jpg' },
  { numero: 3, capa: '/img/tribunas/Tribuna Quark N.03 - pq.jpg' },
  { numero: 4, capa: '/img/tribunas/Tribuna Quark N.04 - pq.jpg' },
  { numero: 5, capa: '/img/tribunas/Tribuna Quark N.05 - pq.jpg' },
  { numero: 6, capa: '/img/tribunas/Tribuna Quark N.06 - pq.jpg' },
  { numero: 7, capa: '/img/tribunas/Tribuna Quark N.07 - pq.jpg' },
  { numero: 8, capa: '/img/tribunas/Tribuna Quark N.08 - pq.jpg' },
  { numero: 9, capa: '/img/tribunas/Tribuna Quark N.09 - pq.jpg' },
  { numero: 10, capa: '/img/tribunas/Tribuna Quark N.10 - pq.jpg' },
  { numero: 11, capa: '/img/tribunas/Tribuna Quark N.11 - pq.jpg' },
  { numero: 12, capa: '/img/tribunas/Tribuna Quark N.12 - pq.jpg' },
  { numero: 13, capa: '/img/tribunas/Tribuna Quark N.13 - pq.jpg' },
  { numero: 14, capa: '/img/tribunas/Tribuna Quark N.14 - pq.jpg' },
  { numero: 15, capa: '/img/tribunas/Tribuna Quark N.15 - pq.jpg' },
  { numero: 16, capa: '/img/tribunas/Tribuna Quark N.16 - pq.jpg' },
  { numero: 17, capa: '/img/tribunas/Tribuna Quark N.17 - pq.jpg' },
  { numero: 18, capa: '/img/tribunas/Tribuna Quark N.18 - pq.jpg' },
  { numero: 19, capa: '/img/tribunas/Tribuna Quark N.19 - pq.jpg' },
  { numero: 20, capa: '/img/tribunas/Tribuna Quark N.20 - pq.jpg' },
  { numero: 21, capa: '/img/tribunas/Tribuna Quark N.21 - pq.jpg' },
  { numero: 22, capa: '/img/tribunas/Tribuna Quark N.22 - pq.jpg' },
  { numero: 23, capa: '/img/tribunas/Tribuna Quark N.23 - pq.jpg' },
  { numero: 24, capa: '/img/tribunas/Tribuna Quark N.24 - pq.jpg' },
  { numero: 25, capa: '/img/tribunas/Tribuna Quark N.25 - pq.jpg' },
  { numero: 26, capa: '/img/tribunas/Tribuna Quark N.26 - pq.jpg' },
  { numero: 27, capa: '/img/tribunas/Tribuna Quark N.27 - pq.jpg' },
  { numero: 28, capa: '/img/tribunas/Tribuna Quark N.28 - pq.jpg' },
  { numero: 29, capa: '/img/tribunas/Tribuna Quark N.29 - pq.jpg' },
  { numero: 30, capa: '/img/tribunas/Tribuna Quark N.30 - pq.jpg' },
  { numero: 31, capa: '/img/tribunas/Tribuna Quark N.31 - pq.jpg' },
  { numero: 32, capa: '/img/tribunas/Tribuna Quark N.32 - pq.jpg' },
  { numero: 33, capa: '/img/tribunas/Tribuna Quark N.33 - pq.jpg' },
  { numero: 34, capa: '/img/tribunas/Tribuna Quark N.34 - pq.jpg' },
  { numero: 35, capa: '/img/tribunas/Tribuna Quark N.35 - pq.jpg' },
  { numero: 36, capa: '/img/tribunas/Tribuna Quark N.36 - pq.jpg' },
  { numero: 37, capa: '/img/tribunas/Tribuna Quark N.37 - pq.jpg' },
  { numero: 38, capa: '/img/tribunas/Tribuna Quark N.38 - pq.jpg' },
  { numero: 39, capa: '/img/tribunas/Tribuna Quark N.39 - pq.jpg' },
  { numero: 40, capa: '/img/tribunas/Tribuna Quark N.40 - pq.jpg' },
  { numero: 41, capa: '/img/tribunas/Tribuna Quark N.41 - pq.jpg' },
  { numero: 42, capa: '/img/tribunas/Tribuna Quark N.42 - pq.jpg' },
];

export default function TribunasQuarksPage() {
  return (
    <div>
      <div className="lcars-hero">
        <h1>Tribunas Quarks</h1>
        <div className="subtitle">Acervo de Revistas — Frota Venture — 42 Edicoes</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="tribunas-gallery">
        {tribunas.map((t) => (
          <Link
            key={t.numero}
            href={`/historico/tribunas-quarks/${t.numero}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="tribuna-card">
              <div className="tribuna-card-image">
                <Image
                  src={t.capa}
                  alt={`Tribuna Quark N.${String(t.numero).padStart(2, '0')}`}
                  width={300}
                  height={424}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div className="tribuna-card-overlay">
                  <span className="tribuna-card-read">▶ Ler</span>
                </div>
              </div>
              <div className="tribuna-card-info">
                <span className="tribuna-card-numero">N.{String(t.numero).padStart(2, '0')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '20px' }}>
        <Link href="/historico" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar para Historico
        </Link>
      </div>
    </div>
  );
}
