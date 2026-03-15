'use client';

// ============================================
// AGENDA PANEL — Painel de agenda da divisao
// Chefes de divisao podem criar/editar/excluir eventos
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';

export default function AgendaPanel({ divisaoSlug, divisaoCor, divisaoNome }) {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [texto, setTexto] = useState('');
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editData, setEditData] = useState('');
  const [editTexto, setEditTexto] = useState('');

  useEffect(() => {
    fetch('/api/agenda').then(r => r.json()).then(all => {
      const divEventos = all.filter(e => e.divisao === divisaoSlug);
      divEventos.sort((a, b) => a.data.localeCompare(b.data));
      setEventos(divEventos);
    }).catch(() => {});
  }, [divisaoSlug]);

  // Verificar se o usuario e chefe desta divisao ou admin
  const canManage = user?.logged && (user.role === 'admin' || user.fichaSlug);

  async function createEvento(e) {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ divisao: divisaoSlug, titulo, data, texto }),
    });
    const result = await res.json();
    if (res.ok) {
      setEventos(prev => [...prev, result.evento].sort((a, b) => a.data.localeCompare(b.data)));
      setTitulo(''); setData(new Date().toISOString().split('T')[0]); setTexto('');
      setShowForm(false);
      setMsg('Evento adicionado!');
    } else {
      setMsg(`Erro: ${result.error}`);
    }
  }

  async function deleteEvento(id) {
    if (!confirm('Remover este evento da agenda?')) return;
    const res = await fetch('/api/agenda', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setEventos(prev => prev.filter(e => e.id !== id));
      setMsg('Evento removido.');
    }
  }

  function startEdit(ev) {
    setEditingId(ev.id);
    setEditTitulo(ev.titulo);
    setEditData(ev.data);
    setEditTexto(ev.texto);
  }

  async function saveEdit(e) {
    e.preventDefault();
    const res = await fetch('/api/agenda', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, titulo: editTitulo, data: editData, texto: editTexto }),
    });
    const result = await res.json();
    if (res.ok) {
      setEventos(prev => prev.map(ev => ev.id === editingId ? { ...ev, ...result.evento } : ev)
        .sort((a, b) => a.data.localeCompare(b.data)));
      setEditingId(null);
      setMsg('Evento atualizado!');
    } else {
      setMsg(`Erro: ${result.error}`);
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.4)',
    border: '1px solid #555', borderRadius: 'var(--lcars-radius-sm)',
    color: 'var(--lcars-peach)', fontFamily: 'var(--font-lcars)', fontSize: '0.85rem',
  };

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="lcars-panel" style={{ marginTop: '20px', borderColor: divisaoCor }}>
      <div className="lcars-panel-header" style={{ background: divisaoCor, color: '#000' }}>
        Agenda — {divisaoNome}
      </div>
      <div className="lcars-panel-body">
        {canManage && (
          <div style={{ marginBottom: '12px' }}>
            <button onClick={() => setShowForm(!showForm)}
              className="lcars-btn" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem', background: divisaoCor, color: '#000' }}>
              {showForm ? '✕ Cancelar' : '📅 Adicionar Evento'}
            </button>
          </div>
        )}

        {msg && (
          <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: msg.includes('Erro') ? 'var(--lcars-red)' : 'var(--lcars-teal)' }}>
            {msg}
          </div>
        )}

        {showForm && (
          <form onSubmit={createEvento} style={{
            padding: '14px', background: 'rgba(0,0,0,0.2)',
            border: `1px solid ${divisaoCor}33`, borderRadius: 'var(--lcars-radius-sm)', marginBottom: '16px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Titulo</label>
                <input style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Treinamento de Cadetes" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Data</label>
                <input style={{ ...inputStyle, width: '170px' }} type="date" value={data} onChange={e => setData(e.target.value)} required />
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--lcars-text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Descricao</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={texto} onChange={e => setTexto(e.target.value)} placeholder="Detalhes do evento..." />
            </div>
            <button type="submit" className="lcars-btn" style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem', background: divisaoCor, color: '#000' }}>
              Adicionar
            </button>
          </form>
        )}

        {eventos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--lcars-text-dim)', fontSize: '0.85rem' }}>
            Nenhum evento agendado.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {eventos.map(ev => {
              const isPast = ev.data < hoje;
              return (
                <div key={ev.id}>
                  {editingId === ev.id ? (
                    <form onSubmit={saveEdit} style={{
                      padding: '12px', background: 'rgba(0,0,0,0.2)',
                      border: `1px solid ${divisaoCor}33`, borderRadius: 'var(--lcars-radius-sm)',
                    }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <input style={{ ...inputStyle, flex: 1 }} value={editTitulo} onChange={e => setEditTitulo(e.target.value)} required />
                        <input style={{ ...inputStyle, width: '170px' }} type="date" value={editData} onChange={e => setEditData(e.target.value)} required />
                      </div>
                      <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '50px', marginBottom: '8px' }} value={editTexto} onChange={e => setEditTexto(e.target.value)} />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="submit" className="lcars-btn teal" style={{ fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}>Salvar</button>
                        <button type="button" onClick={() => setEditingId(null)} className="lcars-btn" style={{ fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 14px', background: isPast ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.3)',
                      borderRadius: 'var(--lcars-radius-sm)', borderLeft: `4px solid ${divisaoCor}`,
                      opacity: isPast ? 0.5 : 1,
                    }}>
                      <div style={{
                        fontSize: '0.75rem', fontWeight: 700, color: divisaoCor,
                        whiteSpace: 'nowrap', minWidth: '80px',
                      }}>
                        {ev.data.split('-').reverse().join('/')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lcars-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {ev.titulo}
                        </div>
                        {ev.texto && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--lcars-text-dim)', marginTop: '2px' }}>
                            {ev.texto}
                          </div>
                        )}
                      </div>
                      {isPast && (
                        <span style={{ fontSize: '0.6rem', color: '#666', textTransform: 'uppercase' }}>Encerrado</span>
                      )}
                      {canManage && (
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <button onClick={() => startEdit(ev)}
                            className="lcars-btn blue" style={{ fontSize: '0.55rem', padding: '2px 8px', border: 'none', cursor: 'pointer' }}>
                            Editar
                          </button>
                          <button onClick={() => deleteEvento(ev.id)}
                            className="lcars-btn red" style={{ fontSize: '0.55rem', padding: '2px 8px', border: 'none', cursor: 'pointer' }}>
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
