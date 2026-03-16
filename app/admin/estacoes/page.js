'use client';

// ============================================
// ADMIN — Gerenciar Estações Espaciais
// CRUD completo de estações da Frota
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

export default function AdminEstacoesPage() {
  const { user, loading: authLoading } = useAuth();
  const [estacoes, setEstacoes] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#6688CC');
  const [statusEstacao, setStatusEstacao] = useState('Ativa');
  const [dataConstrucao, setDataConstrucao] = useState('');
  const [construtorSlugs, setConstrutorSlugs] = useState([]);
  const [lema, setLema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [descricaoExtra, setDescricaoExtra] = useState('');
  const [decks, setDecks] = useState([]);
  const [fotos, setFotos] = useState([]);

  // Edit
  const [editing, setEditing] = useState(null);
  const [edForm, setEdForm] = useState({});

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Upload
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/estacoes').then(r => r.json()),
      fetch('/api/fichas').then(r => r.json()),
    ]).then(([est, fic]) => {
      setEstacoes(est);
      setFichas(fic);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (authLoading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Verificando autorizacao...</div>;
  if (!user?.logged || user.role !== 'admin') {
    return (
      <div><div className="lcars-hero"><h1>Acesso Restrito</h1></div>
        <div className="lcars-panel"><div className="lcars-panel-header red">Acesso Negado</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '30px' }}>
            <Link href="/login" className="lcars-btn orange">Fazer Login</Link></div></div></div>
    );
  }

  const inputStyle = {
    padding: '8px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
    fontFamily: 'var(--font-lcars)', fontSize: '0.85rem', width: '100%',
  };

  function getMembroNome(slug) {
    return fichas.find(f => f.slug === slug)?.nome || slug;
  }

  // === CRUD ===
  async function criarEstacao(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/estacoes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cor, status: statusEstacao, dataConstrucao, construtorSlugs, lema, descricao, descricaoExtra, decks, fotos }),
    });
    if (res.ok) {
      setMsg('Estacao criada!');
      setNome(''); setCor('#6688CC'); setStatusEstacao('Ativa'); setDataConstrucao(''); setConstrutorSlugs([]); setLema(''); setDescricao(''); setDescricaoExtra(''); setDecks([]); setFotos([]);
      setShowForm(false);
      const updated = await fetch('/api/estacoes').then(r => r.json());
      setEstacoes(updated);
    } else { const d = await res.json(); setMsg(`Erro: ${d.error}`); }
  }

  function startEdit(est) {
    setEditing(est.slug);
    setEdForm({ ...est, decks: [...(est.decks || [])], fotos: [...(est.fotos || [])], construtorSlugs: [...(est.construtorSlugs || [])] });
  }

  async function salvarEdit(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/estacoes', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: editing, ...edForm }),
    });
    if (res.ok) {
      setMsg('Estacao atualizada!'); setEditing(null);
      const updated = await fetch('/api/estacoes').then(r => r.json());
      setEstacoes(updated);
    } else { const d = await res.json(); setMsg(`Erro: ${d.error}`); }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const res = await fetch('/api/estacoes', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: deleteTarget }),
    });
    if (res.ok) {
      setEstacoes(prev => prev.filter(e => e.slug !== deleteTarget));
      setMsg('Estacao excluida.');
    }
    setDeleteTarget(null);
  }

  async function handleUploadFoto(targetArr, setFn, oldFotos) {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      setUploading(true);
      const fd = new FormData(); fd.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) setFn([...oldFotos, data.url]);
        else alert(data.error || 'Erro no upload');
      } catch { alert('Erro no upload'); }
      setUploading(false);
    };
    input.click();
  }

  // Deck helpers
  function addDeck(arr, setFn) { setFn([...arr, '']); }
  function updateDeck(arr, setFn, i, val) { const d = [...arr]; d[i] = val; setFn(d); }
  function removeDeck(arr, setFn, i) { setFn(arr.filter((_, j) => j !== i)); }

  // Construtor helpers
  function addConstrutor(arr, setFn, slug) { if (slug && !arr.includes(slug)) setFn([...arr, slug]); }
  function removeConstrutor(arr, setFn, slug) { setFn(arr.filter(s => s !== slug)); }

  // Shared form renderer
  function renderForm(formData, setters, onSubmit, submitLabel) {
    const { nome: fn, cor: fc, status: fs, dataConstrucao: fdc, construtorSlugs: fcs, lema: fl, descricao: fd, descricaoExtra: fde, decks: fdk, fotos: ff } = formData;
    return (
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Nome da Estacao</label>
            <input style={inputStyle} value={fn} onChange={e => setters.setNome(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Cor</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input type="color" value={fc} onChange={e => setters.setCor(e.target.value)} style={{ width: '40px', height: '34px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
              <input style={inputStyle} value={fc} onChange={e => setters.setCor(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Data de Construcao</label>
            <input style={inputStyle} value={fdc} onChange={e => setters.setDataConstrucao(e.target.value)} placeholder="Ex: Data Estelar 20080504" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Status</label>
            <select style={inputStyle} value={fs || 'Ativa'} onChange={e => setters.setStatus(e.target.value)}>
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </select>
          </div>
        </div>

        {/* Construtores */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Construtores</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {fcs.map(s => (
              <span key={s} className="lcars-badge orange" style={{ fontSize: '0.65rem', cursor: 'pointer' }} onClick={() => setters.removeConstrutor(fcs, s)}>
                {getMembroNome(s)} ✕
              </span>
            ))}
          </div>
          <select style={{ ...inputStyle, width: 'auto' }} value="" onChange={e => { if (e.target.value) setters.addConstrutor(fcs, e.target.value); }}>
            <option value="">+ Adicionar construtor...</option>
            {fichas.filter(f => !fcs.includes(f.slug)).map(f => <option key={f.slug} value={f.slug}>{f.nome}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Lema</label>
          <input style={inputStyle} value={fl} onChange={e => setters.setLema(e.target.value)} placeholder="Frase da estacao (opcional)" />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Descricao</label>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={fd} onChange={e => setters.setDescricao(e.target.value)} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Descricao Extra</label>
          <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={fde} onChange={e => setters.setDescricaoExtra(e.target.value)} />
        </div>

        {/* Decks */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Configuracao de Decks</label>
          {fdk.map((deck, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, flex: 1 }} value={deck} onChange={e => setters.updateDeck(fdk, i, e.target.value)} placeholder={`Deck ${i + 1} — Descricao`} />
              <button type="button" onClick={() => setters.removeDeck(fdk, i)}
                style={{ background: 'var(--lcars-red)', color: '#000', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setters.addDeck(fdk)} className="lcars-btn sky" style={{ fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}>+ Adicionar Deck</button>
        </div>

        {/* Fotos */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Fotos</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {ff.map((foto, i) => (
              <div key={i} style={{ position: 'relative', width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #444' }}>
                <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => setters.setFotos(ff.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(204,0,0,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.5rem', cursor: 'pointer', lineHeight: '16px', padding: 0 }}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" disabled={uploading} onClick={() => handleUploadFoto(ff, setters.setFotos, ff)}
            className="lcars-btn sky" style={{ fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}>
            {uploading ? 'Enviando...' : '📷 Adicionar Foto'}
          </button>
        </div>

        <button type="submit" className="lcars-btn teal" style={{ border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>{submitLabel}</button>
      </form>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        <Link href="/admin" style={{ color: 'var(--lcars-text-dim)' }}>← Painel Admin</Link>
      </div>

      <div className="lcars-hero">
        <h1>Gerenciar Estacoes</h1>
        <div className="subtitle">Estacoes Espaciais da Frota Venture</div>
      </div>
      <div className="lcars-bar gradient" />

      {msg && (
        <div style={{
          marginBottom: '12px', padding: '10px 16px', fontSize: '0.85rem', borderRadius: 'var(--lcars-radius-sm)',
          background: msg.includes('Erro') ? 'rgba(204,102,102,0.15)' : 'rgba(102,204,153,0.15)',
          border: msg.includes('Erro') ? '1px solid var(--lcars-red)' : '1px solid var(--lcars-teal)',
          color: msg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)',
        }}>{msg}</div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); }}
          className="lcars-btn teal" style={{ fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
          {showForm ? '✕ Fechar' : '+ Nova Estacao Espacial'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="lcars-panel" style={{ marginBottom: '16px' }}>
          <div className="lcars-panel-header teal">Nova Estacao Espacial</div>
          <div className="lcars-panel-body">
            {renderForm(
              { nome, cor, status: statusEstacao, dataConstrucao, construtorSlugs, lema, descricao, descricaoExtra, decks, fotos },
              {
                setNome, setCor, setStatus: setStatusEstacao, setDataConstrucao, setLema, setDescricao, setDescricaoExtra, setFotos,
                addConstrutor: (arr, slug) => addConstrutor(arr, setConstrutorSlugs, slug),
                removeConstrutor: (arr, slug) => removeConstrutor(arr, setConstrutorSlugs, slug),
                addDeck: (arr) => addDeck(arr, setDecks),
                updateDeck: (arr, i, val) => updateDeck(arr, setDecks, i, val),
                removeDeck: (arr, i) => removeDeck(arr, setDecks, i),
              },
              criarEstacao,
              'Criar Estacao'
            )}
          </div>
        </div>
      )}

      {/* Active Stations */}
      <div className="lcars-panel">
        <div className="lcars-panel-header sky">Estacoes Ativas — {estacoes.filter(e => (e.status || 'Ativa') === 'Ativa').length}</div>
        <div className="lcars-panel-body" style={{ padding: loading ? '30px' : 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Carregando...</div>
          ) : estacoes.filter(e => (e.status || 'Ativa') === 'Ativa').length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhuma estacao ativa.</div>
          ) : (
            estacoes.filter(e => (e.status || 'Ativa') === 'Ativa').map(est => (
              <div key={est.slug} style={{ padding: '14px 16px', borderBottom: '1px solid #222' }}>
                {editing === est.slug ? (
                  renderForm(
                    edForm,
                    {
                      setNome: v => setEdForm(p => ({ ...p, nome: v })),
                      setCor: v => setEdForm(p => ({ ...p, cor: v })),
                      setStatus: v => setEdForm(p => ({ ...p, status: v })),
                      setDataConstrucao: v => setEdForm(p => ({ ...p, dataConstrucao: v })),
                      setLema: v => setEdForm(p => ({ ...p, lema: v })),
                      setDescricao: v => setEdForm(p => ({ ...p, descricao: v })),
                      setDescricaoExtra: v => setEdForm(p => ({ ...p, descricaoExtra: v })),
                      setFotos: v => setEdForm(p => ({ ...p, fotos: v })),
                      addConstrutor: (arr, slug) => setEdForm(p => ({ ...p, construtorSlugs: [...(p.construtorSlugs || []).filter(s => s !== slug), slug] })),
                      removeConstrutor: (arr, slug) => setEdForm(p => ({ ...p, construtorSlugs: (p.construtorSlugs || []).filter(s => s !== slug) })),
                      addDeck: (arr) => setEdForm(p => ({ ...p, decks: [...(p.decks || []), ''] })),
                      updateDeck: (arr, i, val) => setEdForm(p => { const d = [...(p.decks || [])]; d[i] = val; return { ...p, decks: d }; }),
                      removeDeck: (arr, i) => setEdForm(p => ({ ...p, decks: (p.decks || []).filter((_, j) => j !== i) })),
                    },
                    salvarEdit,
                    'Salvar Alteracoes'
                  )
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: est.cor, flexShrink: 0 }} />
                        <strong style={{ color: est.cor, fontSize: '1rem' }}>{est.nome}</strong>
                        <span className={`lcars-badge ${est.status === 'Ativa' ? 'green' : 'red'}`} style={{ fontSize: '0.55rem' }}>{est.status || 'Ativa'}</span>
                      </div>
                      {est.dataConstrucao && <div style={{ fontSize: '0.75rem', color: 'var(--lcars-text-dim)' }}>{est.dataConstrucao}</div>}
                      {est.construtorSlugs?.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--lcars-orange)', marginTop: '2px' }}>
                          Construtor: {est.construtorSlugs.map(s => getMembroNome(s)).join(', ')}
                        </div>
                      )}
                      <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                        {est.descricao?.substring(0, 120)}{est.descricao?.length > 120 ? '...' : ''}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {est.decks?.length > 0 && <span className="lcars-badge blue" style={{ fontSize: '0.55rem' }}>{est.decks.length} Decks</span>}
                        {est.fotos?.length > 0 && <span className="lcars-badge sky" style={{ fontSize: '0.55rem' }}>{est.fotos.length} Fotos</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <Link href={`/historico/estacoes/${est.slug}`} className="lcars-btn sky" style={{ fontSize: '0.65rem', padding: '4px 10px' }}>Ver</Link>
                      <button onClick={() => startEdit(est)} className="lcars-btn blue" style={{ fontSize: '0.65rem', padding: '4px 10px', border: 'none', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => setDeleteTarget(est.slug)} className="lcars-btn red" style={{ fontSize: '0.65rem', padding: '4px 10px', border: 'none', cursor: 'pointer' }}>Excluir</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Inactive Stations */}
      {!loading && estacoes.filter(e => e.status === 'Inativa').length > 0 && (
        <div className="lcars-panel" style={{ marginTop: '16px' }}>
          <div className="lcars-panel-header red">Estacoes Descomissionadas — {estacoes.filter(e => e.status === 'Inativa').length}</div>
          <div className="lcars-panel-body" style={{ padding: 0 }}>
            {estacoes.filter(e => e.status === 'Inativa').map(est => (
              <div key={est.slug} style={{ padding: '14px 16px', borderBottom: '1px solid #222' }}>
                {editing === est.slug ? (
                  renderForm(
                    edForm,
                    {
                      setNome: v => setEdForm(p => ({ ...p, nome: v })),
                      setCor: v => setEdForm(p => ({ ...p, cor: v })),
                      setStatus: v => setEdForm(p => ({ ...p, status: v })),
                      setDataConstrucao: v => setEdForm(p => ({ ...p, dataConstrucao: v })),
                      setLema: v => setEdForm(p => ({ ...p, lema: v })),
                      setDescricao: v => setEdForm(p => ({ ...p, descricao: v })),
                      setDescricaoExtra: v => setEdForm(p => ({ ...p, descricaoExtra: v })),
                      setFotos: v => setEdForm(p => ({ ...p, fotos: v })),
                      addConstrutor: (arr, slug) => setEdForm(p => ({ ...p, construtorSlugs: [...(p.construtorSlugs || []).filter(s => s !== slug), slug] })),
                      removeConstrutor: (arr, slug) => setEdForm(p => ({ ...p, construtorSlugs: (p.construtorSlugs || []).filter(s => s !== slug) })),
                      addDeck: (arr) => setEdForm(p => ({ ...p, decks: [...(p.decks || []), ''] })),
                      updateDeck: (arr, i, val) => setEdForm(p => { const d = [...(p.decks || [])]; d[i] = val; return { ...p, decks: d }; }),
                      removeDeck: (arr, i) => setEdForm(p => ({ ...p, decks: (p.decks || []).filter((_, j) => j !== i) })),
                    },
                    salvarEdit,
                    'Salvar Alteracoes'
                  )
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, opacity: 0.7 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: est.cor, flexShrink: 0 }} />
                        <strong style={{ color: est.cor, fontSize: '1rem' }}>{est.nome}</strong>
                        <span className="lcars-badge red" style={{ fontSize: '0.55rem' }}>Inativa</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                        {est.descricao?.substring(0, 120)}{est.descricao?.length > 120 ? '...' : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => startEdit(est)} className="lcars-btn blue" style={{ fontSize: '0.65rem', padding: '4px 10px', border: 'none', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => setDeleteTarget(est.slug)} className="lcars-btn red" style={{ fontSize: '0.65rem', padding: '4px 10px', border: 'none', cursor: 'pointer' }}>Excluir</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="lcars-panel" style={{ borderColor: 'var(--lcars-red)', maxWidth: '400px', width: '90%' }}>
            <div className="lcars-panel-header red">Confirmar Exclusao</div>
            <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '8px' }}>Excluir esta estacao permanentemente?</p>
              <p style={{ color: 'var(--lcars-red)', fontWeight: 700, marginBottom: '20px' }}>{estacoes.find(e => e.slug === deleteTarget)?.nome}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setDeleteTarget(null)} className="lcars-btn" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>Cancelar</button>
                <button onClick={confirmDelete} className="lcars-btn red" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
