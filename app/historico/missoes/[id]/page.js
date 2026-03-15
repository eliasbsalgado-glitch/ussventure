'use client';
// ============================================
// MISSAO INDIVIDUAL — Página unificada
// Detalhes + tripulação + diários com fotos
// ============================================
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const naveCores = {
  adventure: 'var(--lcars-orange)',
  altotting: 'var(--lcars-sky)',
  andor: 'var(--lcars-blue)',
  nautilus: 'var(--lcars-teal)',
  rerum: 'var(--lcars-lavender)',
  serenity: 'var(--lcars-peach)',
  suidara: 'var(--lcars-green)',
};

const NAVES = {
  adventure: 'USS Adventure NCC 74508',
  altotting: 'USS Altötting NCC 80101',
  andor: 'USS Andor NCC 71899',
  nautilus: 'USS Nautilus NCC 80100',
  rerum: 'USS Rerum NCC 80200',
  serenity: 'USS Serenity NCC 80102',
  suidara: 'USS Suidara NCC 74700',
};

export default function MissaoDetailPage() {
  const { id } = useParams();
  const [missao, setMissao] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fichas, setFichas] = useState({});
  const [diarioTexto, setDiarioTexto] = useState('');
  const [diarioMsg, setDiarioMsg] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ titulo: '', data: '', texto: '' });
  const [confirmDeleteDiario, setConfirmDeleteDiario] = useState(null);
  const [confirmDeleteMissao, setConfirmDeleteMissao] = useState(false);
  const [allFichas, setAllFichas] = useState([]);
  const [crewSearch, setCrewSearch] = useState('');
  const [editingCrew, setEditingCrew] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [selectedCrewPosto, setSelectedCrewPosto] = useState('Tripulante');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [newFotoUrl, setNewFotoUrl] = useState('');
  const [fotoMsg, setFotoMsg] = useState('');

  const POSTOS_MISSAO = ['Capitao', 'Piloto', 'Oficial de Ciencias/Comunicacoes', 'Oficial de Engenharia', 'Oficial Tatico', 'Tripulante', 'Outro (digitar)'];
  const [customPosto, setCustomPosto] = useState('');

  useEffect(() => {
    fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
      .then(r => r.json()).then(d => { if (d.logged) setSession(d); });
    loadMissao();
    // Load fichas for photos
    fetch('/api/fichas').then(r => r.json()).then(data => {
      const map = {};
      data.forEach(f => { map[f.slug] = { nome: f.nome, foto: f.foto || '', patente: f.patente || '' }; });
      setFichas(map);
      setAllFichas(data);
    });
  }, []);

  async function loadMissao() {
    const res = await fetch(`/api/missoes/${id}`);
    if (res.ok) {
      const data = await res.json();
      setMissao(data);
      setSelectedCrew(data.tripulantes || []);
    }
    setLoading(false);
  }

  const getName = (slug) => fichas[slug]?.nome || slug || 'Desconhecido';
  const getPhoto = (slug) => fichas[slug]?.foto || '';
  const getPatente = (slug) => fichas[slug]?.patente || '';

  const isAdmin = session?.role === 'admin';
  const tripulantes = missao?.tripulantes || [];
  const isParticipant = session?.fichaSlug && tripulantes.some(t => t.fichaSlug === session.fichaSlug);
  const canWrite = isAdmin || isParticipant;
  // Captain of the ship can manage too
  const [isCaptain, setIsCaptain] = useState(false);
  useEffect(() => {
    if (missao?.nave_slug && session?.fichaSlug) {
      fetch(`/api/naves/${missao.nave_slug}`).then(r => r.json()).then(d => {
        if (d.capitaoSlug === session.fichaSlug) setIsCaptain(true);
      }).catch(() => {});
    }
  }, [missao?.nave_slug, session?.fichaSlug]);
  const canManage = isAdmin || isCaptain;
  const canAddPhoto = canManage || isParticipant;

  async function submitDiario(e) {
    e.preventDefault();
    setDiarioMsg('');
    if (!diarioTexto.trim()) return;
    const res = await fetch(`/api/missoes/${id}/diarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: diarioTexto }),
    });
    if (res.ok) {
      setDiarioTexto('');
      setDiarioMsg('Diario pessoal registrado!');
      loadMissao();
    } else {
      const data = await res.json();
      setDiarioMsg(`Erro: ${data.error}`);
    }
  }

  async function deleteDiario(diarioId) {
    const res = await fetch(`/api/missoes/${id}/diarios`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diarioId }),
    });
    if (res.ok) {
      setConfirmDeleteDiario(null);
      loadMissao();
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    const res = await fetch(`/api/missoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) { setEditing(false); loadMissao(); }
  }

  function toggleCrew(ficha) {
    const exists = selectedCrew.find(c => c.fichaSlug === ficha.slug);
    if (exists) setSelectedCrew(selectedCrew.filter(c => c.fichaSlug !== ficha.slug));
    else {
      const posto = selectedCrewPosto === 'Outro (digitar)' ? (customPosto || 'Tripulante') : selectedCrewPosto;
      setSelectedCrew([...selectedCrew, { fichaSlug: ficha.slug, nome: ficha.nome, patente: ficha.patente, postoMissao: posto }]);
    }
  }

  async function addMissionFoto(e) {
    e.preventDefault();
    if (!newFotoUrl.trim()) return;
    setFotoMsg('');
    const res = await fetch(`/api/missoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addFoto', url: newFotoUrl.trim() }),
    });
    if (res.ok) {
      setNewFotoUrl('');
      setFotoMsg('Foto adicionada!');
      loadMissao();
    } else {
      const data = await res.json();
      setFotoMsg(`Erro: ${data.error}`);
    }
  }

  async function removeMissionFoto(index) {
    const res = await fetch(`/api/missoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'removeFoto', index }),
    });
    if (res.ok) loadMissao();
  }

  async function saveCrew() {
    const res = await fetch(`/api/missoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripulantes: selectedCrew }),
    });
    if (res.ok) { setEditingCrew(false); loadMissao(); }
  }

  async function deleteMissao() {
    const res = await fetch(`/api/missoes/${id}`, { method: 'DELETE' });
    if (res.ok) window.location.href = '/historico/missoes';
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Carregando registros da missao...</div>;
  if (!missao) return (
    <div>
      <div className="lcars-hero"><h1>Missao nao encontrada</h1></div>
      <div className="lcars-bar gradient" />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/historico/missoes" className="lcars-btn blue">← Voltar</Link>
      </div>
    </div>
  );

  const cor = naveCores[missao.nave_slug] || 'var(--lcars-sky)';
  const naveNome = NAVES[missao.nave_slug] || missao.nave_slug;
  const diarios = missao.diarios || [];
  const fotos = missao.fotos || [];
  const filteredFichas = allFichas.filter(f =>
    f.nome.toLowerCase().includes(crewSearch.toLowerCase()) ||
    f.patente?.toLowerCase().includes(crewSearch.toLowerCase())
  ).slice(0, 15);

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{
        marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '2px',
        textTransform: 'uppercase', display: 'flex', gap: '8px', flexWrap: 'wrap',
      }}>
        <Link href="/historico" style={{ color: 'var(--lcars-text-dim)' }}>Historico</Link>
        <span style={{ color: '#555' }}>→</span>
        <Link href="/historico/missoes" style={{ color: 'var(--lcars-text-dim)' }}>Missoes</Link>
        <span style={{ color: '#555' }}>→</span>
        <Link href={`/naves/${missao.nave_slug}`} style={{ color: 'var(--lcars-text-dim)' }}>{missao.nave_slug?.toUpperCase()}</Link>
        <span style={{ color: '#555' }}>→</span>
        <span style={{ color: cor }}>Missao</span>
      </div>

      {/* Header */}
      <div className="lcars-hero">
        <h1>★ {missao.titulo}</h1>
        <div className="subtitle">{naveNome} — Data Estelar {missao.data}</div>
      </div>

      <div className="lcars-bar" style={{ background: cor }} />

      {/* Admin actions */}
      {canManage && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => { setEditForm({ titulo: missao.titulo, data: missao.data, texto: missao.texto }); setEditing(true); }}
            className="lcars-btn orange" style={{ fontSize: '0.75rem', padding: '6px 16px' }}>
            EDITAR MISSAO
          </button>
          <button onClick={() => { setEditingCrew(true); }}
            className="lcars-btn sky" style={{ fontSize: '0.75rem', padding: '6px 16px' }}>
            GERENCIAR TRIPULACAO
          </button>
          <button onClick={() => setConfirmDeleteMissao(true)}
            className="lcars-btn" style={{ fontSize: '0.75rem', padding: '6px 16px', background: 'var(--lcars-red)', color: '#fff' }}>
            EXCLUIR MISSAO
          </button>
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="lcars-panel" style={{ marginBottom: '20px', borderColor: 'var(--lcars-orange)' }}>
          <div className="lcars-panel-header" style={{ background: 'var(--lcars-orange)', color: '#000' }}>Editar Missao</div>
          <div className="lcars-panel-body" style={{ padding: '16px' }}>
            <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input value={editForm.titulo} onChange={e => setEditForm({ ...editForm, titulo: e.target.value })}
                placeholder="Titulo" style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px' }} />
              <input type="date" value={editForm.data} onChange={e => setEditForm({ ...editForm, data: e.target.value })}
                style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px' }} />
              <textarea value={editForm.texto} onChange={e => setEditForm({ ...editForm, texto: e.target.value })}
                rows={5} style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="lcars-btn orange" style={{ fontSize: '0.8rem', padding: '6px 20px' }}>SALVAR</button>
                <button type="button" onClick={() => setEditing(false)} className="lcars-btn" style={{ fontSize: '0.8rem', padding: '6px 20px' }}>CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit crew */}
      {editingCrew && (
        <div className="lcars-panel" style={{ marginBottom: '20px', borderColor: 'var(--lcars-sky)' }}>
          <div className="lcars-panel-header" style={{ background: 'var(--lcars-sky)', color: '#000' }}>Tripulacao Participante ({selectedCrew.length})</div>
          <div className="lcars-panel-body" style={{ padding: '16px' }}>
            {selectedCrew.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {selectedCrew.map(c => (
                  <span key={c.fichaSlug} className="lcars-badge" style={{
                    background: 'var(--lcars-sky)', color: '#000', fontSize: '0.7rem', cursor: 'pointer'
                  }} onClick={() => toggleCrew({ slug: c.fichaSlug, nome: c.nome, patente: c.patente })}>
                    {c.nome} ({c.postoMissao || 'Tripulante'}) ✕
                  </span>
                ))}
              </div>
            )}
            <div style={{ marginBottom: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={selectedCrewPosto} onChange={e => setSelectedCrewPosto(e.target.value)}
                style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555', borderRadius: '4px', color: 'var(--lcars-peach)', fontSize: '0.75rem' }}>
                {POSTOS_MISSAO.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {selectedCrewPosto === 'Outro (digitar)' && (
                <input placeholder="Digite o posto..." value={customPosto} onChange={e => setCustomPosto(e.target.value)}
                  style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lcars-orange)', borderRadius: '4px', color: 'var(--lcars-orange)', fontSize: '0.75rem', width: '140px' }} />
              )}
            </div>
            <input placeholder="Buscar tripulante..." value={crewSearch} onChange={e => setCrewSearch(e.target.value)}
              style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '6px 8px', borderRadius: '4px', width: '100%', fontSize: '0.8rem', marginBottom: '6px' }} />
            {crewSearch && (
              <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                {filteredFichas.map(f => (
                  <div key={f.slug} onClick={() => toggleCrew(f)}
                    style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem',
                      color: selectedCrew.find(c => c.fichaSlug === f.slug) ? 'var(--lcars-sky)' : 'var(--lcars-text-light)',
                      borderBottom: '1px solid #222' }}>
                    {selectedCrew.find(c => c.fichaSlug === f.slug) ? '✓ ' : ''}{f.patente} {f.nome}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button onClick={saveCrew} className="lcars-btn sky" style={{ fontSize: '0.8rem', padding: '6px 20px' }}>SALVAR TRIPULACAO</button>
              <button onClick={() => setEditingCrew(false)} className="lcars-btn" style={{ fontSize: '0.8rem', padding: '6px 20px' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Registro do Comandante */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: cor, color: '#000' }}>
          Registro do Comandante
        </div>
        <div className="lcars-panel-body">
          <div style={{ marginBottom: '10px', fontSize: '0.75rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Autor: {getName(missao.autor_slug)}
          </div>
          <div style={{
            lineHeight: '1.8', color: 'var(--lcars-peach)', padding: '16px',
            background: `rgba(${cor === 'var(--lcars-orange)' ? '255,153,0' : '153,153,255'},0.04)`,
            borderLeft: `3px solid ${cor}`,
            borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
            whiteSpace: 'pre-wrap',
          }}>
            {missao.texto || 'Sem descricao.'}
          </div>
        </div>
      </div>

      {/* Fotos da Missão */}
      <div className="lcars-panel">
        <div className="lcars-panel-header blue">Registros Visuais da Missao ({fotos.length})</div>
        <div className="lcars-panel-body">
          {fotos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginBottom: canAddPhoto ? '16px' : 0 }}>
              {fotos.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} alt={`Registro visual ${i + 1}`}
                    onClick={() => setLightboxImg(url)}
                    style={{
                      width: '100%', height: '180px', objectFit: 'cover',
                      borderRadius: 'var(--lcars-radius-sm)', border: '1px solid var(--lcars-blue)',
                      cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.03)'; e.target.style.boxShadow = '0 0 15px var(--lcars-blue)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
                  />
                  {canManage && (
                    <button onClick={() => removeMissionFoto(i)} style={{
                      position: 'absolute', top: '6px', right: '6px',
                      background: 'rgba(204,68,68,0.9)', border: 'none',
                      color: '#fff', borderRadius: '50%', width: '22px', height: '22px',
                      fontSize: '0.6rem', cursor: 'pointer', lineHeight: '22px', textAlign: 'center',
                    }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {fotos.length === 0 && !canAddPhoto && (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--lcars-text-dim)', fontSize: '0.85rem' }}>
              Nenhum registro visual desta missao.
            </div>
          )}
          {/* Adicionar foto — participantes e admin/capitão */}
          {canAddPhoto && (
            <form onSubmit={addMissionFoto} style={{
              padding: '10px', background: 'rgba(0,0,0,0.2)',
              borderRadius: 'var(--lcars-radius-sm)', border: '1px solid #333',
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                Adicionar Foto da Missao (Link direto Imgur)
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input type="url" value={newFotoUrl} onChange={e => setNewFotoUrl(e.target.value)}
                  placeholder="https://i.imgur.com/exemplo.jpg" required
                  style={{
                    flex: 1, padding: '6px 10px', background: 'rgba(0,0,0,0.4)',
                    border: '1px solid #555', borderRadius: 'var(--lcars-radius-sm)',
                    color: 'var(--lcars-peach)', fontSize: '0.75rem',
                  }} />
                <button type="submit" className="lcars-btn blue" style={{ fontSize: '0.65rem', padding: '5px 12px', border: 'none', cursor: 'pointer' }}>
                  + Foto
                </button>
              </div>
              {fotoMsg && (
                <div style={{ marginTop: '6px', fontSize: '0.75rem', color: fotoMsg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)' }}>{fotoMsg}</div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Tripulação participante */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-teal)', color: '#000' }}>
          Tripulacao Designada ({tripulantes.length})
        </div>
        <div className="lcars-panel-body">
          {tripulantes.length === 0 ? (
            <p style={{ color: 'var(--lcars-text-dim)', textAlign: 'center', padding: '16px' }}>Nenhum tripulante designado.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px',
            }}>
              {tripulantes.map(t => {
                const photo = getPhoto(t.fichaSlug);
                const nome = getName(t.fichaSlug);
                const patente = t.patente || getPatente(t.fichaSlug);
                return (
                  <Link key={t.fichaSlug} href={`/tripulacao/${t.fichaSlug}`} style={{ textDecoration: 'none' }}>
                    <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-teal)' }}>
                      <div className="lcars-card-body" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Foto retangular (estilo ficha de serviço) */}
                        <div style={{
                          width: '50px', height: '60px',
                          borderRadius: 'var(--lcars-radius-sm)',
                          border: '1px solid var(--lcars-teal)',
                          background: 'rgba(0,0,0,0.4)',
                          overflow: 'hidden', flexShrink: 0,
                        }}>
                          {photo ? (
                            <img src={photo} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{
                              width: '100%', height: '100%', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              color: 'var(--lcars-teal)', fontSize: '1.1rem', fontWeight: 700,
                            }}>
                              {nome.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ color: 'var(--lcars-text-light)', fontWeight: 700, fontSize: '0.85rem' }}>{nome}</div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                            <span className="lcars-badge" style={{ background: 'var(--lcars-teal)', color: '#000', fontSize: '0.55rem' }}>
                              {patente}
                            </span>
                            {t.postoMissao && (
                              <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.55rem' }}>
                                {t.postoMissao}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Diários pessoais */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-lavender)', color: '#000' }}>
          Diarios Pessoais da Tripulacao ({diarios.length})
        </div>
        <div className="lcars-panel-body">
          {diarios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)', fontSize: '0.85rem', marginBottom: canWrite ? '20px' : 0 }}>
              Nenhum diario pessoal registrado para esta missao.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: canWrite ? '20px' : 0 }}>
              {diarios.map((d, i) => {
                const photo = getPhoto(d.autorSlug);
                const nome = getName(d.autorSlug);
                const isOwner = session?.fichaSlug && session.fichaSlug === d.autorSlug;
                const showDelete = isAdmin || isOwner;
                return (
                  <div key={d.id || i} style={{
                    padding: '14px 18px',
                    background: 'rgba(153,153,255,0.05)',
                    borderLeft: '3px solid var(--lcars-lavender)',
                    borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
                    position: 'relative',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      flexWrap: 'wrap', gap: '8px', marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Foto retangular (estilo ficha) */}
                        <div style={{
                          width: '36px', height: '44px',
                          borderRadius: 'var(--lcars-radius-sm)',
                          border: '2px solid var(--lcars-lavender)',
                          background: 'rgba(0,0,0,0.5)',
                          overflow: 'hidden', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {photo ? (
                            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ color: 'var(--lcars-lavender)', fontSize: '0.7rem', fontWeight: 700 }}>
                              {nome.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <Link href={`/tripulacao/${d.autorSlug}`} style={{ textDecoration: 'none' }}>
                          <span style={{ color: 'var(--lcars-orange)', fontWeight: 600, fontSize: '0.85rem' }}>
                            {nome}
                          </span>
                        </Link>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#666', fontSize: '0.75rem' }}>Data Estelar {d.data}</span>
                        {showDelete && (
                          <button onClick={() => setConfirmDeleteDiario(d.id || `idx_${i}`)}
                            className="lcars-btn red"
                            style={{ fontSize: '0.6rem', padding: '2px 8px', border: 'none', cursor: 'pointer' }}>
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{
                      lineHeight: '1.7', color: 'var(--lcars-peach)', whiteSpace: 'pre-wrap',
                      fontSize: '0.9rem', marginLeft: '46px',
                    }}>
                      {d.texto}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Form — Novo diário */}
          {canWrite && (
            <div style={{
              padding: '16px', background: 'rgba(153,153,255,0.04)',
              border: '1px solid rgba(153,153,255,0.15)', borderRadius: 'var(--lcars-radius-sm)',
            }}>
              <div style={{
                fontSize: '0.7rem', color: 'var(--lcars-text-dim)',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px',
              }}>
                Registrar seu diario pessoal
              </div>
              <form onSubmit={submitDiario}>
                <div className="lcars-form-group" style={{ marginBottom: '12px' }}>
                  <textarea value={diarioTexto} onChange={e => setDiarioTexto(e.target.value)}
                    placeholder="Diario pessoal do oficial sobre esta missao..."
                    rows={4} required style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="lcars-btn lavender"
                  style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>
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

          {/* Mensagem para não-participantes */}
          {!canWrite && session && (
            <div style={{ textAlign: 'center', padding: '12px', color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>
              Apenas tripulantes designados nesta missao podem adicionar diarios.
            </div>
          )}
          {!session && (
            <div style={{ textAlign: 'center', padding: '12px', color: '#666', fontSize: '0.8rem' }}>
              <Link href="/login" style={{ color: 'var(--lcars-sky)' }}>Faca login</Link> para registrar seu diario pessoal.
            </div>
          )}
        </div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Voltar */}
      <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href={`/naves/${missao.nave_slug}`} className="lcars-btn blue" style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar a Nave
        </Link>
        <Link href="/historico/missoes" className="lcars-btn lavender" style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Todas as Missoes
        </Link>
      </div>

      {/* Confirm delete diario */}
      {confirmDeleteDiario && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="lcars-panel" style={{ maxWidth: '400px', borderColor: 'var(--lcars-red)' }}>
            <div className="lcars-panel-header" style={{ background: 'var(--lcars-red)', color: '#fff' }}>CONFIRMAR EXCLUSAO</div>
            <div className="lcars-panel-body" style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '16px' }}>Excluir esta entrada de diario? Esta acao nao pode ser desfeita.</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={() => deleteDiario(confirmDeleteDiario)} className="lcars-btn" style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.8rem', padding: '8px 24px' }}>EXCLUIR</button>
                <button onClick={() => setConfirmDeleteDiario(null)} className="lcars-btn" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete missão */}
      {confirmDeleteMissao && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="lcars-panel" style={{ maxWidth: '400px', borderColor: 'var(--lcars-red)' }}>
            <div className="lcars-panel-header" style={{ background: 'var(--lcars-red)', color: '#fff' }}>CONFIRMAR EXCLUSAO</div>
            <div className="lcars-panel-body" style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '16px' }}>
                Tem certeza que deseja excluir a missao <strong>&quot;{missao.titulo}&quot;</strong>? Todos os diarios serao perdidos.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={deleteMissao} className="lcars-btn" style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.8rem', padding: '8px 24px' }}>EXCLUIR</button>
                <button onClick={() => setConfirmDeleteMissao(false)} className="lcars-btn" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
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
