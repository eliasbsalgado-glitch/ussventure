// ============================================
// ESTACAO INDIVIDUAL — Pagina de detalhes
// Mostra todos os dados da estacao do banco
// ============================================

import Link from 'next/link';
import sql from '@/lib/db';
import { notFound } from 'next/navigation';
import PhotoGallery from '@/components/PhotoGallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const rows = await sql`SELECT nome FROM estacoes WHERE slug = ${slug}`;
  if (rows.length === 0) return { title: 'Estacao — USS Venture' };
  return { title: `${rows[0].nome} — USS Venture`, description: `Detalhes da estacao ${rows[0].nome}` };
}

export default async function EstacaoDetailPage({ params }) {
  const { slug } = await params;
  const rows = await sql`SELECT * FROM estacoes WHERE slug = ${slug}`;
  if (rows.length === 0) notFound();

  const r = rows[0];
  const est = {
    slug: r.slug, nome: r.nome, cor: r.cor,
    dataConstrucao: r.data_construcao, construtorSlugs: r.construtor_slugs || [],
    lema: r.lema, descricao: r.descricao, descricaoExtra: r.descricao_extra,
    decks: r.decks || [], fotos: r.fotos || [],
  };

  // Resolve constructor names
  let construtorNomes = [];
  if (est.construtorSlugs.length > 0) {
    const fichas = await sql`SELECT slug, nome FROM fichas WHERE slug = ANY(${est.construtorSlugs})`;
    construtorNomes = est.construtorSlugs.map(s => {
      const f = fichas.find(fi => fi.slug === s);
      return { slug: s, nome: f?.nome || s };
    });
  }

  return (
    <div>
      <div className="lcars-hero">
        <h1>{est.nome}</h1>
        {est.dataConstrucao && <div className="subtitle">{est.dataConstrucao}</div>}
      </div>

      <div className="lcars-bar gradient" style={{ background: `linear-gradient(90deg, ${est.cor}, ${est.cor}88, ${est.cor}44)` }} />

      {/* Info Panel */}
      <div className="lcars-panel" style={{ borderColor: est.cor }}>
        <div className="lcars-panel-header" style={{ background: est.cor, color: '#000' }}>
          <span>{est.nome}</span>
          {est.dataConstrucao && (
            <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>{est.dataConstrucao}</span>
          )}
        </div>
        <div className="lcars-panel-body">
          {/* Constructor */}
          {construtorNomes.length > 0 && (
            <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {construtorNomes.map(c => (
                <Link key={c.slug} href={`/tripulacao/${c.slug}`}>
                  <span className="lcars-badge orange" style={{ fontSize: '0.7rem', cursor: 'pointer' }}>
                    Construtor: {c.nome}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Lema */}
          {est.lema && (
            <blockquote style={{
              borderLeft: `3px solid ${est.cor}`,
              margin: '0 0 16px 0', padding: '10px 16px',
              fontStyle: 'italic', color: 'var(--lcars-tanoi)',
              background: 'rgba(255,153,0,0.05)', borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
            }}>
              &ldquo;{est.lema}&rdquo;
            </blockquote>
          )}

          {/* Description */}
          {est.descricao && (
            <p style={{ marginBottom: '12px', lineHeight: '1.8' }}>{est.descricao}</p>
          )}
          {est.descricaoExtra && (
            <p style={{ color: 'var(--lcars-text-dim)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '12px' }}>
              {est.descricaoExtra}
            </p>
          )}

          {/* Decks */}
          {est.decks.length > 0 && (
            <div style={{
              background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--lcars-radius-sm)',
              padding: '14px 18px', marginTop: '12px',
            }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '2px', color: est.cor, marginBottom: '10px',
              }}>
                Configuracao dos Decks
              </div>
              {est.decks.map((deck, j) => (
                <div key={j} style={{
                  padding: '6px 0', borderBottom: j < est.decks.length - 1 ? '1px solid #222' : 'none',
                  fontSize: '0.85rem', color: 'var(--lcars-text-light)',
                }}>
                  <span style={{ color: 'var(--lcars-orange)', marginRight: '6px' }}>▸</span>
                  {deck}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      <PhotoGallery fotos={est.fotos} titulo={est.nome} cor={est.cor} />

      {/* Back links */}
      <div style={{ textAlign: 'center', padding: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/historico/estacoes" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Todas as Estacoes
        </Link>
        <Link href="/historico" className="lcars-btn sky"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Historico
        </Link>
      </div>
    </div>
  );
}
