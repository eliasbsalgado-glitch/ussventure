'use client';

// ============================================
// CAPITAO — Painel Gerenciar Nave
// Nivel de acesso: Capitao de nave
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

const NAVES_INFO = {
  'adventure': { nome: 'USS Adventure NCC 74508', classe: 'Valiant', tipo: 'Exploracao', status: 'Ativa', selo: '/img/naves/Logo Adventure Final.png' },
  'altotting': { nome: 'USS Altotting NCC 171133', classe: 'Nao informada', tipo: 'Patrulhamento', status: 'Ativa', selo: '/img/naves/LOGO_ALTOTTING.png' },
  'serenity': { nome: 'USS Serenity NCC 7777', classe: 'Scouter Ship', tipo: 'Explorador', status: 'Ativa', selo: '/img/naves/LOGO USS Serenity NCC7777.png' },
  'suidara': { nome: 'USS Suidara NCC 7808', classe: 'Nao informada', tipo: 'Nao informado', status: 'Ativa', selo: '/img/naves/suidara emblema modificado.png' },
};

export default function CapitaoPage() {
  const { user, loading: authLoading } = useAuth();
  const [naveData, setNaveData] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCrew, setShowAddCrew] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState('');
  const [selectedPosto, setSelectedPosto] = useState('Tripulante');
  const [msg, setMsg] = useState('');

  // Missao form
  const [showMissaoForm, setShowMissaoForm] = useState(false);
  const [missaoTitulo, setMissaoTitulo] = useState('');
  const [missaoData, setMissaoData] = useState(new Date().toISOString().split('T')[0]);
  const [missaoTexto, setMissaoTexto] = useState('');

  const naveSlug = user?.naveSlug;
  const naveInfo = naveSlug ? NAVES_INFO[naveSlug] : null;

  useEffect(() => {
    if (!naveSlug) return;
    Promise.all([
      fetch(`/api/naves/${naveSlug}`).then(r => r.json()),
      fetch('/api/fichas').then(r => r.json()),
    ]).then(([nave, fichasList]) => {
      setNaveData(nave);
      setFichas(fichasList);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [naveSlug]);

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Verificando autorizacao...</div>;
  }

  const cargos = user?.cargos || [];
  if (!user?.logged || !cargos.includes('capitao') || !naveSlug) {
    return (
      <div>
        <div className="lcars-hero">
          <h1>Acesso Restrito</h1>
          <div className="subtitle">Painel exclusivo para Capitaes de Nave</div>
        </div>
        <div className="lcars-bar gradient" />
        <div className="lcars-panel">
          <div className="lcars-panel-header red">Acesso Negado</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ color: 'var(--lcars-text-dim)', marginBottom: '14px' }}>
              Apenas capitaes de nave podem acessar este painel.
            </p>
            <Link href="/login" className="lcars-btn orange">Fazer Login</Link>
          </div>
        </div>
      </div>
    );
  }

  async function addTripulante(e) {
    e.preventDefault();
    if (!selectedCrew) return;
    setMsg('');
    const res = await fetch(`/api/naves/${naveSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addTripulante',
        fichaSlug: selectedCrew,
        posto: selectedPosto,
      }),
    });
    if (res.ok) {
      setMsg('Tripulante adicionado com sucesso!');
      setSelectedCrew('');
      setSelectedPosto('Tripulante');
      // Refresh
      const updated = await fetch(`/api/naves/${naveSlug}`).then(r => r.json());
      setNaveData(updated);
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
  }

  async function removeTripulante(fichaSlug) {
    if (!confirm('Remover este tripulante da nave?')) return;
    const res = await fetch(`/api/naves/${naveSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'removeTripulante', fichaSlug }),
    });
    if (res.ok) {
      const updated = await fetch(`/api/naves/${naveSlug}`).then(r => r.json());
      setNaveData(updated);
    }
  }

  async function criarMissao(e) {
    e.preventDefault();
    if (!missaoTitulo.trim() || !missaoData) return;
    setMsg('');
    const res = await fetch('/api/missoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        naveSlug,
        titulo: missaoTitulo,
        data: missaoData,
        texto: missaoTexto,
      }),
    });
    if (res.ok) {
      setMsg('Missao criada com sucesso!');
      setMissaoTitulo('');
      setMissaoData(new Date().toISOString().split('T')[0]);
      setMissaoTexto('');
      setShowMissaoForm(false);
      const updated = await fetch(`/api/naves/${naveSlug}`).then(r => r.json());
      setNaveData(updated);
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
  }

  const tripulantes = naveData?.tripulantes || [];
  const missoes = naveData?.missoes || [];
  const fotos = naveData?.fotos || [];
  const existingSlugs = tripulantes.map(t => t.fichaSlug);
  const availableFichas = fichas.filter(f => !existingSlugs.includes(f.slug));

  const inputStyle = {
    padding: '8px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
    fontFamily: 'var(--font-lcars)', fontSize: '0.85rem',
  };

  return (
    <div>
      <div className="lcars-hero">
        <h1>Gerenciar Nave</h1>
        <div className="subtitle">{naveInfo?.nome || naveSlug}</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Info da Nave */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header blue">Dados da Nave</div>
        <div className="lcars-panel-body">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {naveInfo?.selo && (
              <img src={naveInfo.selo} alt={naveInfo.nome} style={{
                maxWidth: '80px', maxHeight: '80px', objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(102,136,204,0.4))',
              }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Classe</span><br />{naveInfo?.classe || '—'}</div>
                <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tipo</span><br />{naveInfo?.tipo || '—'}</div>
                <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</span><br /><span className="lcars-badge green">{naveInfo?.status || 'Ativa'}</span></div>
                <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tripulantes</span><br />{tripulantes.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <div style={{
          marginBottom: '12px', padding: '10px 16px', fontSize: '0.85rem',
          borderRadius: 'var(--lcars-radius-sm)',
          background: msg.includes('Erro') ? 'rgba(204,102,102,0.15)' : 'rgba(102,204,153,0.15)',
          border: msg.includes('Erro') ? '1px solid var(--lcars-red)' : '1px solid var(--lcars-teal)',
          color: msg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)',
        }}>
          {msg}
        </div>
      )}

      {/* Tripulantes */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header sky">
          Tripulacao — {tripulantes.length} membros
          <button onClick={() => setShowAddCrew(!showAddCrew)}
            style={{ float: 'right', background: 'transparent', border: 'none', color: 'var(--lcars-sky)', cursor: 'pointer', fontSize: '0.8rem' }}>
            {showAddCrew ? '✕ Fechar' : '+ Adicionar'}
          </button>
        </div>
        <div className="lcars-panel-body" style={{ padding: loading ? '30px' : 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Carregando...</div>
          ) : (
            <>
              {showAddCrew && (
                <div style={{ padding: '14px', borderBottom: '1px solid #333' }}>
                  <form onSubmit={addTripulante} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tripulante</label>
                      <select style={inputStyle} value={selectedCrew} onChange={e => setSelectedCrew(e.target.value)}>
                        <option value="">Selecionar...</option>
                        {availableFichas.map(f => <option key={f.slug} value={f.slug}>{f.nome}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Posto</label>
                      <input style={inputStyle} value={selectedPosto} onChange={e => setSelectedPosto(e.target.value)} placeholder="ex: Oficial Tatico" />
                    </div>
                    <button type="submit" className="lcars-btn sky" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Adicionar</button>
                  </form>
                </div>
              )}
              {tripulantes.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhum tripulante designado.</div>
              ) : (
                <table className="lcars-table">
                  <thead>
                    <tr><th>Nome</th><th>Posto</th><th>Acoes</th></tr>
                  </thead>
                  <tbody>
                    {tripulantes.map((t, i) => {
                      const ficha = fichas.find(f => f.slug === t.fichaSlug);
                      return (
                        <tr key={i}>
                          <td style={{ color: 'var(--lcars-orange)', fontWeight: 600 }}>
                            <Link href={`/tripulacao/${t.fichaSlug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {ficha?.nome || t.fichaSlug}
                            </Link>
                          </td>
                          <td><span className="lcars-badge blue" style={{ fontSize: '0.6rem' }}>{t.posto}</span></td>
                          <td>
                            {t.fichaSlug !== user.fichaSlug && (
                              <button onClick={() => removeTripulante(t.fichaSlug)}
                                className="lcars-btn red" style={{ fontSize: '0.6rem', padding: '3px 10px', border: 'none', cursor: 'pointer' }}>
                                Remover
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>

      {/* Missoes */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header lavender">
          Missoes — {missoes.length} registros
          <button onClick={() => setShowMissaoForm(!showMissaoForm)}
            style={{ float: 'right', background: 'transparent', border: 'none', color: 'var(--lcars-lavender)', cursor: 'pointer', fontSize: '0.8rem' }}>
            {showMissaoForm ? '✕ Fechar' : '+ Nova Missao'}
          </button>
        </div>
        <div className="lcars-panel-body" style={{ padding: 0 }}>
          {showMissaoForm && (
            <div style={{ padding: '14px', borderBottom: '1px solid #333' }}>
              <form onSubmit={criarMissao}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Titulo da Missao</label>
                    <input style={{ ...inputStyle, width: '100%' }} value={missaoTitulo} onChange={e => setMissaoTitulo(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Data</label>
                    <input type="date" style={inputStyle} value={missaoData} onChange={e => setMissaoData(e.target.value)} required />
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Descricao</label>
                  <textarea style={{ ...inputStyle, width: '100%', minHeight: '80px', resize: 'vertical' }} value={missaoTexto} onChange={e => setMissaoTexto(e.target.value)} />
                </div>
                <button type="submit" className="lcars-btn lavender" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Registrar Missao</button>
              </form>
            </div>
          )}
          {missoes.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhuma missao registrada para esta nave.</div>
          ) : (
            missoes.map((m, i) => (
              <div key={i} style={{ padding: '14px', borderBottom: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--lcars-lavender)' }}>{m.titulo}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--lcars-sky)' }}>{m.data}</span>
                </div>
                {m.texto && <p style={{ color: 'var(--lcars-text-light)', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{m.texto}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Galeria de Fotos */}
      {fotos.length > 0 && (
        <div className="lcars-panel">
          <div className="lcars-panel-header teal">Galeria — {fotos.length} fotos</div>
          <div className="lcars-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {fotos.map((f, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--lcars-radius-sm)', overflow: 'hidden' }}>
                  <img src={f.url} alt={f.legenda || 'Foto'} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  {f.legenda && <div style={{ padding: '6px 8px', fontSize: '0.7rem', color: 'var(--lcars-text-dim)' }}>{f.legenda}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
