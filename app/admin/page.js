'use client';

// ============================================
// ADMIN — Painel do Almirantado
// Acesso nivel 10 — Apenas pessoal autorizado
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [userSlugs, setUserSlugs] = useState([]);

  // User creation form
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newLogin, setNewLogin] = useState('');
  const [newSenha, setNewSenha] = useState('');
  const [newFichaSlug, setNewFichaSlug] = useState('');
  const [userMsg, setUserMsg] = useState('');

  // User management
  const [showUserManage, setShowUserManage] = useState(false);
  const [usersData, setUsersData] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editSenha, setEditSenha] = useState('');
  const [manageMsg, setManageMsg] = useState('');

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetch('/api/fichas').then(r => r.json()).then(data => {
      setFichas(data);
      setLoading(false);
    });
    // Fetch users to detect which fichas have accounts
    fetch('/api/users').then(r => {
      if (r.ok) return r.json();
      return {};
    }).then(data => {
      setUsersData(data);
      const slugs = Object.values(data).map(u => u.fichaSlug).filter(Boolean);
      setUserSlugs(slugs);
    }).catch(() => {});
  }, []);

  // Auth guard
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



  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/fichas/${deleteTarget}`, { method: 'DELETE' });
      if (res.ok) {
        setFichas(prev => prev.filter(f => f.slug !== deleteTarget));
      } else {
        const data = await res.json();
        alert(`Erro ao excluir: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      alert(`Erro de conexão: ${err.message}`);
    }
    setDeleteTarget(null);
  }

  async function createUser(e) {
    e.preventDefault();
    setUserMsg('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: newLogin, senha: newSenha, fichaSlug: newFichaSlug }),
    });
    const data = await res.json();
    if (res.ok) {
      setUserMsg(`Usuario "${newLogin}" criado com sucesso!`);
      setNewLogin(''); setNewSenha(''); setNewFichaSlug('');
      // Refresh users list
      refreshUsers();
    } else {
      setUserMsg(`Erro: ${data.error}`);
    }
  }

  async function refreshUsers() {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsersData(data);
      setUserSlugs(Object.values(data).map(u => u.fichaSlug).filter(Boolean));
    }
  }

  async function changePassword(login) {
    if (!editSenha.trim()) return;
    setManageMsg('');
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, novaSenha: editSenha }),
    });
    const data = await res.json();
    if (res.ok) {
      setManageMsg(`Senha de "${login}" alterada com sucesso!`);
      setEditingUser(null); setEditSenha('');
    } else {
      setManageMsg(`Erro: ${data.error}`);
    }
  }

  async function deleteUser(login) {
    if (!confirm(`Remover o acesso do usuario "${login}"?`)) return;
    setManageMsg('');
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login }),
    });
    const data = await res.json();
    if (res.ok) {
      setManageMsg(`Acesso de "${login}" removido.`);
      refreshUsers();
    } else {
      setManageMsg(`Erro: ${data.error}`);
    }
  }

  const inputStyle = {
    padding: '8px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
    fontFamily: 'var(--font-lcars)', fontSize: '0.85rem',
  };

  return (
    <div>
      <div className="lcars-hero">
        <h1>Painel do Almirantado</h1>
        <div className="subtitle">Gerenciamento de Fichas de Servico</div>
      </div>

      <div className="lcars-bar gradient" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => { setShowUserManage(!showUserManage); setShowCreateUser(false); }}
          className="lcars-btn sky" style={{ fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
          {showUserManage ? '✕ Fechar' : '🔒 Gerenciar Acessos'}
        </button>
        <button onClick={() => { setShowCreateUser(!showCreateUser); setShowUserManage(false); }}
          className="lcars-btn lavender" style={{ fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
          {showCreateUser ? '✕ Fechar' : '👤 Criar Acesso Tripulante'}
        </button>
        <Link href="/admin/fichas/nova" className="lcars-btn teal" style={{ fontSize: '0.85rem' }}>
          + Nova Ficha de Servico
        </Link>
      </div>

      {/* Manage Users Panel */}
      {showUserManage && (
        <div className="lcars-panel" style={{ marginBottom: '16px' }}>
          <div className="lcars-panel-header sky">Gerenciar Acessos — Tripulantes com Login</div>
          <div className="lcars-panel-body">
            {manageMsg && (
              <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: manageMsg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)' }}>
                {manageMsg}
              </div>
            )}
            {Object.keys(usersData).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)' }}>Nenhum usuario cadastrado.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="lcars-table">
                  <thead>
                    <tr>
                      <th>Login</th>
                      <th>Tipo</th>
                      <th>Ficha Vinculada</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(usersData).map(([login, u]) => {
                      const fichaName = fichas.find(f => f.slug === u.fichaSlug)?.nome || u.fichaSlug || '—';
                      return (
                        <tr key={login}>
                          <td style={{ color: 'var(--lcars-orange)', fontWeight: 600 }}>{login}</td>
                          <td>
                            <span className={`lcars-badge ${u.role === 'admin' ? 'red' : 'blue'}`} style={{ fontSize: '0.6rem' }}>
                              {u.role === 'admin' ? 'ADMIN' : 'TRIPULANTE'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--lcars-text-light)', fontSize: '0.85rem' }}>{fichaName}</td>
                          <td>
                            {u.role === 'admin' ? (
                              <span style={{ color: '#555', fontSize: '0.7rem' }}>Protegido</span>
                            ) : editingUser === login ? (
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={editSenha}
                                  onChange={e => setEditSenha(e.target.value)}
                                  placeholder="Nova senha"
                                  style={{
                                    ...inputStyle, width: '140px', fontSize: '0.75rem', padding: '4px 8px',
                                  }}
                                />
                                <button onClick={() => changePassword(login)}
                                  className="lcars-btn teal" style={{ fontSize: '0.6rem', padding: '3px 8px', border: 'none', cursor: 'pointer' }}>
                                  Salvar
                                </button>
                                <button onClick={() => { setEditingUser(null); setEditSenha(''); }}
                                  className="lcars-btn" style={{ fontSize: '0.6rem', padding: '3px 8px', border: 'none', cursor: 'pointer' }}>
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => { setEditingUser(login); setEditSenha(''); }}
                                  className="lcars-btn blue" style={{ fontSize: '0.6rem', padding: '3px 10px', border: 'none', cursor: 'pointer' }}>
                                  Alterar Senha
                                </button>
                                <button onClick={() => deleteUser(login)}
                                  className="lcars-btn red" style={{ fontSize: '0.6rem', padding: '3px 10px', border: 'none', cursor: 'pointer' }}>
                                  Excluir
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create User Form */}
      {showCreateUser && (
        <div className="lcars-panel" style={{ marginBottom: '16px' }}>
          <div className="lcars-panel-header lavender">Criar Acesso para Tripulante</div>
          <div className="lcars-panel-body">
            <form onSubmit={createUser}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Login</label>
                  <input style={inputStyle} value={newLogin} onChange={e => setNewLogin(e.target.value)} placeholder="ex: elemer" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Senha</label>
                  <input style={inputStyle} value={newSenha} onChange={e => setNewSenha(e.target.value)} placeholder="senha" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Ficha (slug)</label>
                  <select style={inputStyle} value={newFichaSlug} onChange={e => setNewFichaSlug(e.target.value)}>
                    <option value="">Selecionar ficha...</option>
                    {fichas.map(f => <option key={f.slug} value={f.slug}>{f.nome}</option>)}
                  </select>
                </div>
                <button type="submit" className="lcars-btn lavender" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Criar</button>
              </div>
              {userMsg && <div style={{ marginTop: '10px', fontSize: '0.85rem', color: userMsg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)' }}>{userMsg}</div>}
            </form>
          </div>
        </div>
      )}

      {/* Filtro de busca */}
      <div className="lcars-form-group" style={{ marginBottom: '16px' }}>
        <label>Localizar Ficha</label>
        <input
          type="text"
          placeholder="Digite o nome do oficial..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ maxWidth: '500px' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--lcars-text-dim)' }}>
          Carregando registros...
        </div>
      ) : fichas.length === 0 ? (
        <div className="lcars-panel">
          <div className="lcars-panel-header">Nenhum Registro</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--lcars-text-dim)' }}>
              Nenhuma ficha de servico cadastrada. Clique em &quot;Nova Ficha&quot; para adicionar.
            </p>
          </div>
        </div>
      ) : (() => {
        const fichasFiltradas = fichas.filter(f =>
          f.nome.toLowerCase().includes(filtro.toLowerCase())
        );
        return (
        <div className="lcars-panel">
          <div className="lcars-panel-header lavender">
            {fichasFiltradas.length} de {fichas.length} Fichas{filtro ? ` — Filtro: "${filtro}"` : ''}
          </div>
          <div className="lcars-panel-body" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="lcars-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Patente</th>
                  <th>Divisao</th>
                  <th>Admissao</th>
                  <th>Acesso</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {fichasFiltradas.map((f, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--orange)', fontWeight: 600 }}>
                      {f.nome}
                    </td>
                    <td><span className="lcars-badge orange">{f.patente || 'N/A'}</span></td>
                    <td>{f.divisao || 'N/A'}</td>
                    <td style={{ color: 'var(--gray)' }}>{f.admissao || 'N/A'}</td>
                    <td>
                      {userSlugs.includes(f.slug) ? (
                        <span className="lcars-badge green" style={{ fontSize: '0.6rem' }}>ATIVO</span>
                      ) : (
                        <span style={{ color: '#555', fontSize: '0.7rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/tripulacao/${f.slug}`} className="lcars-btn blue" style={{ fontSize: '0.7rem', padding: '4px 12px' }}>
                          Ver
                        </Link>
                        <Link href={`/admin/fichas/${f.slug}`} className="lcars-btn" style={{ fontSize: '0.7rem', padding: '4px 12px' }}>
                          Editar
                        </Link>
                        <button onClick={() => setDeleteTarget(f.slug)}
                          className="lcars-btn red" style={{ fontSize: '0.7rem', padding: '4px 12px', cursor: 'pointer', border: 'none' }}>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div className="lcars-panel" style={{ borderColor: 'var(--lcars-red)', maxWidth: '450px', width: '90%' }}>
            <div className="lcars-panel-header red">Confirmar Exclusao</div>
            <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '8px', fontSize: '0.95rem' }}>
                Tem certeza que deseja remover esta ficha?
              </p>
              <p style={{ color: 'var(--lcars-orange)', fontWeight: 700, fontSize: '1rem', marginBottom: '20px' }}>
                {deleteTarget}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setDeleteTarget(null)}
                  className="lcars-btn" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>
                  Cancelar
                </button>
                <button onClick={confirmDelete}
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
