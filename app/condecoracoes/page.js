'use client';

// ============================================
// CONDECORACOES — Medalhas e Honrarias da Frota
// Agora lendo do banco de dados via API
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIAS_CONFIG = {
  'academia': { nome: 'Academia', cor: 'var(--lcars-teal)' },
  'merito': { nome: 'Medalhas de Merito', cor: 'var(--lcars-orange)' },
  'tecnicas': { nome: 'Tecnicas e Desenvolvimento', cor: 'var(--lcars-blue)' },
  'tempo_servico': { nome: 'Tempo de Servico', cor: 'var(--lcars-lavender)' },
  'outros': { nome: 'Outros', cor: 'var(--lcars-sky)' },
};

const CATEGORIAS_ORDER = ['academia', 'merito', 'tecnicas', 'tempo_servico', 'outros'];

export default function CondecoacoesPage() {
  const [honrarias, setHonrarias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/honrarias')
      .then(r => r.json())
      .then(data => { setHonrarias(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group by category
  const grouped = {};
  honrarias.forEach(h => {
    if (!grouped[h.categoria]) grouped[h.categoria] = [];
    grouped[h.categoria].push(h);
  });

  return (
    <div>
      <div className="lcars-hero">
        <h1>Condecoracoes</h1>
        <div className="subtitle">Medalhas e Honrarias — Frota Venture</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="lcars-panel">
        <div className="lcars-panel-header">
          Registro de Honrarias
        </div>
        <div className="lcars-panel-body">
          <p>
            Medalhas e condecoracoes pessoais do Grupo USS Venture para reconhecimento
            da participacao e merito de cada membro. As honrarias sao concedidas pelo
            Almirantado com base em servicos prestados, tempo de dedicacao e contribuicoes
            excepcionais a Frota.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--lcars-text-dim)' }}>
          Carregando condecoracoes...
        </div>
      ) : (
        <>
          {CATEGORIAS_ORDER.map(catKey => {
            const items = grouped[catKey];
            if (!items || items.length === 0) return null;
            const config = CATEGORIAS_CONFIG[catKey] || { nome: catKey, cor: 'var(--lcars-sky)' };

            return (
              <div key={catKey} style={{ marginBottom: '30px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-lcars)',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  color: config.cor,
                  marginBottom: '16px',
                  paddingBottom: '6px',
                  borderBottom: `2px solid ${config.cor}`,
                }}>
                  {config.nome}
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '14px',
                }}>
                  {items.map(m => (
                    <Link key={m.id} href={`/condecoracoes/${m.id}`} style={{ textDecoration: 'none' }}>
                      <div className="lcars-card lcars-card-hover" style={{ borderColor: config.cor, height: '100%' }}>
                        <div className="lcars-card-body" style={{ textAlign: 'center' }}>
                          {m.imagem && (
                            <div style={{
                              padding: '16px',
                              marginBottom: '12px',
                              background: 'rgba(0,0,0,0.4)',
                              borderRadius: 'var(--lcars-radius-sm)',
                              border: '1px solid #333',
                            }}>
                              <img
                                src={m.imagem}
                                alt={m.nome}
                                style={{
                                  maxWidth: '100px',
                                  maxHeight: '100px',
                                  objectFit: 'contain',
                                  filter: 'drop-shadow(0 0 6px rgba(255,153,0,0.3))',
                                }}
                              />
                            </div>
                          )}
                          <div style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: config.cor,
                            marginBottom: '8px',
                            lineHeight: '1.3',
                          }}>
                            {m.nome}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--lcars-text-light)',
                            lineHeight: '1.5',
                          }}>
                            {m.descricao}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="lcars-bar gradient" />

          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: 'var(--lcars-text-dim)',
            fontSize: '0.8rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Total: {honrarias.length} condecoracoes registradas
          </div>
        </>
      )}
    </div>
  );
}
