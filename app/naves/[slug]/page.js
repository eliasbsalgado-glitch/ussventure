// ============================================
// NAVE DETAIL — Perfil individual de cada nave
// Carregando dados do banco estelar classificados
// ============================================

import { getNaves, getNaveBySlug } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NaveClient from './NaveClient';

export function generateStaticParams() {
  return getNaves().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const nave = getNaveBySlug(slug);
  if (!nave) return { title: 'Nave nao encontrada' };
  return {
    title: `${nave.nome} — Frota Venture`,
    description: nave.desc,
  };
}

export default async function NaveDetailPage({ params }) {
  const { slug } = await params;
  const nave = getNaveBySlug(slug);
  if (!nave) notFound();

  const statusColor = nave.status === 'Ativa' ? 'var(--lcars-green)' : 'var(--lcars-red)';
  const headerColor = nave.status === 'Ativa' ? 'var(--lcars-sky)' : 'var(--lcars-red)';

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{
        marginBottom: '16px',
        fontSize: '0.8rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        <Link href="/naves" style={{ color: 'var(--lcars-text-dim)' }}>
          ← Naves Capitaneas
        </Link>
      </div>

      {/* Header com selo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        {nave.selo && (
          <div style={{
            width: '160px',
            height: '160px',
            borderRadius: 'var(--lcars-radius)',
            border: `2px solid ${headerColor}`,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            flexShrink: 0,
          }}>
            <img
              src={nave.selo}
              alt={`Selo ${nave.nome}`}
              style={{
                maxWidth: '130px',
                maxHeight: '130px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 12px rgba(153,153,255,0.4))',
              }}
            />
          </div>
        )}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-lcars)',
            fontSize: '2rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '6px',
            color: headerColor,
            marginBottom: '8px',
          }}>
            {nave.nome}
          </h1>
          {nave.lema && (
            <div style={{
              fontStyle: 'italic',
              color: 'var(--lcars-lavender)',
              fontSize: '1rem',
              marginBottom: '10px',
              letterSpacing: '1px',
            }}>
              &quot;{nave.lema}&quot;
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="lcars-badge blue">{nave.tipo}</span>
            <span className="lcars-badge" style={{ background: statusColor, color: '#000' }}>
              {nave.status}
            </span>
            <span className="lcars-badge lavender">{nave.classe}</span>
          </div>
        </div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        margin: '20px 0',
      }}>
        <div className="lcars-stat" style={{ borderColor: headerColor }}>
          <div className="lcars-stat-value" style={{ color: headerColor, fontSize: '1.2rem' }}>
            {nave.comandante}
          </div>
          <div className="lcars-stat-label">Oficial Comandante</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-lavender)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-lavender)', fontSize: '1.2rem' }}>
            {nave.comissao}
          </div>
          <div className="lcars-stat-label">Ano de Comissionamento</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-blue)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-blue)', fontSize: '1.2rem' }}>
            {nave.classe}
          </div>
          <div className="lcars-stat-label">Classe da Nave</div>
        </div>
      </div>

      {/* ===== SEÇÕES INTERATIVAS (Client Component) ===== */}
      <NaveClient nave={nave} headerColor={headerColor} />

      <div className="lcars-bar gradient" />

      {/* Voltar */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/naves" className="lcars-btn blue">
          ← Voltar a Esquadra
        </Link>
      </div>
    </div>
  );
}
