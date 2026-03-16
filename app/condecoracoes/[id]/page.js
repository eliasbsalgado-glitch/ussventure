'use client';

// ============================================
// CONDECORAÇÃO INDIVIDUAL — Detalhe da Medalha
// Oficiais condecorados + total distribuído
// ============================================

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORIAS_CONFIG = {
  'academia': { nome: 'Academia', cor: 'var(--lcars-teal)' },
  'merito': { nome: 'Medalhas de Merito', cor: 'var(--lcars-orange)' },
  'tecnicas': { nome: 'Tecnicas e Desenvolvimento', cor: 'var(--lcars-blue)' },
  'tempo_servico': { nome: 'Tempo de Servico', cor: 'var(--lcars-lavender)' },
  'outros': { nome: 'Outros', cor: 'var(--lcars-sky)' },
};

export default function HonrariaDetailPage() {
  const { id } = useParams();
  const [honraria, setHonraria] = useState(null);
  const [oficiais, setOficiais] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/honrarias/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        setHonraria(data.honraria);
        setOficiais(data.oficiais);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>
        Acessando registros da condecoracao...
      </div>
    );
  }

  if (!honraria) {
    return (
      <div>
        <div className="lcars-hero"><h1>Condecoracao nao encontrada</h1></div>
        <div className="lcars-bar gradient" />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/condecoracoes" className="lcars-btn blue">← Voltar as Condecoracoes</Link>
        </div>
      </div>
    );
  }

  const config = CATEGORIAS_CONFIG[honraria.categoria] || { nome: honraria.categoria, cor: 'var(--lcars-sky)' };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{
        marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '2px',
        textTransform: 'uppercase', display: 'flex', gap: '8px', flexWrap: 'wrap',
      }}>
        <Link href="/condecoracoes" style={{ color: 'var(--lcars-text-dim)' }}>Honrarias</Link>
        <span style={{ color: '#555' }}>→</span>
        <span style={{ color: config.cor }}>{honraria.nome}</span>
      </div>

      {/* Hero */}
      <div className="lcars-hero">
        <h1>★ {honraria.nome}</h1>
        <div className="subtitle">{config.nome}</div>
      </div>

      <div className="lcars-bar" style={{ background: config.cor }} />

      {/* Medalha em destaque */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: config.cor, color: '#000' }}>
          Registro da Condecoracao
        </div>
        <div className="lcars-panel-body">
          <div style={{
            display: 'flex', gap: '24px', alignItems: 'flex-start',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {/* Imagem da medalha */}
            {honraria.imagem && (
              <div style={{
                padding: '24px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: 'var(--lcars-radius-sm)',
                border: `2px solid ${config.cor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minWidth: '160px',
              }}>
                <img
                  src={honraria.imagem}
                  alt={honraria.nome}
                  style={{
                    maxWidth: '180px',
                    maxHeight: '180px',
                    objectFit: 'contain',
                    filter: `drop-shadow(0 0 12px ${config.cor})`,
                  }}
                />
              </div>
            )}

            {/* Informações */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{
                fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px',
                color: 'var(--lcars-text-dim)', marginBottom: '6px',
              }}>
                Categoria
              </div>
              <div style={{
                display: 'inline-block', padding: '4px 14px',
                background: config.cor, color: '#000',
                borderRadius: 'var(--lcars-radius-sm)',
                fontSize: '0.8rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '1px',
                marginBottom: '16px',
              }}>
                {config.nome}
              </div>

              {honraria.descricao && (
                <>
                  <div style={{
                    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px',
                    color: 'var(--lcars-text-dim)', marginBottom: '6px', marginTop: '12px',
                  }}>
                    Descricao
                  </div>
                  <div style={{
                    lineHeight: '1.8', color: 'var(--lcars-peach)',
                    padding: '14px',
                    background: `rgba(${config.cor === 'var(--lcars-orange)' ? '255,153,0' : '153,153,255'},0.05)`,
                    borderLeft: `3px solid ${config.cor}`,
                    borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
                  }}>
                    {honraria.descricao}
                  </div>
                </>
              )}

              {/* Total distribuído */}
              <div style={{
                marginTop: '20px', padding: '12px 18px',
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${config.cor}`,
                borderRadius: 'var(--lcars-radius-sm)',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{
                  fontSize: '2rem', fontWeight: 700,
                  fontFamily: 'var(--font-lcars)',
                  color: config.cor,
                  lineHeight: 1,
                }}>
                  {total}
                </div>
                <div style={{
                  fontSize: '0.75rem', textTransform: 'uppercase',
                  letterSpacing: '2px', color: 'var(--lcars-text-dim)',
                  lineHeight: '1.4',
                }}>
                  {total === 1 ? 'medalha distribuida' : 'medalhas distribuidas'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de oficiais condecorados */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-teal)', color: '#000' }}>
          Oficiais Condecorados ({total})
        </div>
        <div className="lcars-panel-body">
          {oficiais.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '30px',
              color: 'var(--lcars-text-dim)', fontSize: '0.85rem',
            }}>
              Nenhum oficial recebeu esta condecoracao ate o momento.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '12px',
            }}>
              {oficiais.map(o => (
                <Link key={o.slug} href={`/tripulacao/${o.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="lcars-card lcars-card-hover" style={{ borderColor: config.cor }}>
                    <div className="lcars-card-body" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {/* Foto */}
                      <div style={{
                        width: '50px', height: '60px',
                        borderRadius: 'var(--lcars-radius-sm)',
                        border: `1px solid ${config.cor}`,
                        background: 'rgba(0,0,0,0.4)',
                        overflow: 'hidden', flexShrink: 0,
                      }}>
                        {o.foto ? (
                          <img src={o.foto} alt={o.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: config.cor, fontSize: '1.1rem', fontWeight: 700,
                          }}>
                            {o.nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div>
                        <div style={{ color: 'var(--lcars-text-light)', fontWeight: 700, fontSize: '0.85rem' }}>
                          {o.nome}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {o.patente && (
                            <span className="lcars-badge" style={{
                              background: config.cor, color: '#000', fontSize: '0.55rem',
                            }}>
                              {o.patente}
                            </span>
                          )}
                          {o.divisao && (
                            <span className="lcars-badge" style={{
                              background: 'var(--lcars-blue)', color: '#000', fontSize: '0.55rem',
                            }}>
                              {o.divisao}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Voltar */}
      <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
        <Link href="/condecoracoes" className="lcars-btn blue" style={{
          fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block',
        }}>
          ← Voltar as Condecoracoes
        </Link>
      </div>
    </div>
  );
}
