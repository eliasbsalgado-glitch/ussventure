'use client';

// ============================================
// PHOTO GALLERY — Galeria com lightbox fullscreen
// Clique na foto para expandir em tela cheia
// ============================================

import { useState, useEffect, useCallback } from 'react';

export default function PhotoGallery({ fotos, titulo, cor }) {
  const [open, setOpen] = useState(null); // index da foto aberta

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen(i => (i > 0 ? i - 1 : fotos.length - 1)), [fotos.length]);
  const next = useCallback(() => setOpen(i => (i < fotos.length - 1 ? i + 1 : 0)), [fotos.length]);

  // Keyboard navigation
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

  if (!fotos || fotos.length === 0) return null;

  return (
    <>
      {/* Thumbnail Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${fotos.length > 6 ? '180px' : '220px'}, 1fr))`,
        gap: '8px',
        marginTop: '8px',
      }}>
        {fotos.map((img, j) => (
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
              alt={`${titulo || 'Foto'} ${j + 1}`}
              style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div onClick={close} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.95)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          {/* Close button */}
          <button onClick={close} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid #555',
            color: '#fff', fontSize: '1.2rem', width: '40px', height: '40px',
            borderRadius: '50%', cursor: 'pointer', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
            color: '#888', fontSize: '0.8rem', fontFamily: 'var(--font-lcars)',
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            {open + 1} / {fotos.length}
          </div>

          {/* Prev */}
          {fotos.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev(); }} style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.08)', border: '1px solid #444',
              color: '#fff', fontSize: '1.5rem', width: '44px', height: '60px',
              borderRadius: '8px', cursor: 'pointer', zIndex: 10,
            }}>‹</button>
          )}

          {/* Image */}
          <img
            src={fotos[open]}
            alt={`${titulo || 'Foto'} ${open + 1}`}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain',
              borderRadius: '8px', boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            }}
          />

          {/* Next */}
          {fotos.length > 1 && (
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
