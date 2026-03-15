'use client';

// ============================================
// MEU DIARIO DE BORDO — Area do tripulante
// Nivel de acesso: Tripulante autenticado
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

export default function MeuDiarioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [publico, setPublico] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.fichaSlug) return;
    fetch(`/api/diarios?slug=${user.fichaSlug}`)
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  // Admin sem ficha de tripulante: redireciona para /admin
  useEffect(() => {
    if (!authLoading && user?.logged && user.role === 'admin' && !user.fichaSlug) {
      router.replace('/admin');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Carregando...</div>;
  }

  // Admin sem ficha já está sendo redirecionado
  if (user?.logged && user.role === 'admin' && !user.fichaSlug) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lcars-text-dim)' }}>Redirecionando para o painel administrativo...</div>;
  }

  if (!user?.logged || !user.fichaSlug) {
    return (
      <div>
        <div className="lcars-hero">
          <h1>Acesso Restrito</h1>
          <div className="subtitle">Autenticacao necessaria</div>
        </div>
        <div className="lcars-bar gradient" />
        <div className="lcars-panel">
          <div className="lcars-panel-header red">Acesso Negado</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ color: 'var(--lcars-text-dim)', marginBottom: '14px' }}>
              Voce precisa estar autenticado como tripulante para acessar seu diario de bordo.
            </p>
            <Link href="/login" className="lcars-btn orange">Fazer Login</Link>
          </div>
        </div>
      </div>
    );
  }

  async function addEntry(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setSaving(true);
    const res = await fetch('/api/diarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto, data, publico }),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries([entry, ...entries]);
      setTexto('');
      setData(new Date().toISOString().split('T')[0]);
    }
    setSaving(false);
  }

  async function confirmDeleteEntry() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/diarios?id=${deleteTarget}&slug=${user.fichaSlug}`, { method: 'DELETE' });
      setEntries(prev => prev.filter(e => e.id !== deleteTarget));
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
    setDeleteTarget(null);
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
    fontFamily: 'var(--font-lcars)', fontSize: '0.9rem',
  };

  return (
    <div>
      <div className="lcars-hero">
        <h1>Diario de Bordo</h1>
        <div className="subtitle">Registros pessoais — {user.login}</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Nova entrada */}
      <div className="lcars-panel">
        <div className="lcars-panel-header sky">Nova Entrada</div>
        <div className="lcars-panel-body">
          <form onSubmit={addEntry}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--lcars-text-dim)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Data Estelar
                </label>
                <input type="date" value={data} onChange={e => setData(e.target.value)}
                  style={{ ...inputStyle, width: '160px' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  padding: '10px 14px', borderRadius: 'var(--lcars-radius-sm)',
                  background: publico ? 'rgba(102,204,153,0.15)' : 'rgba(204,102,102,0.15)',
                  border: publico ? '1px solid var(--lcars-teal)' : '1px solid var(--lcars-red)',
                  fontSize: '0.8rem', color: publico ? 'var(--lcars-teal)' : 'var(--lcars-red)',
                  transition: 'all 0.2s',
                }}>
                  <input type="checkbox" checked={publico} onChange={e => setPublico(e.target.checked)}
                    style={{ accentColor: 'var(--lcars-teal)' }}
                  />
                  {publico ? '🌐 PUBLICO' : '🔒 PRIVADO'}
                </label>
              </div>
            </div>
            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', marginBottom: '12px' }}
              value={texto} onChange={e => setTexto(e.target.value)}
              placeholder="Registre sua entrada no diario de bordo..."
              required
            />
            <button type="submit" disabled={saving} className="lcars-btn sky"
              style={{ border: 'none', cursor: saving ? 'wait' : 'pointer' }}>
              {saving ? 'Registrando...' : 'Registrar Entrada'}
            </button>
          </form>
        </div>
      </div>

      {/* Lista de entradas */}
      <div className="lcars-panel">
        <div className="lcars-panel-header lavender">
          {entries.length} Entradas no Diario
        </div>
        <div className="lcars-panel-body" style={{ padding: loading ? '30px' : 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--lcars-text-dim)' }}>Carregando registros...</div>
          ) : entries.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--lcars-text-dim)' }}>
              Nenhuma entrada registrada. Escreva sua primeira entrada acima.
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.id} style={{
                padding: '16px', borderBottom: '1px solid #222',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.8rem', color: 'var(--lcars-sky)',
                      fontFamily: 'var(--font-lcars)', letterSpacing: '1px',
                    }}>
                      {e.data}
                    </span>
                    <span style={{
                      fontSize: '0.6rem', padding: '2px 8px',
                      borderRadius: '4px',
                      background: e.publico ? 'rgba(102,204,153,0.15)' : 'rgba(204,102,102,0.15)',
                      color: e.publico ? 'var(--lcars-teal)' : 'var(--lcars-red)',
                      border: e.publico ? '1px solid var(--lcars-teal)' : '1px solid var(--lcars-red)',
                    }}>
                      {e.publico ? '🌐 PUBLICO' : '🔒 PRIVADO'}
                    </span>
                  </div>
                  <button onClick={() => setDeleteTarget(e.id)}
                    style={{
                      background: 'transparent', border: 'none', color: '#666',
                      cursor: 'pointer', fontSize: '0.8rem',
                    }}
                    title="Excluir entrada"
                  >
                    ✕
                  </button>
                </div>
                <p style={{ color: 'var(--lcars-peach)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {e.texto}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div className="lcars-panel" style={{ borderColor: 'var(--lcars-red)', maxWidth: '400px', width: '90%' }}>
            <div className="lcars-panel-header red">Confirmar Exclusao</div>
            <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: 'var(--lcars-text-light)', marginBottom: '20px' }}>
                Deseja excluir esta entrada do diario de bordo?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setDeleteTarget(null)}
                  className="lcars-btn" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>
                  Cancelar
                </button>
                <button onClick={confirmDeleteEntry}
                  className="lcars-btn red" style={{ fontSize: '0.85rem', padding: '8px 24px', cursor: 'pointer', border: 'none' }}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
