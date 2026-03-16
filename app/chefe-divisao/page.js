'use client';

// ============================================
// CHEFE DE DIVISÃO — Painel Gerenciar Divisão
// Nivel de acesso: Chefe de Divisao
// Funcoes: editar descricao, departamentos, eventos
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

const DIVISAO_INFO = {
  'comando': { nome: 'Comando', cor: '#CC6666' },
  'academia': { nome: 'Academia', cor: '#999999' },
  'ciencias': { nome: 'Ciencias', cor: '#6688CC' },
  'comunicacoes': { nome: 'Comunicacoes', cor: '#66CC66' },
  'engenharia': { nome: 'Engenharia', cor: '#FFAA00' },
  'operacoes': { nome: 'Operacoes', cor: '#FFAA00' },
  'tatico': { nome: 'Tatico', cor: '#CC6666' },
};

export default function ChefeDivisaoPage() {
  const { user, loading: authLoading } = useAuth();
  const [membros, setMembros] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [divData, setDivData] = useState({ descricao: '', departamentos: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Description editing
  const [editingDesc, setEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  // Department form
  const [showDepForm, setShowDepForm] = useState(false);
  const [depNome, setDepNome] = useState('');
  const [depChefe, setDepChefe] = useState('');
  const [depDesc, setDepDesc] = useState('');

  // Edit department
  const [editingDep, setEditingDep] = useState(null);
  const [edNome, setEdNome] = useState('');
  const [edChefe, setEdChefe] = useState('');
  const [edDesc, setEdDesc] = useState('');

  // Confirm delete department
  const [confirmDeleteDep, setConfirmDeleteDep] = useState(null);

  // Cursos da Academia (only for academia chefe)
  const [allFichas, setAllFichas] = useState([]);
  const [cursoSearch, setCursoSearch] = useState('');
  const [selectedOficial, setSelectedOficial] = useState(null);
  const [oficialCursos, setOficialCursos] = useState([]);
  const [novoCursoNome, setNovoCursoNome] = useState('');
  const [novoCursoData, setNovoCursoData] = useState(new Date().toISOString().split('T')[0]);
  const [cursoMsg, setCursoMsg] = useState('');
  const [loadingCursos, setLoadingCursos] = useState(false);

  // Evento form
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [eventoTitulo, setEventoTitulo] = useState('');
  const [eventoData, setEventoData] = useState(new Date().toISOString().split('T')[0]);
  const [eventoTexto, setEventoTexto] = useState('');

  // Edit evento
  const [editingEvento, setEditingEvento] = useState(null);
  const [editETitulo, setEditETitulo] = useState('');
  const [editEData, setEditEData] = useState('');
  const [editETexto, setEditETexto] = useState('');

  const divisaoSlug = user?.divisaoSlug;
  const divInfo = divisaoSlug ? DIVISAO_INFO[divisaoSlug] : null;

  useEffect(() => {
    if (!divisaoSlug) return;
    Promise.all([
      fetch(`/api/fichas?divisao=${divisaoSlug}`).then(r => r.json()),
      fetch('/api/agenda').then(r => r.json()),
      fetch(`/api/divisoes/${divisaoSlug}`).then(r => r.json()),
    ]).then(([fichasList, eventosAll, divDataRes]) => {
      setMembros(fichasList);
      setEventos(eventosAll.filter(e => e.divisao === divisaoSlug));
      setDivData(divDataRes);
      setEditDesc(divDataRes.descricao || '');
      setLoading(false);
    }).catch(() => setLoading(false));

    // For academia: load ALL fichas for course management
    if (divisaoSlug === 'academia') {
      fetch('/api/fichas').then(r => r.json()).then(data => setAllFichas(data)).catch(() => {});
    }
  }, [divisaoSlug]);

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Verificando autorizacao...</div>;
  }

  const cargos = user?.cargos || [];
  if (!user?.logged || !cargos.includes('chefe_divisao') || !divisaoSlug) {
    return (
      <div>
        <div className="lcars-hero">
          <h1>Acesso Restrito</h1>
          <div className="subtitle">Painel exclusivo para Chefes de Divisao</div>
        </div>
        <div className="lcars-bar gradient" />
        <div className="lcars-panel">
          <div className="lcars-panel-header red">Acesso Negado</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ color: 'var(--lcars-text-dim)', marginBottom: '14px' }}>Apenas chefes de divisao podem acessar este painel.</p>
            <Link href="/login" className="lcars-btn orange">Fazer Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = {
    padding: '8px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
    fontFamily: 'var(--font-lcars)', fontSize: '0.85rem',
  };

  // === Descricao ===
  async function salvarDescricao(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch(`/api/divisoes/${divisaoSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateDescricao', descricao: editDesc }),
    });
    if (res.ok) {
      const data = await res.json();
      setDivData(prev => ({ ...prev, descricao: data.descricao }));
      setMsg('Descricao atualizada!'); setEditingDesc(false);
    } else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
  }

  // === Departamentos ===
  async function criarDepartamento(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch(`/api/divisoes/${divisaoSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addDepartamento', nome: depNome, chefeSlug: depChefe, descricao: depDesc }),
    });
    if (res.ok) {
      const data = await res.json();
      setDivData(prev => ({ ...prev, departamentos: data.departamentos }));
      setDepNome(''); setDepChefe(''); setDepDesc(''); setShowDepForm(false);
      setMsg('Departamento criado!');
    } else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
  }

  function startEditDep(dep) {
    setEditingDep(dep.id); setEdNome(dep.nome); setEdChefe(dep.chefeSlug || ''); setEdDesc(dep.descricao || '');
  }

  async function salvarEditDep(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch(`/api/divisoes/${divisaoSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateDepartamento', id: editingDep, nome: edNome, chefeSlug: edChefe, descricao: edDesc }),
    });
    if (res.ok) {
      const data = await res.json();
      setDivData(prev => ({ ...prev, departamentos: data.departamentos }));
      setEditingDep(null); setMsg('Departamento atualizado!');
    } else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
  }

  async function confirmarDeleteDep() {
    if (!confirmDeleteDep) return; setMsg('');
    const res = await fetch(`/api/divisoes/${divisaoSlug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'removeDepartamento', id: confirmDeleteDep }),
    });
    if (res.ok) {
      const data = await res.json();
      setDivData(prev => ({ ...prev, departamentos: data.departamentos }));
      setMsg('Departamento removido.');
    } else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
    setConfirmDeleteDep(null);
  }

  // === Eventos ===
  async function criarEvento(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/agenda', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ divisao: divisaoSlug, titulo: eventoTitulo, data: eventoData, texto: eventoTexto }),
    });
    if (res.ok) {
      const data = await res.json();
      setMsg('Evento criado!'); setEventoTitulo(''); setEventoData(new Date().toISOString().split('T')[0]); setEventoTexto('');
      setShowEventoForm(false); setEventos(prev => [...prev, data.evento]);
    } else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
  }

  async function editarEvento(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/agenda', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingEvento, titulo: editETitulo, data: editEData, texto: editETexto }),
    });
    if (res.ok) {
      setMsg('Evento atualizado!'); setEditingEvento(null);
      const eventosAll = await fetch('/api/agenda').then(r => r.json());
      setEventos(eventosAll.filter(ev => ev.divisao === divisaoSlug));
    } else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
  }

  async function excluirEvento(id) {
    if (!confirm('Excluir este evento?')) return;
    const res = await fetch('/api/agenda', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) { setEventos(prev => prev.filter(ev => ev.id !== id)); setMsg('Evento excluido.'); }
    else { const data = await res.json(); setMsg(`Erro: ${data.error}`); }
  }

  function startEditEvento(ev) {
    setEditingEvento(ev.id); setEditETitulo(ev.titulo); setEditEData(ev.data); setEditETexto(ev.texto || '');
  }

  // Helper: get member name by slug
  function getMembroNome(slug) {
    const m = membros.find(f => f.slug === slug);
    return m ? m.nome : slug;
  }

  // === Cursos da Academia ===
  const isAcademia = divisaoSlug === 'academia';

  async function selectOficialForCursos(ficha) {
    setSelectedOficial(ficha);
    setCursoMsg('');
    setNovoCursoNome('');
    setLoadingCursos(true);
    try {
      const res = await fetch(`/api/fichas/${ficha.slug}`);
      const data = await res.json();
      setOficialCursos(data.cursos || []);
    } catch { setOficialCursos([]); }
    setLoadingCursos(false);
  }

  async function adicionarCurso(e) {
    e.preventDefault();
    if (!selectedOficial || !novoCursoNome.trim()) return;
    setCursoMsg('');
    const res = await fetch(`/api/fichas/${selectedOficial.slug}/cursos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', curso: { nome: novoCursoNome.trim(), data: novoCursoData } }),
    });
    if (res.ok) {
      const data = await res.json();
      setOficialCursos(data.cursos);
      setNovoCursoNome('');
      setCursoMsg(`Curso adicionado para ${data.oficialNome}!`);
    } else {
      const data = await res.json();
      setCursoMsg(`Erro: ${data.error}`);
    }
  }

  const filteredFichasCurso = cursoSearch.length >= 2
    ? allFichas.filter(f =>
        f.nome.toLowerCase().includes(cursoSearch.toLowerCase()) ||
        f.slug.toLowerCase().includes(cursoSearch.toLowerCase())
      ).slice(0, 12)
    : [];

  const departamentos = divData.departamentos || [];

  return (
    <div>
      <div className="lcars-hero">
        <h1>Gerenciar Divisao</h1>
        <div className="subtitle" style={{ color: divInfo?.cor }}>{divInfo?.nome || divisaoSlug}</div>
      </div>

      <div className="lcars-bar gradient" style={{ background: divInfo?.cor ? `linear-gradient(90deg, ${divInfo.cor}, ${divInfo.cor}88, ${divInfo.cor}44)` : undefined }} />

      {msg && (
        <div style={{
          marginBottom: '12px', padding: '10px 16px', fontSize: '0.85rem', borderRadius: 'var(--lcars-radius-sm)',
          background: msg.includes('Erro') ? 'rgba(204,102,102,0.15)' : 'rgba(102,204,153,0.15)',
          border: msg.includes('Erro') ? '1px solid var(--lcars-red)' : '1px solid var(--lcars-teal)',
          color: msg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)',
        }}>{msg}</div>
      )}

      {/* ===== DADOS DA DIVISÃO ===== */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header" style={{ background: divInfo?.cor, color: '#000' }}>
          Dados da Divisao
          <button onClick={() => { setEditingDesc(!editingDesc); setEditDesc(divData.descricao || ''); }}
            style={{ float: 'right', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#000' }}>
            {editingDesc ? '✕ Fechar' : '✏ Editar Descricao'}
          </button>
        </div>
        <div className="lcars-panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Divisao</span>
              <br /><strong style={{ color: divInfo?.cor }}>{divInfo?.nome}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Membros</span>
              <br />{membros.length}
            </div>
            <div>
              <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Chefe</span>
              <br />{user.login}
            </div>
            <div>
              <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Departamentos</span>
              <br />{departamentos.length}
            </div>
          </div>
          {editingDesc ? (
            <form onSubmit={salvarDescricao}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Descricao da Divisao</label>
                <textarea style={{ ...inputStyle, width: '100%', minHeight: '80px', resize: 'vertical' }} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>
              <button type="submit" className="lcars-btn teal" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Salvar Descricao</button>
            </form>
          ) : (
            <p style={{ color: 'var(--lcars-text-light)', fontSize: '0.85rem', lineHeight: '1.7' }}>
              {divData.descricao || <span style={{ color: 'var(--lcars-text-dim)', fontStyle: 'italic' }}>Nenhuma descricao personalizada. Clique em Editar para adicionar.</span>}
            </p>
          )}
        </div>
      </div>

      {/* ===== DEPARTAMENTOS ===== */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header blue">
          Departamentos — {departamentos.length}
          <button onClick={() => { setShowDepForm(!showDepForm); setEditingDep(null); }}
            style={{ float: 'right', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
            {showDepForm ? '✕ Fechar' : '+ Novo Departamento'}
          </button>
        </div>
        <div className="lcars-panel-body" style={{ padding: 0 }}>
          {showDepForm && (
            <div style={{ padding: '14px', borderBottom: '1px solid #333' }}>
              <form onSubmit={criarDepartamento}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Nome do Departamento</label>
                    <input style={{ ...inputStyle, width: '100%' }} value={depNome} onChange={e => setDepNome(e.target.value)} required placeholder="Ex: Astrofisica" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Chefe do Departamento</label>
                    <select style={{ ...inputStyle, width: '100%' }} value={depChefe} onChange={e => setDepChefe(e.target.value)}>
                      <option value="">Sem chefe designado</option>
                      {membros.map(m => <option key={m.slug} value={m.slug}>{m.nome} ({m.patente})</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Descricao</label>
                  <textarea style={{ ...inputStyle, width: '100%', minHeight: '60px', resize: 'vertical' }} value={depDesc} onChange={e => setDepDesc(e.target.value)} placeholder="Funcoes e responsabilidades..." />
                </div>
                <button type="submit" className="lcars-btn blue" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Criar Departamento</button>
              </form>
            </div>
          )}
          {departamentos.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>
              Nenhum departamento cadastrado. Use o botao acima para criar.
            </div>
          ) : (
            departamentos.map(dep => (
              <div key={dep.id} style={{ padding: '14px', borderBottom: '1px solid #222' }}>
                {editingDep === dep.id ? (
                  <form onSubmit={salvarEditDep}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)' }}>Nome</label>
                        <input style={{ ...inputStyle, width: '100%', fontSize: '0.8rem' }} value={edNome} onChange={e => setEdNome(e.target.value)} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)' }}>Chefe</label>
                        <select style={{ ...inputStyle, width: '100%', fontSize: '0.8rem' }} value={edChefe} onChange={e => setEdChefe(e.target.value)}>
                          <option value="">Sem chefe designado</option>
                          {membros.map(m => <option key={m.slug} value={m.slug}>{m.nome} ({m.patente})</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)' }}>Descricao</label>
                      <textarea style={{ ...inputStyle, width: '100%', fontSize: '0.8rem', minHeight: '40px', resize: 'vertical' }} value={edDesc} onChange={e => setEdDesc(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="submit" className="lcars-btn teal" style={{ fontSize: '0.7rem', padding: '4px 12px', border: 'none', cursor: 'pointer' }}>Salvar</button>
                      <button type="button" onClick={() => setEditingDep(null)} className="lcars-btn" style={{ fontSize: '0.7rem', padding: '4px 12px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--lcars-blue)', fontSize: '0.95rem', marginBottom: '4px' }}>{dep.nome}</div>
                      {dep.chefeSlug && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--lcars-orange)', marginBottom: '4px' }}>
                          ★ Chefe: <Link href={`/tripulacao/${dep.chefeSlug}`} style={{ color: 'var(--lcars-orange)', textDecoration: 'none' }}>{getMembroNome(dep.chefeSlug)}</Link>
                        </div>
                      )}
                      {dep.descricao && <p style={{ color: 'var(--lcars-text-light)', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>{dep.descricao}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button onClick={() => startEditDep(dep)} className="lcars-btn blue" style={{ fontSize: '0.6rem', padding: '3px 8px', border: 'none', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => setConfirmDeleteDep(dep.id)} className="lcars-btn red" style={{ fontSize: '0.6rem', padding: '3px 8px', border: 'none', cursor: 'pointer' }}>Excluir</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== MEMBROS ===== */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header" style={{ background: divInfo?.cor, color: '#000' }}>Membros — {membros.length}</div>
        <div className="lcars-panel-body" style={{ padding: loading ? '30px' : 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Carregando...</div>
          ) : membros.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhum membro nesta divisao.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', padding: '14px' }}>
              {membros.map((m, i) => (
                <div key={i} className="lcars-card" style={{ borderColor: divInfo?.cor }}>
                  <div className="lcars-card-body" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{
                      width: '60px', height: '75px', borderRadius: 'var(--lcars-radius-sm)',
                      border: `1px solid ${divInfo?.cor || '#555'}`, background: 'rgba(0,0,0,0.4)', overflow: 'hidden', flexShrink: 0,
                    }}>
                      {m.foto ? (
                        <img src={m.foto} alt={m.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.5rem', textTransform: 'uppercase' }}>Sem Foto</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-lcars)', fontSize: '0.9rem', fontWeight: 700,
                        color: 'var(--lcars-orange)', textTransform: 'uppercase', letterSpacing: '1px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px',
                      }}>{m.nome}</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span className="lcars-badge orange" style={{ fontSize: '0.6rem' }}>{m.patente || 'N/A'}</span>
                      </div>
                      <Link href={`/tripulacao/${m.slug}`} className="lcars-btn sky" style={{ fontSize: '0.6rem', padding: '3px 10px', display: 'inline-block' }}>Ver Ficha</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== CURSOS DA ACADEMIA (only for academia chefe) ===== */}
      {isAcademia && (
        <div className="lcars-panel" style={{ marginBottom: '16px' }}>
          <div className="lcars-panel-header teal">
            Cursos da Academia — Gerenciamento
          </div>
          <div className="lcars-panel-body">
            <p style={{ fontSize: '0.8rem', color: 'var(--lcars-text-dim)', marginBottom: '14px', lineHeight: '1.5' }}>
              Busque um oficial da Frota para visualizar seus cursos e adicionar novos registros academicos.
            </p>

            {/* Search */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Buscar Oficial</label>
              <input
                style={{ ...inputStyle, width: '100%' }}
                placeholder="Digite o nome do oficial (minimo 2 caracteres)..."
                value={cursoSearch}
                onChange={e => { setCursoSearch(e.target.value); if (e.target.value.length < 2) setSelectedOficial(null); }}
              />
            </div>

            {/* Search results */}
            {filteredFichasCurso.length > 0 && (
              <div style={{
                maxHeight: '200px', overflow: 'auto', marginBottom: '14px',
                border: '1px solid #333', borderRadius: 'var(--lcars-radius-sm)',
                background: 'rgba(0,0,0,0.3)',
              }}>
                {filteredFichasCurso.map(f => (
                  <div key={f.slug} onClick={() => { selectOficialForCursos(f); setCursoSearch(f.nome); }}
                    style={{
                      padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem',
                      borderBottom: '1px solid #222', display: 'flex', gap: '10px', alignItems: 'center',
                      color: selectedOficial?.slug === f.slug ? 'var(--lcars-teal)' : 'var(--lcars-text-light)',
                      background: selectedOficial?.slug === f.slug ? 'rgba(102,204,153,0.1)' : 'transparent',
                    }}>
                    {f.foto ? (
                      <img src={f.foto} alt="" style={{ width: '30px', height: '36px', borderRadius: '3px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '30px', height: '36px', borderRadius: '3px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#555' }}>{f.nome.charAt(0)}</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700 }}>{f.nome}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--lcars-text-dim)' }}>{f.patente} — {f.divisao}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected oficial — cursos + add form */}
            {selectedOficial && (
              <div style={{
                padding: '16px', background: 'rgba(102,204,153,0.05)',
                border: '1px solid rgba(102,204,153,0.2)', borderRadius: 'var(--lcars-radius-sm)',
              }}>
                <div style={{
                  display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px',
                  paddingBottom: '12px', borderBottom: '1px solid rgba(102,204,153,0.15)',
                }}>
                  {selectedOficial.foto ? (
                    <img src={selectedOficial.foto} alt="" style={{ width: '45px', height: '55px', borderRadius: 'var(--lcars-radius-sm)', objectFit: 'cover', border: '1px solid var(--lcars-teal)' }} />
                  ) : (
                    <div style={{ width: '45px', height: '55px', borderRadius: 'var(--lcars-radius-sm)', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lcars-teal)', fontWeight: 700 }}>{selectedOficial.nome.charAt(0)}</div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--lcars-teal)', fontSize: '1rem' }}>{selectedOficial.nome}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--lcars-text-dim)' }}>{selectedOficial.patente} — {selectedOficial.divisao}</div>
                  </div>
                </div>

                {/* Current cursos */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Cursos Registrados ({oficialCursos.length})
                  </div>
                  {loadingCursos ? (
                    <div style={{ color: 'var(--lcars-text-dim)', fontSize: '0.8rem' }}>Carregando...</div>
                  ) : oficialCursos.length === 0 ? (
                    <div style={{ color: 'var(--lcars-text-dim)', fontSize: '0.8rem', fontStyle: 'italic' }}>Nenhum curso registrado.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {oficialCursos.map((c, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: '10px', alignItems: 'center',
                          padding: '6px 10px', background: 'rgba(0,0,0,0.3)',
                          borderRadius: 'var(--lcars-radius-sm)', borderLeft: '3px solid var(--lcars-teal)',
                        }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--lcars-sky)', flexShrink: 0 }}>{c.data || '—'}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--lcars-peach)' }}>{c.nome}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add curso form */}
                <form onSubmit={adicionarCurso}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Adicionar Novo Curso
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', marginBottom: '4px' }}>Nome do Curso</label>
                      <input style={{ ...inputStyle, width: '100%' }} value={novoCursoNome} onChange={e => setNovoCursoNome(e.target.value)} placeholder="Ex: Astrofisica Basica" required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', marginBottom: '4px' }}>Data</label>
                      <input type="date" style={inputStyle} value={novoCursoData} onChange={e => setNovoCursoData(e.target.value)} />
                    </div>
                    <button type="submit" className="lcars-btn teal" style={{ fontSize: '0.8rem', border: 'none', cursor: 'pointer', padding: '8px 20px' }}>+ Adicionar Curso</button>
                  </div>
                  {cursoMsg && (
                    <div style={{
                      marginTop: '8px', fontSize: '0.8rem',
                      color: cursoMsg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)',
                    }}>{cursoMsg}</div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== EVENTOS ===== */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: divInfo?.cor, color: '#000' }}>
          Eventos — {eventos.length}
          <button onClick={() => { setShowEventoForm(!showEventoForm); setEditingEvento(null); }}
            style={{ float: 'right', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#000' }}>
            {showEventoForm ? '✕ Fechar' : '+ Novo Evento'}
          </button>
        </div>
        <div className="lcars-panel-body" style={{ padding: 0 }}>
          {showEventoForm && (
            <div style={{ padding: '14px', borderBottom: '1px solid #333' }}>
              <form onSubmit={criarEvento}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Titulo do Evento</label>
                    <input style={{ ...inputStyle, width: '100%' }} value={eventoTitulo} onChange={e => setEventoTitulo(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Data</label>
                    <input type="date" style={inputStyle} value={eventoData} onChange={e => setEventoData(e.target.value)} required />
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Descricao</label>
                  <textarea style={{ ...inputStyle, width: '100%', minHeight: '60px', resize: 'vertical' }} value={eventoTexto} onChange={e => setEventoTexto(e.target.value)} />
                </div>
                <button type="submit" className="lcars-btn teal" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Publicar Evento</button>
              </form>
            </div>
          )}
          {eventos.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhum evento registrado.</div>
          ) : (
            eventos.map(ev => (
              <div key={ev.id} style={{ padding: '14px', borderBottom: '1px solid #222' }}>
                {editingEvento === ev.id ? (
                  <form onSubmit={editarEvento}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <input style={{ ...inputStyle, flex: 1, minWidth: '200px' }} value={editETitulo} onChange={e => setEditETitulo(e.target.value)} required />
                      <input type="date" style={inputStyle} value={editEData} onChange={e => setEditEData(e.target.value)} required />
                    </div>
                    <textarea style={{ ...inputStyle, width: '100%', minHeight: '50px', resize: 'vertical', marginBottom: '8px' }} value={editETexto} onChange={e => setEditETexto(e.target.value)} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="lcars-btn teal" style={{ fontSize: '0.7rem', padding: '4px 12px', border: 'none', cursor: 'pointer' }}>Salvar</button>
                      <button type="button" onClick={() => setEditingEvento(null)} className="lcars-btn" style={{ fontSize: '0.7rem', padding: '4px 12px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ color: divInfo?.cor }}>{ev.titulo}</strong>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--lcars-sky)' }}>{ev.data}</span>
                        <button onClick={() => startEditEvento(ev)} className="lcars-btn blue" style={{ fontSize: '0.6rem', padding: '2px 8px', border: 'none', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => excluirEvento(ev.id)} className="lcars-btn red" style={{ fontSize: '0.6rem', padding: '2px 8px', border: 'none', cursor: 'pointer' }}>Excluir</button>
                      </div>
                    </div>
                    {ev.texto && <p style={{ color: 'var(--lcars-text-light)', fontSize: '0.85rem', lineHeight: '1.5' }}>{ev.texto}</p>}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== CONFIRM DELETE DEPARTAMENTO ===== */}
      {confirmDeleteDep && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div className="lcars-panel" style={{ borderColor: 'var(--lcars-red)', maxWidth: '400px', width: '90%' }}>
            <div className="lcars-panel-header red">Confirmar Exclusao</div>
            <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '8px' }}>Excluir este departamento permanentemente?</p>
              <p style={{ color: 'var(--lcars-blue)', fontWeight: 700, marginBottom: '20px' }}>
                {departamentos.find(d => d.id === confirmDeleteDep)?.nome}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setConfirmDeleteDep(null)} className="lcars-btn" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>Cancelar</button>
                <button onClick={confirmarDeleteDep} className="lcars-btn red" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
