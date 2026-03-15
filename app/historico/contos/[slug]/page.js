// ============================================
// LEITURA DE CONTO — Pagina individual do capitulo
// Renderiza o texto completo de cada conto
// ============================================

import Link from 'next/link';
import { getContoBySlug, getContos, getAllContoSlugs } from '@/lib/data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllContoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getContoBySlug(slug);
  if (!result) return { title: 'Conto nao encontrado' };
  return {
    title: `${result.capitulo.titulo} — ${result.arco.titulo} — USS Venture`,
    description: `Conto da Frota Venture: ${result.arco.titulo}, Capitulo ${result.capitulo.numero} - ${result.capitulo.titulo}. Escrito pelo ${result.arco.autor}.`,
  };
}

const arcoCores = {
  'o-inicio': 'var(--lcars-sky)',
  'a-fusao': 'var(--lcars-orange)',
  'a-missao-final': 'var(--lcars-red)',
};

function getNavigation(slug, arcos) {
  const allCaps = [];
  for (const arco of arcos) {
    for (const cap of arco.capitulos) {
      allCaps.push({ ...cap, arcoTitulo: arco.titulo, arcoSlug: arco.slug });
    }
  }
  const idx = allCaps.findIndex(c => c.slug === slug);
  return {
    prev: idx > 0 ? allCaps[idx - 1] : null,
    next: idx < allCaps.length - 1 ? allCaps[idx + 1] : null,
    current: allCaps[idx],
    total: allCaps.length,
    position: idx + 1,
  };
}

export default async function ContoReadPage({ params }) {
  const { slug } = await params;
  const result = await getContoBySlug(slug);
  if (!result) notFound();

  const { arco, capitulo } = result;
  const cor = arcoCores[arco.slug] || 'var(--lcars-sky)';
  const arcos = await getContos();
  const nav = getNavigation(slug, arcos);

  return (
    <div>
      <div className="lcars-hero">
        <h1>{capitulo.titulo}</h1>
        <div className="subtitle">{arco.titulo} — Capitulo {capitulo.numero}</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Meta info */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span className="lcars-badge" style={{
          background: cor, color: '#000', fontSize: '0.7rem',
        }}>
          {arco.titulo}
        </span>
        <span className="lcars-badge" style={{
          background: 'rgba(255,170,0,0.15)',
          color: 'var(--lcars-orange)',
          border: '1px solid var(--lcars-orange)',
          fontSize: '0.65rem',
        }}>
          ✍ {arco.autor}
        </span>
        <span style={{
          fontSize: '0.7rem', color: 'var(--lcars-text-dim)',
          marginLeft: 'auto',
          fontFamily: 'var(--font-lcars)',
          letterSpacing: '1px',
        }}>
          CONTO {nav.position} DE {nav.total}
        </span>
      </div>

      {/* Story Content */}
      <div className="lcars-panel" style={{ borderColor: cor }}>
        <div className="lcars-panel-header" style={{ background: cor, color: '#000' }}>
          Capitulo {capitulo.numero}: {capitulo.titulo}
        </div>
        <div className="lcars-panel-body" style={{ padding: '24px 28px' }}>
          {capitulo.paragrafos.map((para, i) => (
            <p key={i} style={{
              color: 'var(--lcars-text-light)',
              lineHeight: '1.8',
              marginBottom: '12px',
              fontSize: '0.92rem',
              textAlign: 'justify',
              textIndent: para.startsWith('-') || para.startsWith('–') || para.startsWith('"') ? '0' : '2em',
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        gap: '12px', marginTop: '20px', paddingBottom: '20px',
        flexWrap: 'wrap',
      }}>
        <div>
          {nav.prev && (
            <Link href={`/historico/contos/${nav.prev.slug}`} className="lcars-btn"
              style={{ fontSize: '0.8rem', padding: '8px 20px', display: 'inline-block' }}>
              ← {nav.prev.titulo}
            </Link>
          )}
        </div>

        <Link href="/historico/contos" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 20px', display: 'inline-block' }}>
          Todos os Contos
        </Link>

        <div>
          {nav.next && (
            <Link href={`/historico/contos/${nav.next.slug}`} className="lcars-btn"
              style={{ fontSize: '0.8rem', padding: '8px 20px', display: 'inline-block' }}>
              {nav.next.titulo} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
