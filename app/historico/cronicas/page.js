// ============================================
// CRONICAS DA FROTA — Galeria de Capas
// Clique em uma capa para ler a cronica
// ============================================

import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Cronicas da Frota — USS Venture',
  description: 'Historia em quadrinhos da Frota Venture. Clique em uma capa para ler.',
};

const cronicas = [
  {
    slug: 'resgate-em-prios',
    titulo: 'Resgate em Prios',
    volume: 'Vol. 1 / No 1',
    capa: '/img/historico/Capa_resgate_em_prios.png',
    descricao: 'Uma missao de resgate nos confins do espaco coloca a tripulacao da USS Adventure em perigo.',
    cor: 'var(--lcars-orange)',
  },
];

export default function CronicasPage() {
  return (
    <div>
      <div className="lcars-hero">
        <h1>Cronicas da Frota</h1>
        <div className="subtitle">Historia em Quadrinhos — Frota Venture</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="cronicas-gallery">
        {cronicas.map((c) => (
          <Link
            key={c.slug}
            href={`/historico/cronicas/${c.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="cronica-card">
              <div className="cronica-card-image">
                <Image
                  src={c.capa}
                  alt={`Capa: ${c.titulo}`}
                  width={400}
                  height={566}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                />
                <div className="cronica-card-overlay">
                  <span className="cronica-card-read">▶ Ler Agora</span>
                </div>
              </div>
              <div className="cronica-card-info" style={{ borderColor: c.cor }}>
                <h3 style={{ color: c.cor }}>{c.titulo}</h3>
                <span className="cronica-card-volume">{c.volume}</span>
                <p>{c.descricao}</p>
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
