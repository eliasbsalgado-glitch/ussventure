'use client';

// ============================================
// CHEFE DE DIVISÃO — Painel Gerenciar Divisão
// Nivel de acesso: Chefe de Divisao
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

const DIVISAO_INFO = {
  'comando': { nome: 'Comando', cor: '#CC6666', desc: 'Oficiais mais graduados do Grupo USS Venture.' },
  'academia': { nome: 'Academia', cor: '#999999', desc: 'Tripulantes em treinamento ou reciclagem.' },
  'ciencias': { nome: 'Ciencias', cor: '#6688CC', desc: 'Responsavel por experimentos cientificos, pesquisa e astronomia.' },
  'comunicacoes': { nome: 'Comunicacoes', cor: '#66CC66', desc: 'Presenca do Grupo nos meios de comunicacao.' },
  'engenharia': { nome: 'Engenharia', cor: '#FFAA00', desc: 'Construtores e criadores do Grupo.' },
  'operacoes': { nome: 'Operacoes', cor: '#FFAA00', desc: 'Operacoes do dia-a-dia, eventos, treinamentos.' },
  'tatico': { nome: 'Tatico', cor: '#CC6666', desc: 'Taticas de combate e defesa.' },
};

export default function ChefeDivisaoPage() {
  const { user, loading: authLoading } = useAuth();
  const [membros, setMembros] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Evento form
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [eventoTitulo, setEventoTitulo] = useState('');
  const [eventoData, setEventoData] = useState(new Date().toISOString().split('T')[0]);
  const [eventoTexto, setEventoTexto] = useState('');

  // Edit
  const [editingEvento, setEditingEvento] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editData, setEditData] = useState('');
  const [editTexto, setEditTexto] = useState('');

  const divisaoSlug = user?.divisaoSlug;
  const divInfo = divisaoSlug ? DIVISAO_INFO[divisaoSlug] : null;

  useEffect(() => {
    if (!divisaoSlug) return;
    Promise.all([
      fetch(`/api/fichas?divisao=${divisaoSlug}`).then(r => r.json()),
      fetch('/api/agenda').then(r => r.json()),
    ]).then(([fichasList, eventosAll]) => {
      setMembros(fichasList);
      setEventos(eventosAll.filter(e => e.divisao === divisaoSlug));
      setLoading(false);
    }).catch(() => setLoading(false));
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
            <p style={{ color: 'var(--lcars-text-dim)', marginBottom: '14px' }}>
              Apenas chefes de divisao podem acessar este painel.
            </p>
            <Link href="/login" className="lcars-btn orange">Fazer Login</Link>
          </div>
        </div>
      </div>
    );
  }

  async function criarEvento(e) {
    e.preventDefault();
    if (!eventoTitulo.trim() || !eventoData) return;
    setMsg('');
    const res = await fetch('/api/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        divisao: divisaoSlug,
        titulo: eventoTitulo,
        data: eventoData,
        texto: eventoTexto,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setMsg('Evento criado com sucesso!');
      setEventoTitulo('');
      setEventoData(new Date().toISOString().split('T')[0]);
      setEventoTexto('');
      setShowEventoForm(false);
      setEventos(prev => [...prev, data.evento]);
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
  }

  async function editarEvento(e) {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/agenda', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingEvento,
        titulo: editTitulo,
        data: editData,
        texto: editTexto,
      }),
    });
    if (res.ok) {
      setMsg('Evento atualizado!');
      setEditingEvento(null);
      // Refresh
      const eventosAll = await fetch('/api/agenda').then(r => r.json());
      setEventos(eventosAll.filter(ev => ev.divisao === divisaoSlug));
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
  }

  async function excluirEvento(id) {
    if (!confirm('Excluir este evento?')) return;
    const res = await fetch('/api/agenda', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setEventos(prev => prev.filter(ev => ev.id !== id));
      setMsg('Evento excluido.');
    } else {
      const data = await res.json();
      setMsg(`Erro: ${data.error}`);
    }
  }

  function startEdit(evento) {
    setEditingEvento(evento.id);
    setEditTitulo(evento.titulo);
    setEditData(evento.data);
    setEditTexto(evento.texto || '');
  }

  const inputStyle = {
    padding: '8px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
    fontFamily: 'var(--font-lcars)', fontSize: '0.85rem',
  };

  return (
    <div>
      <div className="lcars-hero">
        <h1>Gerenciar Divisao</h1>
        <div className="subtitle" style={{ color: divInfo?.cor }}>{divInfo?.nome || divisaoSlug}</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Info da Divisao */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header" style={{ background: divInfo?.cor }}>Dados da Divisao</div>
        <div className="lcars-panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
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
          </div>
          {divInfo?.desc && (
            <p style={{ marginTop: '12px', color: 'var(--lcars-text-light)', fontSize: '0.85rem' }}>{divInfo.desc}</p>
          )}
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

      {/* Membros */}
      <div className="lcars-panel" style={{ marginBottom: '16px' }}>
        <div className="lcars-panel-header sky">Membros — {membros.length}</div>
        <div className="lcars-panel-body" style={{ padding: loading ? '30px' : 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Carregando...</div>
          ) : membros.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhum membro nesta divisao.</div>
          ) : (
            <table className="lcars-table">
              <thead>
                <tr><th>Nome</th><th>Patente</th></tr>
              </thead>
              <tbody>
                {membros.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <Link href={`/tripulacao/${m.slug}`} style={{ color: 'var(--lcars-orange)', textDecoration: 'none', fontWeight: 600 }}>
                        {m.nome}
                      </Link>
                    </td>
                    <td><span className="lcars-badge orange" style={{ fontSize: '0.6rem' }}>{m.patente || 'N/A'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Eventos */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: divInfo?.cor }}>
          Eventos — {eventos.length}
          <button onClick={() => { setShowEventoForm(!showEventoForm); setEditingEvento(null); }}
            style={{ float: 'right', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
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
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Nenhum evento registrado para esta divisao.</div>
          ) : (
            eventos.map(ev => (
              <div key={ev.id} style={{ padding: '14px', borderBottom: '1px solid #222' }}>
                {editingEvento === ev.id ? (
                  <form onSubmit={editarEvento}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <input style={{ ...inputStyle, flex: 1, minWidth: '200px' }} value={editTitulo} onChange={e => setEditTitulo(e.target.value)} required />
                      <input type="date" style={inputStyle} value={editData} onChange={e => setEditData(e.target.value)} required />
                    </div>
                    <textarea style={{ ...inputStyle, width: '100%', minHeight: '50px', resize: 'vertical', marginBottom: '8px' }} value={editTexto} onChange={e => setEditTexto(e.target.value)} />
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
                        <button onClick={() => startEdit(ev)} className="lcars-btn blue" style={{ fontSize: '0.6rem', padding: '2px 8px', border: 'none', cursor: 'pointer' }}>Editar</button>
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
    </div>
  );
}
