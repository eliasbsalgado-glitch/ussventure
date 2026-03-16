'use client';

// ============================================
// PHOTO GALLERY — Galeria com lightbox fullscreen
// Clique na foto para expandir em tela cheia
// Suporta fotos como strings OU objetos {url, legenda}
// ============================================

import { useState, useEffect, useCallback } from 'react';

export default function PhotoGallery({ fotos, titulo, cor, children }) {
  const [open, setOpen] = useState(null);

  // Normalize: fotos can be [string] or [{url, legenda}]
  const urls = (fotos || []).map(f => typeof f === 'string' ? f : f?.url || '').filter(Boolean);
  const legendas = (fotos || []).map(f => typeof f === 'string' ? '' : f?.legenda || '');

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen(i => (i > 0 ? i - 1 : urls.length - 1)), [urls.length]);
  const next = useCallback(() => setOpen(i => (i < urls.length - 1 ? i + 1 : 0)), [urls.length]);

  useEffect(() => {
    if (open === null) return;
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, prev, next]);

  if (urls.length === 0) return children || null;

  return (
    <>
      {/* Thumbnail Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${urls.length > 6 ? '180px' : '220px'}, 1fr))`,
        gap: '8px',
        marginTop: '8px',
      }}>
        {urls.map((img, j) => (
          <div key={j} onClick={() => setOpen(j)} style={{
            borderRadius: 'var(--lcars-radius-sm)',
            overflow: 'hidden',
            border: '1px solid #333',
            background: 'var(--lcars-bg-panel)',
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.borderColor = cor || '#FF9900'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#333'; }}
          >
            <img
              src={img}
              alt={legendas[j] || `${titulo || 'Foto'} ${j + 1}`}
              style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
            />
            {legendas[j] && (
              <div style={{
                fontSize: '0.7rem', color: 'var(--lcars-text-dim)',
                padding: '4px 8px', textAlign: 'center', fontStyle: 'italic',
              }}>
                {legendas[j]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div onClick={close} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.95)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <button onClick={close} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid #555',
            color: '#fff', fontSize: '1.2rem', width: '40px', height: '40px',
            borderRadius: '50%', cursor: 'pointer', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          <div style={{
            position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
            color: '#888', fontSize: '0.8rem', fontFamily: 'var(--font-lcars)',
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            {open + 1} / {urls.length}
          </div>

          {urls.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev(); }} style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.08)', border: '1px solid #444',
              color: '#fff', fontSize: '1.5rem', width: '44px', height: '60px',
              borderRadius: '8px', cursor: 'pointer', zIndex: 10,
            }}>‹</button>
          )}

          <img
            src={urls[open]}
            alt={legendas[open] || `${titulo || 'Foto'} ${open + 1}`}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain',
              borderRadius: '8px', boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            }}
          />

          {legendas[open] && (
            <div style={{
              position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              color: '#ccc', fontSize: '0.85rem', fontStyle: 'italic',
              padding: '6px 20px', background: 'rgba(0,0,0,0.6)', borderRadius: '8px',
            }}>
              {legendas[open]}
            </div>
          )}

          {urls.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next(); }} style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.08)', border: '1px solid #444',
              color: '#fff', fontSize: '1.5rem', width: '44px', height: '60px',
              borderRadius: '8px', cursor: 'pointer', zIndex: 10,
            }}>›</button>
          )}
        </div>
      )}
    </>
  );
}
