// ============================================
// CRONICAS DA FROTA — Leitura: Resgate em Prios
// Visualizador PDF via Google Drive embed
// ============================================

import Link from 'next/link';

export const metadata = {
  title: 'Resgate em Prios — Cronicas da Frota',
  description: 'Leia a historia em quadrinhos Cronicas da Frota: Resgate em Prios, Vol. 1 No 1.',
};

export default function ResgatePriosPage() {
  return (
    <div>
      <div className="lcars-hero">
        <h1>Resgate em Prios</h1>
        <div className="subtitle">Cronicas da Frota — Vol. 1 / No 1</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="lcars-panel" style={{ borderColor: 'var(--lcars-orange)' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-orange)', color: '#000' }}>
          Leitura — Resgate em Prios
        </div>
        <div className="lcars-panel-body" style={{ padding: '20px' }}>
          <iframe
            src="https://drive.google.com/file/d/1TV-IBm35C9MeYlJrI8zUBidr6FEwwCGo/preview"
            width="100%"
            height="800"
            style={{ border: 'none', borderRadius: '8px' }}
            allow="autoplay"
            title="Cronicas da Frota - Resgate em Prios"
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
        <Link href="/historico/cronicas" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar para Cronicas
        </Link>
      </div>
    </div>
  );
}
