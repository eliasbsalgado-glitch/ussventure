'use client';

// ============================================
// MISSÃO DETAIL — Registro de missão individual
// Diário de bordo + diários pessoais da tripulação
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

export default function MissaoPage() {
  const { slug, missaoId } = useParams();
  const { user } = useAuth();

  const [missao, setMissao] = useState(null);
  const [naveCrew, setNaveCrew] = useState(null);
  const [fichas, setFichas] = useState({});
  const [loading, setLoading] = useState(true);

  // Diary form
  const [diarioTexto, setDiarioTexto] = useState('');
  const [diarioMsg, setDiarioMsg] = useState('');

  // Lightbox
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/naves/${slug}/missoes/${missaoId}/diario`).then(r => r.json()),
      fetch(`/api/naves/${slug}`).then(r => r.json()),
      fetch('/api/fichas').then(r => r.json()),
    ]).then(([missaoData, crewData, fichasData]) => {
      setMissao(missaoData);
      setNaveCrew(crewData);
      // Build slug -> { nome, foto } map
      const map = {};
      fichasData.forEach(f => { map[f.slug] = { nome: f.nome, foto: f.foto || '' }; });
      setFichas(map);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug, missaoId]);

  const isCrew = user?.logged && naveCrew?.tripulantes?.some(t => t.fichaSlug === user.fichaSlug);
  const isAdmin = user?.logged && user.role === 'admin';
  const isCaptain = user?.logged && user.fichaSlug && naveCrew?.capitaoSlug === user.fichaSlug;
  const canWriteDiary = isCrew || isAdmin;
  const canDelete = isCaptain || isAdmin;

  async function deleteDiario(index) {
    if (!confirm('Excluir este diario pessoal?')) return;
    const res = await fetch(`/api/naves/${slug}/missoes/${missaoId}/diario`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diarioIndex: index }),
    });
    const data = await res.json();
    if (res.ok) {
      setMissao(prev => ({ ...prev, diarios: data.diarios }));
    } else {
      alert(data.error || 'Erro ao excluir');
    }
  }

  async function submitDiario(e) {
    e.preventDefault();
    setDiarioMsg('');
    const res = await fetch(`/api/naves/${slug}/missoes/${missaoId}/diario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: diarioTexto }),
    });
    const data = await res.json();
    if (res.ok) {
      setMissao(prev => ({
        ...prev,
        diarios: [...(prev.diarios || []), data.diario],
      }));
      setDiarioTexto('');
      setDiarioMsg('Diario pessoal registrado!');
    } else {
      setDiarioMsg(`Erro: ${data.error}`);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>
        Carregando registros da missao...
      </div>
    );
  }

  if (!missao || missao.error) {
    return (
      <div>
        <div className="lcars-hero">
          <h1>Missao nao encontrada</h1>
        </div>
        <div className="lcars-bar gradient" />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href={`/naves/${slug}`} className="lcars-btn blue">
            ← Voltar a Nave
          </Link>
        </div>
      </div>
    );
  }

  const getName = (s) => fichas[s]?.nome || s || 'Desconhecido';
  const getPhoto = (s) => fichas[s]?.foto || '';

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{
        marginBottom: '16px',
        fontSize: '0.8rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        <Link href="/naves" style={{ color: 'var(--lcars-text-dim)' }}>Naves</Link>
        <span style={{ color: '#555' }}>→</span>
        <Link href={`/naves/${slug}`} style={{ color: 'var(--lcars-text-dim)' }}>{slug.toUpperCase()}</Link>
        <span style={{ color: '#555' }}>→</span>
        <span style={{ color: 'var(--lcars-orange)' }}>Missao</span>
      </div>

      {/* Mission Header */}
      <div className="lcars-hero">
        <h1>★ {missao.titulo}</h1>
        <div className="subtitle">Data Estelar {missao.data}</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Registro do Capitão */}
      <div className="lcars-panel">
        <div className="lcars-panel-header orange">
          Registro do Comandante
        </div>
        <div className="lcars-panel-body">
          <div style={{ marginBottom: '10px', fontSize: '0.75rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Autor: {getName(missao.autorSlug)}
          </div>
          <div style={{
            lineHeight: '1.8',
            color: 'var(--lcars-peach)',
            padding: '16px',
            background: 'rgba(255,153,0,0.04)',
            borderLeft: '3px solid var(--lcars-orange)',
            borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
            whiteSpace: 'pre-wrap',
          }}>
            {missao.texto}
          </div>
        </div>
      </div>

      {/* Fotos da Missão */}
      {missao.fotos && missao.fotos.length > 0 && (
        <div className="lcars-panel">
          <div className="lcars-panel-header blue">
            Registros Visuais da Missao
          </div>
          <div className="lcars-panel-body">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '12px',
            }}>
              {missao.fotos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Registro visual ${i + 1}`}
                  onClick={() => setLightboxImg(url)}
                  style={{
                    width: '100%', height: '180px', objectFit: 'cover',
                    borderRadius: 'var(--lcars-radius-sm)',
                    border: '1px solid var(--lcars-blue)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.target.style.transform = 'scale(1.03)'; e.target.style.boxShadow = '0 0 15px var(--lcars-blue)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Diários Pessoais */}
      <div className="lcars-panel">
        <div className="lcars-panel-header lavender">
          Diarios Pessoais da Tripulacao
        </div>
        <div className="lcars-panel-body">
          {(missao.diarios && missao.diarios.length > 0) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: canWriteDiary ? '20px' : 0 }}>
              {missao.diarios.map((d, i) => {
                const photo = getPhoto(d.autorSlug);
                const isOwner = user?.fichaSlug && user.fichaSlug === d.autorSlug;
                const showDelete = canDelete || isOwner;
                return (
                  <div key={i} style={{
                    padding: '14px 18px',
                    background: 'rgba(153,153,255,0.05)',
                    borderLeft: '3px solid var(--lcars-lavender)',
                    borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Foto miniatura */}
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          border: '2px solid var(--lcars-lavender)',
                          background: 'rgba(0,0,0,0.5)',
                          overflow: 'hidden', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {photo ? (
                            <img src={photo} alt="" style={{
                              width: '100%', height: '100%', objectFit: 'cover',
                            }} />
                          ) : (
                            <span style={{ color: 'var(--lcars-lavender)', fontSize: '0.7rem', fontWeight: 700 }}>
                              {getName(d.autorSlug).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span style={{ color: 'var(--lcars-orange)', fontWeight: 600, fontSize: '0.85rem' }}>
                          {getName(d.autorSlug)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#666', fontSize: '0.75rem' }}>
                          Data Estelar {d.data}
                        </span>
                        {showDelete && (
                          <button
                            onClick={() => deleteDiario(i)}
                            className="lcars-btn red"
                            style={{ fontSize: '0.6rem', padding: '2px 8px', border: 'none', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{
                      lineHeight: '1.7',
                      color: 'var(--lcars-peach)',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.9rem',
                      marginLeft: '46px',
                    }}>
                      {d.texto}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '20px',
              color: 'var(--lcars-text-dim)', fontSize: '0.85rem',
              marginBottom: canWriteDiary ? '20px' : 0,
            }}>
              Nenhum diario pessoal registrado para esta missao.
            </div>
          )}

          {/* Form — Novo diário pessoal */}
          {canWriteDiary && (
            <div style={{
              padding: '16px',
              background: 'rgba(153,153,255,0.04)',
              border: '1px solid rgba(153,153,255,0.15)',
              borderRadius: 'var(--lcars-radius-sm)',
            }}>
              <div style={{
                fontSize: '0.7rem', color: 'var(--lcars-text-dim)',
                textTransform: 'uppercase', letterSpacing: '1px',
                marginBottom: '10px',
              }}>
                Registrar seu diario pessoal — {user?.login?.toUpperCase()}
              </div>
              <form onSubmit={submitDiario}>
                <div className="lcars-form-group" style={{ marginBottom: '12px' }}>
                  <textarea
                    value={diarioTexto}
                    onChange={e => setDiarioTexto(e.target.value)}
                    placeholder="Diario pessoal do oficial sobre esta missao..."
                    rows={4}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button
                  type="submit"
                  className="lcars-btn lavender"
                  style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Registrar Diario
                </button>
                {diarioMsg && (
                  <span style={{
                    marginLeft: '12px', fontSize: '0.85rem',
                    color: diarioMsg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)',
                  }}>
                    {diarioMsg}
                  </span>
                )}
              </form>
            </div>
          )}

          {/* Message for non-crew */}
          {!canWriteDiary && user?.logged && (
            <div style={{
              textAlign: 'center', padding: '12px',
              color: '#666', fontSize: '0.8rem', fontStyle: 'italic',
            }}>
              Apenas tripulantes embarcados nesta nave podem adicionar diarios.
            </div>
          )}
          {!user?.logged && (
            <div style={{
              textAlign: 'center', padding: '12px',
              color: '#666', fontSize: '0.8rem',
            }}>
              <Link href="/login" style={{ color: 'var(--lcars-sky)' }}>Faca login</Link> para registrar seu diario pessoal.
            </div>
          )}
        </div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Voltar */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href={`/naves/${slug}`} className="lcars-btn blue">
          ← Voltar a Nave
        </Link>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <img src={lightboxImg} alt="" style={{
            maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain',
            borderRadius: 'var(--lcars-radius-sm)', border: '2px solid var(--lcars-blue)',
          }} />
          <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', fontSize: '1.5rem' }}>✕</div>
        </div>
      )}
    </div>
  );
}
