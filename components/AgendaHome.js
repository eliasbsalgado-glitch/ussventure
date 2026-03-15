'use client';

// ============================================
// AGENDA HOME — Proximos eventos na Ponte
// ============================================

import { useState, useEffect } from 'react';

export default function AgendaHome() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agenda').then(r => r.json()).then(data => {
      const hoje = new Date().toISOString().split('T')[0];
      // Filtrar apenas eventos futuros ou de hoje, ordenar por data
      const futuros = (data || [])
        .filter(e => e.data >= hoje)
        .sort((a, b) => a.data.localeCompare(b.data))
        .slice(0, 8); // Maximo 8
      setEventos(futuros);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (eventos.length === 0) return null;

  return (
    <div className="lcars-panel" style={{ marginTop: '20px' }}>
      <div className="lcars-panel-header" style={{ background: 'var(--lcars-sky)', color: '#000' }}>
        Agenda da Frota — Proximos Eventos
      </div>
      <div className="lcars-panel-body" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {eventos.map(ev => (
            <div key={ev.id} style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
              padding: '8px 12px', background: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--lcars-radius-sm)',
              borderLeft: `4px solid ${ev.divisaoCor || 'var(--lcars-sky)'}`,
            }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, color: ev.divisaoCor || '#888',
                whiteSpace: 'nowrap',
              }}>
                {ev.data.split('-').reverse().join('/')}
              </div>
              <span style={{
                padding: '1px 8px', borderRadius: '10px', fontSize: '0.55rem',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                background: ev.divisaoCor || '#888', color: '#000',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {ev.divisaoNome}
              </span>
              <div style={{ flexBasis: '100%', minWidth: 0 }}>
                <div style={{
                  fontSize: '0.8rem', fontWeight: 600, color: 'var(--lcars-text)',
                  textTransform: 'uppercase', letterSpacing: '1px',
                  overflowWrap: 'break-word', wordWrap: 'break-word',
                }}>
                  {ev.titulo}
                </div>
                {ev.texto && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--lcars-text-dim)', marginTop: '1px',
                    overflowWrap: 'break-word', wordWrap: 'break-word',
                  }}>
                    {ev.texto}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
