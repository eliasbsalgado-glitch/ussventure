'use client';
// ============================================
// MISSAO INDIVIDUAL — Detalhes + diários
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
  const [diarioTexto, setDiarioTexto] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ titulo: '', data: '', texto: '' });
  const [confirmDeleteDiario, setConfirmDeleteDiario] = useState(null);
  const [confirmDeleteMissao, setConfirmDeleteMissao] = useState(false);
  const [fichas, setFichas] = useState([]);
  const [crewSearch, setCrewSearch] = useState('');
  const [editingCrew, setEditingCrew] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState([]);

  useEffect(() => {
    fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
      .then(r => r.json()).then(d => { if (d.logged) setSession(d); });
    loadMissao();
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

  async function loadFichas() {
    if (fichas.length === 0) {
      const res = await fetch('/api/fichas');
      setFichas(await res.json());
    }
  }

  const isAdmin = session?.role === 'admin';
  const tripulantes = missao?.tripulantes || [];
  const isParticipant = session?.fichaSlug && tripulantes.some(t => t.fichaSlug === session.fichaSlug);
  const canWrite = isAdmin || isParticipant;
  const canManage = isAdmin; // Captain check would need naves_crew lookup

  async function submitDiario(e) {
    e.preventDefault();
    if (!diarioTexto.trim()) return;
    const res = await fetch(`/api/missoes/${id}/diarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: diarioTexto }),
    });
    if (res.ok) {
      setDiarioTexto('');
      loadMissao();
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
    if (res.ok) {
      setEditing(false);
      loadMissao();
    }
  }

  async function saveCrew() {
    const res = await fetch(`/api/missoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripulantes: selectedCrew }),
    });
    if (res.ok) {
      setEditingCrew(false);
      loadMissao();
    }
  }

  function toggleCrew(ficha) {
    const exists = selectedCrew.find(c => c.fichaSlug === ficha.slug);
    if (exists) setSelectedCrew(selectedCrew.filter(c => c.fichaSlug !== ficha.slug));
    else setSelectedCrew([...selectedCrew, { fichaSlug: ficha.slug, nome: ficha.nome, patente: ficha.patente }]);
  }

  async function deleteMissao() {
    const res = await fetch(`/api/missoes/${id}`, { method: 'DELETE' });
    if (res.ok) window.location.href = '/historico/missoes';
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Carregando...</div>;
  if (!missao) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-red)' }}>Missao nao encontrada</div>;

  const cor = naveCores[missao.nave_slug] || 'var(--lcars-sky)';
  const naveNome = NAVES[missao.nave_slug] || missao.nave_slug;
  const diarios = missao.diarios || [];
  const filteredFichas = fichas.filter(f =>
    f.nome.toLowerCase().includes(crewSearch.toLowerCase()) ||
    f.patente?.toLowerCase().includes(crewSearch.toLowerCase())
  ).slice(0, 15);

  return (
    <div>
      <div className="lcars-hero">
        <h1>{missao.titulo}</h1>
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
          <button onClick={() => { loadFichas(); setEditingCrew(true); }}
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
                    {c.patente} {c.nome} ✕
                  </span>
                ))}
              </div>
            )}
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

      {/* Relatório da missão */}
      <div className="lcars-panel" style={{ marginBottom: '20px' }}>
        <div className="lcars-panel-header" style={{ background: cor, color: '#000' }}>Relatorio da Missao</div>
        <div className="lcars-panel-body" style={{ padding: '16px' }}>
          <p style={{ color: 'var(--lcars-text-light)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {missao.texto || 'Sem descricao.'}
          </p>
        </div>
      </div>

      {/* Tripulação participante */}
      <div className="lcars-panel" style={{ marginBottom: '20px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-teal)', color: '#000' }}>
          Tripulacao Designada ({tripulantes.length})
        </div>
        <div className="lcars-panel-body" style={{ padding: '16px' }}>
          {tripulantes.length === 0 ? (
            <p style={{ color: 'var(--lcars-text-dim)' }}>Nenhum tripulante designado.</p>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tripulantes.map(t => (
                <Link key={t.fichaSlug} href={`/tripulacao/${t.fichaSlug}`} style={{ textDecoration: 'none' }}>
                  <span className="lcars-badge" style={{
                    background: 'rgba(255,255,255,0.08)', color: 'var(--lcars-text-light)',
                    border: '1px solid var(--lcars-teal)', fontSize: '0.75rem', padding: '6px 12px',
                  }}>
                    {t.patente} {t.nome}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Diários pessoais */}
      <div className="lcars-panel" style={{ marginBottom: '20px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-lavender)', color: '#000' }}>
          Diarios Pessoais ({diarios.length})
        </div>
        <div className="lcars-panel-body" style={{ padding: '16px' }}>
          {diarios.length === 0 ? (
            <p style={{ color: 'var(--lcars-text-dim)' }}>Nenhum diario registrado nesta missao.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {diarios.map(d => (
                <div key={d.id} className="lcars-card" style={{ borderColor: 'var(--lcars-lavender)', position: 'relative' }}>
                  <div style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                      <Link href={`/tripulacao/${d.autorSlug}`} style={{ textDecoration: 'none' }}>
                        <span style={{ color: 'var(--lcars-lavender)', fontWeight: 700, fontSize: '0.85rem' }}>
                          {d.patente ? `${d.patente} ` : ''}{d.nome}
                        </span>
                      </Link>
                      <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.75rem' }}>{d.data}</span>
                    </div>
                    <p style={{ color: 'var(--lcars-text-light)', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                      {d.texto}
                    </p>
                  </div>
                  {/* Delete button */}
                  {(isAdmin || d.autorSlug === session?.fichaSlug) && (
                    <button onClick={() => setConfirmDeleteDiario(d.id)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--lcars-red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.65rem' }}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Write diary form */}
          {canWrite && (
            <form onSubmit={submitDiario} style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <textarea
                value={diarioTexto}
                onChange={e => setDiarioTexto(e.target.value)}
                placeholder="Escrever entrada de diario..."
                rows={3}
                style={{ flex: 1, background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', resize: 'vertical', fontSize: '0.85rem' }}
              />
              <button type="submit" className="lcars-btn lavender" style={{ fontSize: '0.8rem', padding: '8px 16px', alignSelf: 'flex-end' }}>
                REGISTRAR
              </button>
            </form>
          )}
        </div>
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
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '16px' }}>Excluir esta entrada de diario?</p>
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
                Tem certeza que deseja excluir a missao <strong>"{missao.titulo}"</strong>? Todos os diarios serao perdidos.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={deleteMissao} className="lcars-btn" style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.8rem', padding: '8px 24px' }}>EXCLUIR</button>
                <button onClick={() => setConfirmDeleteMissao(false)} className="lcars-btn" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <Link href="/historico/missoes" className="lcars-btn lavender" style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar para Missoes
        </Link>
      </div>
    </div>
  );
}
