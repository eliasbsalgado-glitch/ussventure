'use client';

// ============================================
// LOGIN — Autenticacao do Sistema LCARS
// Nivel de acesso: Publico
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { user, login, logout } = useAuth();
  const [loginName, setLoginName] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(loginName, senha);
    if (result.ok) {
      router.push(result.role === 'admin' ? '/admin' : '/meu-diario');
    } else {
      setError(result.error || 'Erro no login');
    }
    setLoading(false);
  }

  if (user?.logged) {
    return (
      <div>
        <div className="lcars-hero">
          <h1>Sessao Ativa</h1>
          <div className="subtitle">Bem-vindo, {user.login}</div>
        </div>
        <div className="lcars-bar gradient" />
        <div className="lcars-panel">
          <div className="lcars-panel-header">Status da Sessao</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ marginBottom: '12px' }}>
              Autenticado como <strong style={{ color: 'var(--lcars-orange)' }}>{user.login}</strong>
              {' '}— Perfil: <span className="lcars-badge orange">{user.role === 'admin' ? 'ADMINISTRADOR' : 'TRIPULANTE'}</span>
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {user.role === 'admin' && (
                <Link href="/admin" className="lcars-btn blue">Painel Admin</Link>
              )}
              {user.fichaSlug && (
                <Link href="/meu-diario" className="lcars-btn sky">Meu Diario de Bordo</Link>
              )}
              <button onClick={logout} className="lcars-btn red" style={{ border: 'none', cursor: 'pointer' }}>
                Encerrar Sessao
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="lcars-hero">
        <h1>Autenticacao</h1>
        <div className="subtitle">Acesso ao Sistema LCARS</div>
      </div>

      <div className="lcars-bar gradient" />

      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        <div className="lcars-panel">
          <div className="lcars-panel-header orange">Identificacao Requerida</div>
          <div className="lcars-panel-body">
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block', marginBottom: '4px', fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--lcars-text-dim)',
                }}>Login</label>
                <input
                  value={loginName} onChange={e => setLoginName(e.target.value)} required
                  placeholder="Digite seu login"
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
                    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
                    fontFamily: 'var(--font-lcars)', fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block', marginBottom: '4px', fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--lcars-text-dim)',
                }}>Senha</label>
                <input
                  type="password" value={senha} onChange={e => setSenha(e.target.value)} required
                  placeholder="Digite sua senha"
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
                    borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
                    fontFamily: 'var(--font-lcars)', fontSize: '1rem',
                  }}
                />
              </div>
              {error && (
                <div style={{
                  padding: '10px', marginBottom: '14px', background: 'rgba(204,102,102,0.15)',
                  border: '1px solid var(--lcars-red)', borderRadius: 'var(--lcars-radius-sm)',
                  color: 'var(--lcars-red)', fontSize: '0.85rem', textAlign: 'center',
                }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="lcars-btn orange"
                style={{
                  width: '100%', fontSize: '1rem', padding: '14px',
                  cursor: loading ? 'wait' : 'pointer', border: 'none',
                }}>
                {loading ? 'Autenticando...' : 'Acessar Sistema'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
