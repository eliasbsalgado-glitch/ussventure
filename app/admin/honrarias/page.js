'use client';

// ============================================
// ADMIN — Gerenciar Honrarias / Condecoracoes
// Nivel de acesso: Admin
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

const CATEGORIAS = [
  { key: 'academia', label: 'Academia', cor: 'var(--lcars-teal)' },
  { key: 'merito', label: 'Medalhas de Merito', cor: 'var(--lcars-orange)' },
  { key: 'tecnicas', label: 'Tecnicas e Desenvolvimento', cor: 'var(--lcars-blue)' },
  { key: 'tempo_servico', label: 'Tempo de Servico', cor: 'var(--lcars-lavender)' },
  { key: 'outros', label: 'Outros', cor: 'var(--lcars-sky)' },
];

export default function AdminHonrariasPage() {
  const { user, loading: authLoading } = useAuth();
  const [honrarias, setHonrarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newCategoria, setNewCategoria] = useState('academia');
  const [newNome, setNewNome] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImagem, setNewImagem] = useState('');

  // Edit form
  const [editingId, setEditingId] = useState(null);
  const [editCategoria, setEditCategoria] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImagem, setEditImagem] = useState('');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetch('/api/honrarias').then(r => r.json())
      .then(data => { setHonrarias(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Verificando autorizacao...</div>;
  }

  if (!user?.logged || user.role !== 'admin') {
    return (
      <div>
        <div className="lcars-hero">
          <h1>Acesso Restrito</h1>
          <div className="subtitle">Autenticacao de nivel administrativo necessaria</div>
        </div>
        <div className="lcars-bar gradient" />
        <div className="lcars-panel">
          <div className="lcars-panel-header red">Acesso Negado</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ color: 'var(--lcars-text-dim)', marginBottom: '14px' }}>
              Apenas administradores podem acessar este painel.
            </p>
            <Link href="/login" className="lcars-btn orange">Fazer Login</Link>
          </div>
        </div>
      </div>
    );
  }

  async function criar(e) {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/honrarias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria: newCategoria, nome: newNome, descricao: newDesc, imagem: newImagem }),
    });
    if (res.ok) {
      const data = await res.json();
      setMsg(`Honraria "${newNome}" criada com sucesso!`);
      setHonrarias(prev => [...prev, data.honraria]);
      setNewNome(''); setNewDesc(''); setNewImagem('');
      setShowCreate(false);
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
  }

  function startEdit(h) {
    setEditingId(h.id);
    setEditCategoria(h.categoria);
    setEditNome(h.nome);
    setEditDesc(h.descricao || '');
    setEditImagem(h.imagem || '');
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/honrarias', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, categoria: editCategoria, nome: editNome, descricao: editDesc, imagem: editImagem }),
    });
    if (res.ok) {
      setMsg('Honraria atualizada!');
      setHonrarias(prev => prev.map(h => h.id === editingId
        ? { ...h, categoria: editCategoria, nome: editNome, descricao: editDesc, imagem: editImagem }
        : h
      ));
      setEditingId(null);
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
  }

  async function confirmarExclusao() {
    if (!deleteTarget) return;
    const res = await fetch('/api/honrarias', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteTarget }),
    });
    if (res.ok) {
      setHonrarias(prev => prev.filter(h => h.id !== deleteTarget));
      setMsg('Honraria excluida.');
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
    setDeleteTarget(null);
  }

  const inputStyle = {
    padding: '8px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
    fontFamily: 'var(--font-lcars)', fontSize: '0.85rem', width: '100%',
  };

  // Group by category
  const grouped = {};
  CATEGORIAS.forEach(c => { grouped[c.key] = []; });
  honrarias.forEach(h => {
    if (!grouped[h.categoria]) grouped[h.categoria] = [];
    grouped[h.categoria].push(h);
  });

  return (
    <div>
      <div className="lcars-hero">
        <h1>Gerenciar Honrarias</h1>
        <div className="subtitle">Condecoracoes e Medalhas da Frota</div>
      </div>

      <div className="lcars-bar gradient" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/admin" className="lcars-btn" style={{ fontSize: '0.8rem' }}>← Voltar ao Painel Admin</Link>
        <button onClick={() => setShowCreate(!showCreate)}
          className="lcars-btn teal" style={{ fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
          {showCreate ? '✕ Fechar' : '+ Nova Honraria'}
        </button>
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

      {/* Create Form */}
      {showCreate && (
        <div className="lcars-panel" style={{ marginBottom: '16px' }}>
          <div className="lcars-panel-header teal">Nova Honraria</div>
          <div className="lcars-panel-body">
            <form onSubmit={criar}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Categoria</label>
                  <select style={inputStyle} value={newCategoria} onChange={e => setNewCategoria(e.target.value)}>
                    {CATEGORIAS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Nome da Medalha</label>
                  <input style={inputStyle} value={newNome} onChange={e => setNewNome(e.target.value)} required placeholder="Ex: Medalha de Honra" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>URL da Imagem</label>
                  <input style={inputStyle} value={newImagem} onChange={e => setNewImagem(e.target.value)} placeholder="/img/condecoracoes/medalha.jpg" />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Texto Explicativo</label>
                <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descricao da honraria..." />
              </div>
              <button type="submit" className="lcars-btn teal" style={{ border: 'none', cursor: 'pointer' }}>Criar Honraria</button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--lcars-text-dim)' }}>Carregando honrarias...</div>
      ) : (
        <>
          {CATEGORIAS.map(cat => {
            const items = grouped[cat.key] || [];
            if (items.length === 0 && !showCreate) return null;
            return (
              <div key={cat.key} className="lcars-panel" style={{ marginBottom: '16px' }}>
                <div className="lcars-panel-header" style={{ background: cat.cor, color: '#000' }}>
                  {cat.label} — {items.length} {items.length === 1 ? 'honraria' : 'honrarias'}
                </div>
                <div className="lcars-panel-body" style={{ padding: 0 }}>
                  {items.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhuma honraria nesta categoria.</div>
                  ) : (
                    <table className="lcars-table">
                      <thead>
                        <tr>
                          <th style={{ width: '60px' }}>Img</th>
                          <th>Nome</th>
                          <th>Descricao</th>
                          <th style={{ width: '120px' }}>Acoes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(h => (
                          <tr key={h.id}>
                            {editingId === h.id ? (
                              <td colSpan="4" style={{ padding: '12px' }}>
                                <form onSubmit={salvarEdicao}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                                    <div>
                                      <label style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)' }}>Categoria</label>
                                      <select style={{ ...inputStyle, fontSize: '0.75rem' }} value={editCategoria} onChange={e => setEditCategoria(e.target.value)}>
                                        {CATEGORIAS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                                      </select>
                                    </div>
                                    <div>
                                      <label style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)' }}>Nome</label>
                                      <input style={{ ...inputStyle, fontSize: '0.75rem' }} value={editNome} onChange={e => setEditNome(e.target.value)} required />
                                    </div>
                                    <div>
                                      <label style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)' }}>Imagem</label>
                                      <input style={{ ...inputStyle, fontSize: '0.75rem' }} value={editImagem} onChange={e => setEditImagem(e.target.value)} />
                                    </div>
                                  </div>
                                  <div style={{ marginBottom: '8px' }}>
                                    <label style={{ fontSize: '0.65rem', color: 'var(--lcars-text-dim)' }}>Descricao</label>
                                    <textarea style={{ ...inputStyle, fontSize: '0.75rem', minHeight: '40px', resize: 'vertical' }} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button type="submit" className="lcars-btn teal" style={{ fontSize: '0.7rem', padding: '4px 12px', border: 'none', cursor: 'pointer' }}>Salvar</button>
                                    <button type="button" onClick={() => setEditingId(null)} className="lcars-btn" style={{ fontSize: '0.7rem', padding: '4px 12px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                                  </div>
                                </form>
                              </td>
                            ) : (
                              <>
                                <td>
                                  {h.imagem ? (
                                    <img src={h.imagem} alt={h.nome} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
                                  ) : (
                                    <span style={{ color: '#555', fontSize: '0.7rem' }}>—</span>
                                  )}
                                </td>
                                <td style={{ color: cat.cor, fontWeight: 600, fontSize: '0.8rem' }}>{h.nome}</td>
                                <td style={{ color: 'var(--lcars-text-light)', fontSize: '0.75rem', maxWidth: '300px' }}>{h.descricao || '—'}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button onClick={() => startEdit(h)} className="lcars-btn blue" style={{ fontSize: '0.6rem', padding: '3px 8px', border: 'none', cursor: 'pointer' }}>Editar</button>
                                    <button onClick={() => setDeleteTarget(h.id)} className="lcars-btn red" style={{ fontSize: '0.6rem', padding: '3px 8px', border: 'none', cursor: 'pointer' }}>Excluir</button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
          })}

          <div style={{
            textAlign: 'center', padding: '16px', color: 'var(--lcars-text-dim)',
            fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase',
          }}>
            Total: {honrarias.length} honrarias registradas
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div className="lcars-panel" style={{ borderColor: 'var(--lcars-red)', maxWidth: '400px', width: '90%' }}>
            <div className="lcars-panel-header red">Confirmar Exclusao</div>
            <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '8px' }}>
                Excluir esta honraria permanentemente?
              </p>
              <p style={{ color: 'var(--lcars-orange)', fontWeight: 700, marginBottom: '20px' }}>
                {honrarias.find(h => h.id === deleteTarget)?.nome || deleteTarget}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setDeleteTarget(null)}
                  className="lcars-btn" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>
                  Cancelar
                </button>
                <button onClick={confirmarExclusao}
                  className="lcars-btn red" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>
                  Confirmar Exclusao
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
