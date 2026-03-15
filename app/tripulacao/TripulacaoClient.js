'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TripulacaoClient({ fichas }) {
  const [filtro, setFiltro] = useState('');

  const fichasFiltradas = fichas.filter((f) =>
    f.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      {/* Filtro de busca */}
      <div className="lcars-form-group" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <label>Localizar Oficial</label>
        <input
          type="text"
          placeholder="Digite o nome do oficial..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ maxWidth: '500px' }}
        />
      </div>

      {fichasFiltradas.length === 0 ? (
        <div className="lcars-panel">
          <div className="lcars-panel-header red">Sem Resultados</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--gray)' }}>
              Nenhum oficial encontrado para &quot;{filtro}&quot;
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {fichasFiltradas.map((f, i) => (
            <div key={i} className="lcars-card lcars-card-hover" style={{
              borderColor: f.patente === 'Almirante' ? 'var(--orange)' :
                f.patente === 'Capitao' ? 'var(--sky)' :
                f.patente === 'Comandante' ? 'var(--african-violet)' : 'var(--bluey)',
              cursor: 'pointer',
            }}>
              <div className="lcars-card-body" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {/* Foto mini */}
                <div style={{
                  width: '70px', height: '85px', borderRadius: 'var(--lcars-radius-sm)',
                  border: '1px solid #444', background: 'rgba(0,0,0,0.4)',
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  {f.foto ? (
                    <img src={f.foto} alt={f.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#555', fontSize: '0.6rem', textTransform: 'uppercase',
                    }}>
                      Sem Foto
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-lcars)', fontSize: '0.95rem', fontWeight: 700,
                    color: 'var(--orange)', textTransform: 'uppercase',
                    letterSpacing: '1px', marginBottom: '6px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {f.nome}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span className="lcars-badge orange" style={{ fontSize: '0.65rem' }}>{f.patente || 'N/A'}</span>
                    <span className="lcars-badge blue" style={{ fontSize: '0.65rem' }}>{f.divisao || 'N/A'}</span>
                  </div>
                  <Link href={`/tripulacao/${f.slug}`} className="lcars-btn sky"
                    style={{ fontSize: '0.7rem', padding: '4px 14px', display: 'inline-block' }}>
                    Ver Ficha
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
