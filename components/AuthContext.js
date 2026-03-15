'use client';

// ============================================
// AUTH CONTEXT — Gerenciamento de sessao
// Nivel de acesso: Federacao
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'me' }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.logged) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function login(loginName, senha) {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', login: loginName, senha }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser({ logged: true, ...data });
      return { ok: true };
    }
    return { ok: false, error: data.error };
  }

  async function logout() {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
