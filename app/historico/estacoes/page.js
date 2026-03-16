// ============================================
// ESTACOES ESPACIAIS — Lista publica
// Dados carregados do banco de dados
// ============================================

import Link from 'next/link';
import sql from '@/lib/db';

export const metadata = {
  title: 'Estacoes Espaciais — USS Venture',
  description: 'Estacoes espaciais construidas pela Frota Venture no Second Life.',
};

export const dynamic = 'force-dynamic';

export default async function EstacoesPage() {
  const estacoes = await sql`SELECT slug, nome, cor FROM estacoes ORDER BY ordem, criado_em`;

  // Static intro text
  const introTexto = "Atualmente dispomos de uma Estacao Espacial operacional no complexo orbital da Land da USS Venture. A nossa primeira construcao dentro do meta-universo Star Trek do Second Life foi a Estacao de Treinamento Venture ET 71854. Procuramos criar em nossas Estacoes cenarios em terceira dimensao completamente interativos em realidade virtual, onde qualquer objeto encontrado em sua jornada viabilizara a sua interacao, conforme sua respectiva funcao.";
  const introExtra = "O objetivo foi permitir que os tripulantes do Grupo USS Venture 'vivam' dentro destas Estacoes sua experiencia pessoal, seja como membro da Frota Estelar ou como um civil do seculo 24.";

  return (
    <div>
      <div className="lcars-hero">
        <h1>Estacoes Espaciais</h1>
        <div className="subtitle">Bases estelares e estacoes orbitais construidas ao longo dos anos</div>
      </div>

      <div className="lcars-bar" style={{ background: 'linear-gradient(90deg, var(--lcars-sky), var(--lcars-orange), var(--lcars-teal))' }} />

      {/* Station Badges */}
      {estacoes.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px', marginTop: '4px' }}>
          {estacoes.map(e => (
            <Link key={e.slug} href={`/historico/estacoes/${e.slug}`}
              className="lcars-btn" style={{
                fontSize: '0.8rem', padding: '6px 18px', display: 'inline-block',
                background: e.cor, color: '#000', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '1px', textDecoration: 'none', border: 'none',
              }}>
              {e.nome.length > 25 ? e.nome.split('—')[0].trim() : e.nome}
            </Link>
          ))}
        </div>
      )}

      {/* Intro */}
      <div className="lcars-panel" style={{ borderColor: 'var(--lcars-sky)', marginBottom: '30px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-sky)', color: '#000' }}>
          Estacoes Espaciais da USS Venture
        </div>
        <div className="lcars-panel-body">
          <p style={{ marginBottom: '12px', lineHeight: '1.8' }}>{introTexto}</p>
          <p style={{ color: 'var(--lcars-text-dim)', lineHeight: '1.7', fontSize: '0.9rem' }}>{introExtra}</p>
        </div>
      </div>

      {/* Station Cards */}
      {estacoes.map(e => (
        <Link key={e.slug} href={`/historico/estacoes/${e.slug}`}
          style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: e.cor, cursor: 'pointer' }}>
            <div className="lcars-card-body" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '40px', borderRadius: '6px', background: e.cor, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-lcars)', fontSize: '1rem', color: e.cor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {e.nome}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Link href="/historico" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar ao Historico
        </Link>
      </div>
    </div>
  );
}
