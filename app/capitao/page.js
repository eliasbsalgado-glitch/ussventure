'use client';

// ============================================
// CAPITAO — Painel Gerenciar Nave (COMPLETO)
// Migrado do NaveClient com todas as funcoes
// de gestao: tripulacao, missoes, fotos, info
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

const NAVES_INFO = {
  'adventure': { nome: 'USS Adventure NCC 74508', selo: '/img/naves/Logo Adventure Final.png' },
  'altotting': { nome: 'USS Altotting NCC 171133', selo: '/img/naves/LOGO_ALTOTTING.png' },
  'serenity': { nome: 'USS Serenity NCC 7777', selo: '/img/naves/LOGO USS Serenity NCC7777.png' },
  'suidara': { nome: 'USS Suidara NCC 7808', selo: '/img/naves/suidara emblema modificado.png' },
};

const POSTOS_PADRAO = [
  'Capitão', 'Primeiro Oficial', 'Oficial Tático', 'Oficial de Ciências',
  'Oficial de Engenharia', 'Oficial de Comunicações', 'Oficial Médico', 'Tripulante',
];

const POSTOS_MISSAO = ['Capitao', 'Piloto', 'Oficial de Ciencias/Comunicacoes', 'Oficial de Engenharia', 'Oficial Tatico', 'Tripulante', 'Outro (digitar)'];

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

export default function CapitaoPage() {
  const { user, loading: authLoading } = useAuth();
  const [naveData, setNaveData] = useState(null);
  const [allFichas, setAllFichas] = useState([]);
  const [fichasAtivas, setFichasAtivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Ship info editing
  const [editingInfo, setEditingInfo] = useState(false);
  const [editClasse, setEditClasse] = useState('');
  const [editTipo, setEditTipo] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Crew management
  const [showAddCrew, setShowAddCrew] = useState(false);
  const [addSlug, setAddSlug] = useState('');
  const [addPosto, setAddPosto] = useState('Tripulante');
  const [customPosto, setCustomPosto] = useState('');
  const [useCustomPosto, setUseCustomPosto] = useState(false);
  const [crewMsg, setCrewMsg] = useState('');

  // Ship photos
  const [fotoUrl, setFotoUrl] = useState('');
  const [fotoLegenda, setFotoLegenda] = useState('');
  const [showAddFoto, setShowAddFoto] = useState(false);

  // Mission form
  const [missoes, setMissoes] = useState([]);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [mTitulo, setMTitulo] = useState('');
  const [mData, setMData] = useState(new Date().toISOString().split('T')[0]);
  const [mTexto, setMTexto] = useState('');
  const [mFotos, setMFotos] = useState('');
  const [missionMsg, setMissionMsg] = useState('');
  const [mCrewSearch, setMCrewSearch] = useState('');
  const [mSelectedCrew, setMSelectedCrew] = useState([]);
  const [mCrewPosto, setMCrewPosto] = useState('Tripulante');
  const [mCrewPostoCustom, setMCrewPostoCustom] = useState('');

  // Edit mission
  const [editingMission, setEditingMission] = useState(null);
  const [emTitulo, setEmTitulo] = useState('');
  const [emData, setEmData] = useState('');
  const [emTexto, setEmTexto] = useState('');
  const [emFotos, setEmFotos] = useState([]);
  const [emNewFotoUrl, setEmNewFotoUrl] = useState('');

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Lightbox
  const [lightboxImg, setLightboxImg] = useState(null);

  const naveSlug = user?.naveSlug;
  const naveInfo = naveSlug ? NAVES_INFO[naveSlug] : null;

  useEffect(() => {
    if (!naveSlug) return;
    Promise.all([
      fetch(`/api/naves/${naveSlug}`).then(r => r.json()),
      fetch('/api/fichas').then(r => r.json()),
    ]).then(([nave, fichasList]) => {
      setNaveData(nave);
      setEditClasse(nave.classe || '');
      setEditTipo(nave.tipo || '');
      setEditStatus(nave.status || 'Ativa');
      setAllFichas(fichasList);
      setFichasAtivas(fichasList.filter(f => f.divisao && !['Reserva', 'Baixa'].includes(f.divisao)));
      setLoading(false);
    }).catch(() => setLoading(false));
    loadMissoes();
  }, [naveSlug]);

  function loadMissoes() {
    if (!naveSlug) return;
    fetch(`/api/missoes?nave=${naveSlug}`)
      .then(r => r.json())
      .then(data => setMissoes(data))
      .catch(() => {});
  }

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

  // === Ship Info ===
  async function salvarInfo(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch(`/api/naves/${naveSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateInfo', classe: editClasse, tipo: editTipo, status: editStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setNaveData(prev => ({ ...prev, classe: data.classe, tipo: data.tipo, status: data.status }));
      setMsg('Dados da nave atualizados!'); setEditingInfo(false);
    } else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
  }

  // === Crew ===
  async function addTripulante(e) {
    e.preventDefault(); setCrewMsg('');
    const posto = useCustomPosto ? customPosto : addPosto;
    if (!addSlug || !posto) { setCrewMsg('Selecione um tripulante e posto'); return; }
    const res = await fetch(`/api/naves/${naveSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addTripulante', fichaSlug: addSlug, posto }),
    });
    const data = await res.json();
    if (res.ok) {
      setNaveData(prev => ({ ...prev, tripulantes: data.tripulantes }));
      setAddSlug(''); setCrewMsg('Tripulante embarcado!');
    } else { setCrewMsg(`Erro: ${data.error}`); }
  }

  async function removeTripulante(fichaSlug) {
    if (!confirm('Desembarcar este tripulante?')) return;
    const res = await fetch(`/api/naves/${naveSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'removeTripulante', fichaSlug }),
    });
    const data = await res.json();
    if (res.ok) { setNaveData(prev => ({ ...prev, tripulantes: data.tripulantes })); }
    else { alert(data.error); }
  }

  // === Ship Photos ===
  async function addShipPhoto(e) {
    e.preventDefault(); if (!fotoUrl) return;
    const normalizedUrl = normalizeImgurUrl(fotoUrl);
    const res = await fetch(`/api/naves/${naveSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addFoto', url: normalizedUrl, legenda: fotoLegenda }),
    });
    const data = await res.json();
    if (res.ok) {
      setNaveData(prev => ({ ...prev, fotos: data.fotos }));
      setFotoUrl(''); setFotoLegenda('');
    } else { alert(data.error); }
  }

  async function removeShipPhoto(index) {
    if (!confirm('Remover esta foto?')) return;
    const res = await fetch(`/api/naves/${naveSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'removeFoto', index }),
    });
    const data = await res.json();
    if (res.ok) { setNaveData(prev => ({ ...prev, fotos: data.fotos })); }
  }

  // === Missions ===
  async function createMission(e) {
    e.preventDefault(); setMissionMsg('');
    const fotos = mFotos.split('\n').map(l => normalizeImgurUrl(l.trim())).filter(Boolean);
    const res = await fetch('/api/missoes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naveSlug, titulo: mTitulo, data: mData, texto: mTexto, fotos, tripulantes: mSelectedCrew }),
    });
    const data = await res.json();
    if (res.ok) {
      setMTitulo(''); setMTexto(''); setMFotos(''); setShowMissionForm(false); setMSelectedCrew([]);
      setMissionMsg('Missao registrada!'); loadMissoes();
    } else { setMissionMsg(`Erro: ${data.error}`); }
  }

  async function deleteMission(missaoId) {
    const res = await fetch(`/api/missoes/${missaoId}`, { method: 'DELETE' });
    if (res.ok) { setConfirmDelete(null); setMissionMsg('Missao removida.'); loadMissoes(); }
    else { const data = await res.json(); alert(data.error); }
  }

  function startEditMission(m) {
    setEditingMission(m.id); setEmTitulo(m.titulo); setEmData(m.data); setEmTexto(m.texto);
    setEmFotos([...(m.fotos || [])]); setEmNewFotoUrl('');
  }

  async function saveEditMission(e) {
    e.preventDefault();
    const res = await fetch(`/api/missoes/${editingMission}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: emTitulo, data: emData, texto: emTexto, fotos: emFotos }),
    });
    if (res.ok) { setEditingMission(null); setMissionMsg('Missao atualizada!'); loadMissoes(); }
    else { const data = await res.json(); alert(data.error); }
  }

  function toggleMCrewMember(ficha) {
    const exists = mSelectedCrew.find(c => c.fichaSlug === ficha.slug);
    if (exists) setMSelectedCrew(mSelectedCrew.filter(c => c.fichaSlug !== ficha.slug));
    else {
      const posto = mCrewPosto === 'Outro (digitar)' ? (mCrewPostoCustom || 'Tripulante') : mCrewPosto;
      setMSelectedCrew([...mSelectedCrew, { fichaSlug: ficha.slug, nome: ficha.nome, patente: ficha.patente, postoMissao: posto }]);
    }
  }

  // === Helpers ===
  const tripulantes = naveData?.tripulantes || [];
  const shipFotos = naveData?.fotos || [];
  const fichasDisponiveis = fichasAtivas.filter(f => !tripulantes.some(t => t.fichaSlug === f.slug));
  const mFilteredFichas = allFichas.filter(f =>
    f.nome?.toLowerCase().includes(mCrewSearch.toLowerCase()) ||
    f.patente?.toLowerCase().includes(mCrewSearch.toLowerCase())
  ).slice(0, 12);

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

      {msg && (
        <div style={{
          marginBottom: '12px', padding: '10px 16px', fontSize: '0.85rem', borderRadius: 'var(--lcars-radius-sm)',
          background: msg.includes('Erro') ? 'rgba(204,102,102,0.15)' : 'rgba(102,204,153,0.15)',
          border: msg.includes('Erro') ? '1px solid var(--lcars-red)' : '1px solid var(--lcars-teal)',
          color: msg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)',
        }}>{msg}</div>
      )}

      {/* ===== DADOS DA NAVE ===== */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header blue">
          Dados da Nave
          <button onClick={() => setEditingInfo(!editingInfo)}
            style={{ float: 'right', background: 'transparent', border: 'none', color: 'var(--lcars-sky)', cursor: 'pointer', fontSize: '0.8rem' }}>
            {editingInfo ? '✕ Fechar' : '✏ Editar'}
          </button>
        </div>
        <div className="lcars-panel-body">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {naveInfo?.selo && (
              <img src={naveInfo.selo} alt={naveInfo.nome} style={{
                maxWidth: '80px', maxHeight: '80px', objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(102,136,204,0.4))',
              }} />
            )}
            {editingInfo ? (
              <form onSubmit={salvarInfo} style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Classe</label>
                    <input style={{ ...inputStyle, width: '100%' }} value={editClasse} onChange={e => setEditClasse(e.target.value)} placeholder="Ex: Valiant" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tipo</label>
                    <input style={{ ...inputStyle, width: '100%' }} value={editTipo} onChange={e => setEditTipo(e.target.value)} placeholder="Ex: Exploracao" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Status</label>
                    <select style={{ ...inputStyle, width: '100%' }} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                      <option value="Ativa">Ativa</option>
                      <option value="Descomissionada">Descomissionada</option>
                      <option value="Em Reparos">Em Reparos</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="lcars-btn blue" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Salvar Dados</button>
              </form>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                  <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Classe</span><br />{naveData?.classe || '—'}</div>
                  <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tipo</span><br />{naveData?.tipo || '—'}</div>
                  <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</span><br /><span className={`lcars-badge ${naveData?.status === 'Ativa' ? 'green' : 'red'}`}>{naveData?.status || 'Ativa'}</span></div>
                  <div><span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tripulantes</span><br />{tripulantes.length}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== GALERIA DE FOTOS DA NAVE ===== */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-sky)' }}>
          Registros Visuais da Nave — {shipFotos.length} fotos
          <button onClick={() => setShowAddFoto(!showAddFoto)}
            style={{ float: 'right', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
            {showAddFoto ? '✕ Fechar' : '+ Adicionar Foto'}
          </button>
        </div>
        <div className="lcars-panel-body">
          {showAddFoto && (
            <form onSubmit={addShipPhoto} style={{
              padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--lcars-radius-sm)',
              border: '1px solid #333', marginBottom: '16px',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Adicionar Foto (Link direto da imagem)
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <input type="url" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} placeholder="https://exemplo.com/imagem.jpg" required
                  style={{ ...inputStyle, flex: '1 1 300px' }} />
                <input type="text" value={fotoLegenda} onChange={e => setFotoLegenda(e.target.value)} placeholder="Legenda (opcional)"
                  style={{ ...inputStyle, flex: '0 1 200px' }} />
                <button type="submit" className="lcars-btn sky" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Adicionar</button>
              </div>
              {fotoUrl && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)', marginBottom: '4px' }}>
                    PREVIEW — {normalizeImgurUrl(fotoUrl) !== fotoUrl ? `URL convertida: ${normalizeImgurUrl(fotoUrl)}` : 'Link direto'}
                  </div>
                  <img src={normalizeImgurUrl(fotoUrl)} alt="Preview" style={{
                    maxWidth: '200px', maxHeight: '120px', objectFit: 'cover',
                    borderRadius: 'var(--lcars-radius-sm)', border: '1px solid var(--lcars-sky)',
                  }} onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <div style={{ marginTop: '10px', fontSize: '0.6rem', color: '#666', lineHeight: '1.5', fontStyle: 'italic' }}>
                Dica: Clique com botao direito na imagem → &quot;Copiar endereco da imagem&quot;
              </div>
            </form>
          )}
          {shipFotos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {shipFotos.map((f, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={f.url} alt={f.legenda || `Foto ${i + 1}`} onClick={() => setLightboxImg(f.url)}
                    style={{
                      width: '100%', height: '160px', objectFit: 'cover',
                      borderRadius: 'var(--lcars-radius-sm)', border: '1px solid var(--lcars-sky)',
                      cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.03)'; e.target.style.boxShadow = '0 0 15px var(--lcars-sky)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
                  />
                  {f.legenda && <div style={{ fontSize: '0.7rem', color: 'var(--lcars-text-dim)', marginTop: '4px', textAlign: 'center', fontStyle: 'italic' }}>{f.legenda}</div>}
                  <button onClick={() => removeShipPhoto(i)} style={{
                    position: 'absolute', top: '6px', right: '6px', background: 'rgba(204,68,68,0.9)',
                    border: 'none', color: '#fff', borderRadius: '50%', width: '22px', height: '22px',
                    fontSize: '0.6rem', cursor: 'pointer', lineHeight: '22px', textAlign: 'center',
                  }}>✕</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)', fontSize: '0.85rem' }}>
              Nenhum registro visual disponivel. Use o botao acima para adicionar.
            </div>
          )}
        </div>
      </div>

      {/* ===== TRIPULAÇÃO EMBARCADA ===== */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-lavender)' }}>
          Tripulacao Embarcada — {tripulantes.length} membros
          <button onClick={() => setShowAddCrew(!showAddCrew)}
            style={{ float: 'right', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
            {showAddCrew ? '✕ Fechar' : '+ Embarcar Tripulante'}
          </button>
        </div>
        <div className="lcars-panel-body">
          {showAddCrew && (
            <div style={{ padding: '14px', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--lcars-radius-sm)', border: '1px solid #333' }}>
              <form onSubmit={addTripulante}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Tripulante</label>
                    <select value={addSlug} onChange={e => setAddSlug(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                      <option value="">Selecionar oficial...</option>
                      {fichasDisponiveis.map(f => <option key={f.slug} value={f.slug}>{f.nome} ({f.patente} - {f.divisao})</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '0 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Posto na nave</label>
                    {!useCustomPosto ? (
                      <select value={addPosto} onChange={e => setAddPosto(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                        {POSTOS_PADRAO.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    ) : (
                      <input value={customPosto} onChange={e => setCustomPosto(e.target.value)} placeholder="Nome do posto..." style={{ ...inputStyle, width: '100%' }} />
                    )}
                  </div>
                  <button type="button" onClick={() => { setUseCustomPosto(!useCustomPosto); setCustomPosto(''); }}
                    className="lcars-btn lavender" style={{ fontSize: '0.7rem', padding: '6px 12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {useCustomPosto ? 'Postos padrão' : 'Posto customizado'}
                  </button>
                  <button type="submit" className="lcars-btn teal" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    Embarcar
                  </button>
                </div>
                {crewMsg && <div style={{ marginTop: '10px', fontSize: '0.85rem', color: crewMsg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)' }}>{crewMsg}</div>}
              </form>
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)' }}>Carregando...</div>
          ) : tripulantes.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {tripulantes.map((t, i) => {
                const ficha = fichasAtivas.find(f => f.slug === t.fichaSlug);
                const isCaptainCrew = t.fichaSlug === naveData?.capitaoSlug;
                const borderColor = isCaptainCrew ? 'var(--lcars-sky)' : 'var(--lcars-lavender)';
                return (
                  <div key={i} className="lcars-card" style={{ borderColor, position: 'relative' }}>
                    <div className="lcars-card-body" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '70px', height: '85px', borderRadius: 'var(--lcars-radius-sm)',
                        border: `1px solid ${borderColor}`, background: 'rgba(0,0,0,0.4)', overflow: 'hidden', flexShrink: 0,
                      }}>
                        {ficha?.foto ? (
                          <img src={ficha.foto} alt={ficha.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.6rem', textTransform: 'uppercase' }}>Sem Foto</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-lcars)', fontSize: '0.95rem', fontWeight: 700,
                          color: 'var(--lcars-orange)', textTransform: 'uppercase', letterSpacing: '1px',
                          marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{ficha?.nome || t.fichaSlug}</div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <span className="lcars-badge orange" style={{ fontSize: '0.6rem' }}>{ficha?.patente || 'N/A'}</span>
                          <span className="lcars-badge blue" style={{ fontSize: '0.6rem' }}>{ficha?.divisao || 'N/A'}</span>
                          <span className="lcars-badge" style={{ fontSize: '0.55rem', background: isCaptainCrew ? 'var(--lcars-sky)' : 'var(--lcars-lavender)', color: '#000' }}>{t.posto}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <Link href={`/tripulacao/${t.fichaSlug}`} className="lcars-btn sky" style={{ fontSize: '0.65rem', padding: '3px 12px', display: 'inline-block' }}>Ver Ficha</Link>
                          {!isCaptainCrew && (
                            <button onClick={() => removeTripulante(t.fichaSlug)} className="lcars-btn red" style={{ fontSize: '0.55rem', padding: '3px 8px', border: 'none', cursor: 'pointer' }}>✕</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)' }}>Nenhum tripulante embarcado.</div>
          )}
        </div>
      </div>

      {/* ===== MISSÕES DA NAVE ===== */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header orange">
          Missoes da Nave — {missoes.length} registros
        </div>
        <div className="lcars-panel-body">
          <div style={{ marginBottom: '16px' }}>
            <button onClick={() => setShowMissionForm(!showMissionForm)}
              className="lcars-btn orange" style={{ border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
              {showMissionForm ? '✕ Cancelar' : '★ Nova Missao'}
            </button>
          </div>

          {missionMsg && <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: missionMsg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)' }}>{missionMsg}</div>}

          {showMissionForm && (
            <form onSubmit={createMission} style={{
              padding: '16px', background: 'rgba(255,153,0,0.05)',
              border: '1px solid rgba(255,153,0,0.2)', borderRadius: 'var(--lcars-radius-sm)', marginBottom: '20px',
            }}>
              <div className="lcars-form-group" style={{ marginBottom: '12px' }}>
                <label>Titulo da Missao</label>
                <input type="text" value={mTitulo} onChange={e => setMTitulo(e.target.value)} placeholder="Ex: Patrulha no Setor 7-G" required />
              </div>
              <div className="lcars-form-group" style={{ marginBottom: '12px' }}>
                <label>Data Estelar</label>
                <input type="date" value={mData} onChange={e => setMData(e.target.value)} required style={{ maxWidth: '200px' }} />
              </div>
              <div className="lcars-form-group" style={{ marginBottom: '12px' }}>
                <label>Registro do Comandante</label>
                <textarea value={mTexto} onChange={e => setMTexto(e.target.value)} placeholder="Relatorio da missao..." rows={6} required style={{ resize: 'vertical' }} />
              </div>
              <div className="lcars-form-group" style={{ marginBottom: '12px' }}>
                <label>Fotos da Missao (Link direto da imagem, uma por linha)</label>
                <textarea value={mFotos} onChange={e => setMFotos(e.target.value)}
                  placeholder={"https://exemplo.com/foto1.jpg\nhttps://exemplo.com/foto2.jpg"}
                  rows={3} style={{ resize: 'vertical', fontSize: '0.8rem' }} />
              </div>

              {/* Tripulação da missão */}
              <div style={{ marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--lcars-radius-sm)', border: '1px solid #333' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Tripulacao da Missao ({mSelectedCrew.length})
                </label>
                {mSelectedCrew.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {mSelectedCrew.map(c => (
                      <span key={c.fichaSlug} className="lcars-badge" style={{
                        background: 'var(--lcars-teal)', color: '#000', fontSize: '0.65rem', cursor: 'pointer'
                      }} onClick={() => toggleMCrewMember({ slug: c.fichaSlug, nome: c.nome, patente: c.patente })}>
                        {c.nome} ({c.postoMissao}) ✕
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <select value={mCrewPosto} onChange={e => setMCrewPosto(e.target.value)}
                    style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555', borderRadius: '4px', color: 'var(--lcars-peach)', fontSize: '0.75rem', flex: '0 0 auto' }}>
                    {POSTOS_MISSAO.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {mCrewPosto === 'Outro (digitar)' && (
                    <input placeholder="Digite o posto..." value={mCrewPostoCustom} onChange={e => setMCrewPostoCustom(e.target.value)}
                      style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--lcars-orange)', borderRadius: '4px', color: 'var(--lcars-orange)', fontSize: '0.75rem', width: '140px' }} />
                  )}
                  <input placeholder="Buscar tripulante..." value={mCrewSearch} onChange={e => setMCrewSearch(e.target.value)}
                    style={{ flex: 1, padding: '4px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555', borderRadius: '4px', color: 'var(--lcars-peach)', fontSize: '0.75rem', minWidth: '120px' }} />
                </div>
                {mCrewSearch && (
                  <div style={{ maxHeight: '120px', overflow: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                    {mFilteredFichas.map(f => (
                      <div key={f.slug} onClick={() => toggleMCrewMember(f)}
                        style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem',
                          color: mSelectedCrew.find(c => c.fichaSlug === f.slug) ? 'var(--lcars-teal)' : 'var(--lcars-text-light)',
                          borderBottom: '1px solid #222' }}>
                        {mSelectedCrew.find(c => c.fichaSlug === f.slug) ? '✓ ' : ''}{f.patente} {f.nome}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="lcars-btn orange" style={{ border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                Registrar Missao
              </button>
            </form>
          )}

          {/* Lista de missões */}
          {missoes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {missoes.map(m => (
                <div key={m.id}>
                  {editingMission === m.id ? (
                    <form onSubmit={saveEditMission} style={{
                      padding: '16px', background: 'rgba(255,153,0,0.05)',
                      border: '1px solid rgba(255,153,0,0.2)', borderRadius: 'var(--lcars-radius-sm)',
                    }}>
                      <div className="lcars-form-group" style={{ marginBottom: '10px' }}>
                        <label>Titulo</label>
                        <input type="text" value={emTitulo} onChange={e => setEmTitulo(e.target.value)} required />
                      </div>
                      <div className="lcars-form-group" style={{ marginBottom: '10px' }}>
                        <label>Data</label>
                        <input type="date" value={emData} onChange={e => setEmData(e.target.value)} required style={{ maxWidth: '200px' }} />
                      </div>
                      <div className="lcars-form-group" style={{ marginBottom: '10px' }}>
                        <label>Texto</label>
                        <textarea value={emTexto} onChange={e => setEmTexto(e.target.value)} rows={4} required style={{ resize: 'vertical' }} />
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                          Fotos da Missao ({emFotos.length})
                        </label>
                        {emFotos.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {emFotos.map((url, fi) => (
                              <div key={fi} style={{ position: 'relative' }}>
                                <img src={url} alt="" style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: 'var(--lcars-radius-sm)', border: '1px solid var(--lcars-orange)' }} />
                                <button type="button" onClick={() => setEmFotos(prev => prev.filter((_, j) => j !== fi))}
                                  style={{
                                    position: 'absolute', top: '2px', right: '2px', background: 'rgba(204,68,68,0.9)',
                                    border: 'none', color: '#fff', borderRadius: '50%', width: '18px', height: '18px',
                                    fontSize: '0.5rem', cursor: 'pointer', lineHeight: '18px', textAlign: 'center',
                                  }}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input type="url" value={emNewFotoUrl} onChange={e => setEmNewFotoUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            style={{ ...inputStyle, flex: 1, fontSize: '0.75rem' }} />
                          <button type="button" onClick={() => {
                            if (emNewFotoUrl.trim()) { setEmFotos(prev => [...prev, normalizeImgurUrl(emNewFotoUrl.trim())]); setEmNewFotoUrl(''); }
                          }} className="lcars-btn blue" style={{ fontSize: '0.6rem', padding: '4px 10px', border: 'none', cursor: 'pointer' }}>+ Foto</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" className="lcars-btn orange" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Salvar</button>
                        <button type="button" onClick={() => setEditingMission(null)} className="lcars-btn" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <div className="lcars-card-hover" style={{
                      padding: '14px 18px', background: 'rgba(0,0,0,0.3)',
                      borderLeft: '3px solid var(--lcars-orange)', borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ color: 'var(--lcars-orange)', fontWeight: 600, fontSize: '0.95rem' }}>★ {m.titulo}</div>
                          <div style={{ color: 'var(--lcars-text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>
                            Data Estelar {m.data} — {(m.tripulantes || []).length} tripulante(s) — {(m.diarios || []).length} diario(s){(m.fotos || []).length > 0 ? ` — ${m.fotos.length} foto(s)` : ''}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button onClick={() => startEditMission(m)} className="lcars-btn blue" style={{ fontSize: '0.6rem', padding: '3px 10px', border: 'none', cursor: 'pointer' }}>EDITAR</button>
                          <button onClick={() => setConfirmDelete(m.id)} className="lcars-btn red" style={{ fontSize: '0.6rem', padding: '3px 10px', border: 'none', cursor: 'pointer' }}>✕</button>
                          <Link href={`/historico/missoes/${m.id}`} style={{ textDecoration: 'none' }}>
                            <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.6rem', cursor: 'pointer' }}>ACESSAR →</span>
                          </Link>
                        </div>
                      </div>
                      {m.texto && (
                        <div style={{
                          marginTop: '8px', color: '#999', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>{m.texto}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--lcars-text-dim)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              ★ Nenhuma missao registrada
            </div>
          )}
        </div>
      </div>

      {/* ===== CONFIRM DELETE MISSION ===== */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="lcars-panel" style={{ maxWidth: '400px', borderColor: 'var(--lcars-red)' }}>
            <div className="lcars-panel-header" style={{ background: 'var(--lcars-red)', color: '#fff' }}>CONFIRMAR EXCLUSAO</div>
            <div className="lcars-panel-body" style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '16px' }}>Excluir esta missao? Esta acao nao pode ser desfeita.</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={() => deleteMission(confirmDelete)} className="lcars-btn" style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.8rem', padding: '8px 24px' }}>EXCLUIR</button>
                <button onClick={() => setConfirmDelete(null)} className="lcars-btn" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== LIGHTBOX ===== */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <img src={lightboxImg} alt="" style={{
            maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain',
            borderRadius: 'var(--lcars-radius-sm)', border: '2px solid var(--lcars-sky)',
          }} />
          <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', fontSize: '1.5rem' }}>✕</div>
        </div>
      )}
    </div>
  );
}
