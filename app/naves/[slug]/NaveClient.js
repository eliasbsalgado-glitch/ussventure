'use client';

// ============================================
// NAVE CLIENT — Consulta da nave (SOMENTE LEITURA)
// Gestao migrada para /capitao
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PhotoGallery from '@/components/PhotoGallery';

function normalizeImgurUrl(url) {
  if (!url) return url;
  let u = url.trim();
  if (/^https?:\/\/i\.imgur\.com\/.+\.\w+$/i.test(u)) return u;
  const singleMatch = u.match(/^https?:\/\/(?:www\.)?imgur\.com\/(\w{5,})$/i);
  if (singleMatch) return `https://i.imgur.com/${singleMatch[1]}.jpg`;
  const iMatch = u.match(/^https?:\/\/i\.imgur\.com\/(\w+)$/i);
  if (iMatch) return `https://i.imgur.com/${iMatch[1]}.jpg`;
  return u;
}

export default function NaveClient({ nave, headerColor }) {
  const [crewData, setCrewData] = useState(null);
  const [fichasAtivas, setFichasAtivas] = useState([]);
  const [loadingCrew, setLoadingCrew] = useState(true);
  const [missoes, setMissoes] = useState([]);

  useEffect(() => {
    fetch(`/api/naves/${nave.slug}`)
      .then(r => r.json())
      .then(data => { setCrewData(data); setLoadingCrew(false); })
      .catch(() => setLoadingCrew(false));

    fetch('/api/fichas')
      .then(r => r.json())
      .then(data => {
        setFichasAtivas(data.filter(f => f.divisao && !['Reserva', 'Baixa'].includes(f.divisao)));
      })
      .catch(() => {});

    fetch(`/api/missoes?nave=${nave.slug}`)
      .then(r => r.json())
      .then(data => setMissoes(data))
      .catch(() => {});
  }, [nave.slug]);

  const shipFotos = crewData?.fotos || [];

  return (
    <>
      {/* ===== GALERIA DE FOTOS DA NAVE ===== */}
      {shipFotos.length > 0 && (
        <div className="lcars-panel">
          <div className="lcars-panel-header" style={{ background: headerColor }}>
            Registros Visuais da Nave
          </div>
          <div className="lcars-panel-body">
            <PhotoGallery fotos={shipFotos} titulo={nave.nome} cor={headerColor} />
          </div>
        </div>
      )}

      {/* ===== REGISTRO HISTÓRICO ===== */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: headerColor }}>
          Registro Historico
        </div>
        <div className="lcars-panel-body">
          <p style={{ lineHeight: '1.8' }}>{nave.historia}</p>
        </div>
      </div>

      {/* ===== ESQUEMA TÉCNICO ===== */}
      {nave.esquema && (
        <div className="lcars-panel">
          <div className="lcars-panel-header blue">
            Dados Tecnicos — Especificacoes LCARS
          </div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '20px' }}>
            <img
              src={nave.esquema}
              alt={`Esquema tecnico ${nave.nome}`}
              style={{ maxWidth: '100%', borderRadius: 'var(--lcars-radius-sm)', border: '1px solid #333' }}
            />
          </div>
        </div>
      )}

      {/* ===== TRIPULAÇÃO EMBARCADA (CONSULTA) ===== */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-lavender)' }}>
          Tripulacao Embarcada
        </div>
        <div className="lcars-panel-body">
          {loadingCrew ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)' }}>
              Carregando registros de tripulacao...
            </div>
          ) : crewData?.tripulantes?.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px',
            }}>
              {crewData.tripulantes.map((t, i) => {
                const ficha = fichasAtivas.find(f => f.slug === t.fichaSlug);
                const isCaptainCrew = t.fichaSlug === crewData.capitaoSlug;
                const borderColor = isCaptainCrew ? headerColor : 'var(--lcars-lavender)';
                return (
                  <div key={i} className="lcars-card" style={{ borderColor }}>
                    <div className="lcars-card-body" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '70px', height: '85px', borderRadius: 'var(--lcars-radius-sm)',
                        border: `1px solid ${borderColor}`, background: 'rgba(0,0,0,0.4)',
                        overflow: 'hidden', flexShrink: 0,
                      }}>
                        {ficha?.foto ? (
                          <img src={ficha.foto} alt={ficha.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#555', fontSize: '0.6rem', textTransform: 'uppercase',
                          }}>
                            Sem Foto
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-lcars)', fontSize: '0.95rem', fontWeight: 700,
                          color: 'var(--lcars-orange)', textTransform: 'uppercase',
                          letterSpacing: '1px', marginBottom: '6px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {ficha?.nome || t.fichaSlug}
                        </div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <span className="lcars-badge orange" style={{ fontSize: '0.6rem' }}>{ficha?.patente || 'N/A'}</span>
                          <span className="lcars-badge blue" style={{ fontSize: '0.6rem' }}>{ficha?.divisao || 'N/A'}</span>
                          <span className="lcars-badge" style={{
                            fontSize: '0.55rem',
                            background: isCaptainCrew ? headerColor : 'var(--lcars-lavender)',
                            color: '#000',
                          }}>
                            {t.posto}
                          </span>
                        </div>
                        <Link href={`/tripulacao/${t.fichaSlug}`} className="lcars-btn sky"
                          style={{ fontSize: '0.65rem', padding: '3px 12px', display: 'inline-block' }}>
                          Ver Ficha
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)' }}>
              Nenhum tripulante embarcado nesta nave.
            </div>
          )}
        </div>
      </div>

      {/* ===== MISSÕES DA NAVE (CONSULTA) ===== */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: headerColor }}>
          Missoes da Nave
        </div>
        <div className="lcars-panel-body">
          {missoes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {missoes.map((m) => (
                <div key={m.id} className="lcars-card-hover" style={{
                  padding: '14px 18px', background: 'rgba(0,0,0,0.3)',
                  borderLeft: `3px solid ${headerColor}`, borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ color: 'var(--lcars-orange)', fontWeight: 600, fontSize: '0.95rem' }}>★ {m.titulo}</div>
                      <div style={{ color: 'var(--lcars-text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>
                        Data Estelar {m.data} — {(m.tripulantes || []).length} tripulante(s) — {(m.diarios || []).length} diario(s){(m.fotos || []).length > 0 ? ` — ${m.fotos.length} foto(s)` : ''}
                      </div>
                    </div>
                    <Link href={`/historico/missoes/${m.id}`} style={{ textDecoration: 'none' }}>
                      <span className="lcars-badge" style={{ background: headerColor, color: '#000', fontSize: '0.6rem', cursor: 'pointer' }}>ACESSAR →</span>
                    </Link>
                  </div>
                  {m.texto && (
                    <div style={{
                      marginTop: '8px', color: '#999', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{m.texto}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '24px', color: 'var(--lcars-text-dim)', fontSize: '0.85rem',
              textTransform: 'uppercase', letterSpacing: '2px',
            }}>
              {nave.status === 'Ativa' ? '★ Nenhuma entrada no diario de bordo' : '★ Nave descomissionada — Registros arquivados'}
            </div>
          )}
        </div>
      </div>

    </>
  );
}
