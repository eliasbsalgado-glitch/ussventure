'use client';
// ============================================
// MISSÕES DA FROTA — Lista todas as missões
// Client component com filtro por nave e CRUD
// ============================================
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAVES = [
  { slug: 'adventure', nome: 'USS Adventure NCC 74508' },
  { slug: 'altotting', nome: 'USS Altötting NCC 80101' },
  { slug: 'andor', nome: 'USS Andor NCC 71899' },
  { slug: 'nautilus', nome: 'USS Nautilus NCC 80100' },
  { slug: 'rerum', nome: 'USS Rerum NCC 80200' },
  { slug: 'serenity', nome: 'USS Serenity NCC 80102' },
  { slug: 'suidara', nome: 'USS Suidara NCC 74700' },
];

const naveCores = {
  adventure: 'var(--lcars-orange)',
  altotting: 'var(--lcars-sky)',
  andor: 'var(--lcars-blue)',
  nautilus: 'var(--lcars-teal)',
  rerum: 'var(--lcars-lavender)',
  serenity: 'var(--lcars-peach)',
  suidara: 'var(--lcars-green)',
};

export default function MissoesPage() {
  const [missoes, setMissoes] = useState([]);
  const [filtroNave, setFiltroNave] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ naveSlug: '', titulo: '', data: '', texto: '' });
  const [fichas, setFichas] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [crewSearch, setCrewSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
      .then(r => r.json()).then(d => { if (d.logged) setSession(d); });
    loadMissoes();
  }, []);

  async function loadMissoes() {
    setLoading(true);
    const url = filtroNave ? `/api/missoes?nave=${filtroNave}` : '/api/missoes';
    const res = await fetch(url);
    const data = await res.json();
    setMissoes(data);
    setLoading(false);
  }

  useEffect(() => { loadMissoes(); }, [filtroNave]);

  async function loadFichas() {
    const res = await fetch('/api/fichas');
    const data = await res.json();
    setFichas(data);
  }

  function openForm() {
    loadFichas();
    setShowForm(true);
  }

  function toggleCrew(ficha) {
    const exists = selectedCrew.find(c => c.fichaSlug === ficha.slug);
    if (exists) {
      setSelectedCrew(selectedCrew.filter(c => c.fichaSlug !== ficha.slug));
    } else {
      setSelectedCrew([...selectedCrew, { fichaSlug: ficha.slug, nome: ficha.nome, patente: ficha.patente }]);
    }
  }

  async function createMissao(e) {
    e.preventDefault();
    const res = await fetch('/api/missoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tripulantes: selectedCrew }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ naveSlug: '', titulo: '', data: '', texto: '' });
      setSelectedCrew([]);
      loadMissoes();
    }
  }

  async function deleteMissao(id) {
    const res = await fetch(`/api/missoes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadMissoes();
    }
  }

  const canCreate = session && (session.role === 'admin' || session.role === 'capitao');
  const isAdmin = session?.role === 'admin';
  const filteredFichas = fichas.filter(f =>
    f.nome.toLowerCase().includes(crewSearch.toLowerCase()) ||
    f.patente?.toLowerCase().includes(crewSearch.toLowerCase())
  ).slice(0, 20);

  return (
    <div>
      <div className="lcars-hero">
        <h1>Log de Missoes</h1>
        <div className="subtitle">Registro de todas as missoes da Frota Venture</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Filtro + ações */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={filtroNave}
          onChange={e => setFiltroNave(e.target.value)}
          style={{
            background: '#111', color: 'var(--lcars-text-light)', border: '1px solid #444',
            borderRadius: 'var(--lcars-radius-sm)', padding: '8px 16px',
            fontFamily: 'var(--font-lcars)', fontSize: '0.8rem',
          }}
        >
          <option value="">TODAS AS NAVES</option>
          {NAVES.map(n => <option key={n.slug} value={n.slug}>{n.nome}</option>)}
        </select>

        <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.8rem', marginLeft: 'auto' }}>
          {missoes.length} MISSOES REGISTRADAS
        </span>

        {canCreate && (
          <button onClick={openForm} className="lcars-btn orange" style={{ fontSize: '0.8rem', padding: '8px 20px' }}>
            + NOVA MISSAO
          </button>
        )}
      </div>

      {/* Form nova missão */}
      {showForm && (
        <div className="lcars-panel" style={{ marginBottom: '24px', borderColor: 'var(--lcars-orange)' }}>
          <div className="lcars-panel-header" style={{ background: 'var(--lcars-orange)', color: '#000' }}>
            Nova Missao
          </div>
          <div className="lcars-panel-body" style={{ padding: '20px' }}>
            <form onSubmit={createMissao} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <select
                value={form.naveSlug} required
                onChange={e => setForm({ ...form, naveSlug: e.target.value })}
                style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px' }}
              >
                <option value="">Selecione a Nave</option>
                {NAVES.map(n => <option key={n.slug} value={n.slug}>{n.nome}</option>)}
              </select>
              <input
                placeholder="Titulo da missao"
                value={form.titulo} required
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px' }}
              />
              <input
                type="date" value={form.data} required
                onChange={e => setForm({ ...form, data: e.target.value })}
                style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px' }}
              />
              <textarea
                placeholder="Descricao da missao..."
                value={form.texto} rows={4}
                onChange={e => setForm({ ...form, texto: e.target.value })}
                style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', resize: 'vertical' }}
              />

              {/* Seletor de tripulantes */}
              <div style={{ border: '1px solid #333', borderRadius: '4px', padding: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--lcars-orange)', marginBottom: '8px', fontWeight: 700 }}>
                  TRIPULACAO PARTICIPANTE ({selectedCrew.length})
                </div>
                {selectedCrew.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {selectedCrew.map(c => (
                      <span key={c.fichaSlug} className="lcars-badge" style={{
                        background: 'var(--lcars-orange)', color: '#000', fontSize: '0.7rem', cursor: 'pointer'
                      }} onClick={() => toggleCrew({ slug: c.fichaSlug, nome: c.nome, patente: c.patente })}>
                        {c.patente} {c.nome} ✕
                      </span>
                    ))}
                  </div>
                )}
                <input
                  placeholder="Buscar tripulante..."
                  value={crewSearch}
                  onChange={e => setCrewSearch(e.target.value)}
                  style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '6px 8px', borderRadius: '4px', width: '100%', fontSize: '0.8rem', marginBottom: '6px' }}
                />
                {crewSearch && (
                  <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                    {filteredFichas.map(f => (
                      <div key={f.slug}
                        onClick={() => toggleCrew(f)}
                        style={{
                          padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem',
                          color: selectedCrew.find(c => c.fichaSlug === f.slug) ? 'var(--lcars-orange)' : 'var(--lcars-text-light)',
                          borderBottom: '1px solid #222',
                        }}
                      >
                        {selectedCrew.find(c => c.fichaSlug === f.slug) ? '✓ ' : ''}{f.patente} {f.nome}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="lcars-btn orange" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>
                  CRIAR MISSAO
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="lcars-btn" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de missões */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--lcars-text-dim)', padding: '40px' }}>Carregando...</div>
      ) : missoes.length === 0 ? (
        <div className="lcars-panel">
          <div className="lcars-panel-body" style={{ padding: '40px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>
            Nenhuma missao registrada{filtroNave ? ` para esta nave` : ''}.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {missoes.map(m => {
            const cor = naveCores[m.nave_slug] || 'var(--lcars-sky)';
            const naveNome = NAVES.find(n => n.slug === m.nave_slug)?.nome || m.nave_slug;
            const tripCount = (m.tripulantes || []).length;
            return (
              <div key={m.id} className="lcars-card lcars-card-hover" style={{ borderColor: cor, position: 'relative' }}>
                <Link href={`/historico/missoes/${m.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'stretch', overflow: 'hidden', borderRadius: 'var(--lcars-radius-sm)' }}>
                    <div style={{
                      width: '8px', background: cor, flexShrink: 0,
                    }} />
                    <div style={{ padding: '16px 20px', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px', alignItems: 'center' }}>
                        <span className="lcars-badge" style={{ background: cor, color: '#000', fontSize: '0.6rem' }}>
                          {naveNome}
                        </span>
                        <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-lcars)' }}>
                          {m.data}
                        </span>
                        {tripCount > 0 && (
                          <span className="lcars-badge" style={{
                            background: 'rgba(255,255,255,0.1)', color: 'var(--lcars-text-light)',
                            border: '1px solid #444', fontSize: '0.6rem',
                          }}>
                            {tripCount} TRIPULANTES
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '2px', color: 'var(--lcars-text-light)',
                      }}>
                        {m.titulo}
                      </div>
                      {m.texto && (
                        <div style={{ color: 'var(--lcars-text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
                          {m.texto.substring(0, 120)}{m.texto.length > 120 ? '...' : ''}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', paddingRight: '16px', color: 'var(--lcars-text-dim)', fontSize: '1.2rem' }}>
                      ▸
                    </div>
                  </div>
                </Link>

                {/* Delete button for admin */}
                {isAdmin && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2 }}>
                    <button onClick={(e) => { e.preventDefault(); setConfirmDelete(m.id); }}
                      style={{ background: 'var(--lcars-red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.7rem' }}>
                      ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="lcars-panel" style={{ maxWidth: '400px', borderColor: 'var(--lcars-red)' }}>
            <div className="lcars-panel-header" style={{ background: 'var(--lcars-red)', color: '#fff' }}>
              CONFIRMAR EXCLUSAO
            </div>
            <div className="lcars-panel-body" style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '16px' }}>
                Tem certeza que deseja excluir esta missao? Esta acao nao pode ser desfeita.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={() => deleteMissao(confirmDelete)} className="lcars-btn"
                  style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.8rem', padding: '8px 24px' }}>
                  EXCLUIR
                </button>
                <button onClick={() => setConfirmDelete(null)} className="lcars-btn"
                  style={{ fontSize: '0.8rem', padding: '8px 24px' }}>
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '24px', paddingBottom: '20px' }}>
        <Link href="/historico" className="lcars-btn lavender" style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar para Historico
        </Link>
      </div>
    </div>
  );
}
