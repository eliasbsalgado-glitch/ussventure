'use client';

// ============================================
// PDF VIEWER — Visualizador universal usando PDF.js
// Funciona em desktop e mobile
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';

export default function PdfViewer({ src }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  // Carregar PDF.js e o documento
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      pdfjsLib.getDocument(src).promise.then(pdf => {
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setLoading(false);
      }).catch(() => setLoading(false));
    };
    document.head.appendChild(script);

    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, [src]);

  // Renderizar pagina
  const renderPage = useCallback((num) => {
    if (!pdfDoc || !canvasRef.current) return;

    pdfDoc.getPage(num).then(page => {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const viewport = page.getViewport({ scale: 1 });
      const responsiveScale = Math.min((containerWidth - 20) / viewport.width, 2.5);

      const scaledViewport = page.getViewport({ scale: responsiveScale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      page.render({ canvasContext: ctx, viewport: scaledViewport });
    });
  }, [pdfDoc]);

  useEffect(() => {
    if (pdfDoc) renderPage(pageNum);
  }, [pdfDoc, pageNum, renderPage]);

  // Redimensionar ao mudar tamanho da tela
  useEffect(() => {
    const handleResize = () => { if (pdfDoc) renderPage(pageNum); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc, pageNum, renderPage]);

  const prevPage = () => { if (pageNum > 1) setPageNum(p => p - 1); };
  const nextPage = () => { if (pageNum < totalPages) setPageNum(p => p + 1); };

  const btnStyle = {
    border: 'none', cursor: 'pointer', fontSize: '0.8rem',
    padding: '8px 20px', borderRadius: '100vmax', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1px',
  };

  return (
    <div ref={containerRef}>
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--lcars-text-dim)' }}>
          Carregando quadrinho...
        </div>
      )}

      {!loading && totalPages > 0 && (
        <>
          {/* Controles superiores */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', marginBottom: '12px', flexWrap: 'wrap',
          }}>
            <button onClick={prevPage} disabled={pageNum <= 1}
              style={{ ...btnStyle, background: pageNum <= 1 ? '#333' : 'var(--lcars-sky)', color: pageNum <= 1 ? '#666' : '#000' }}>
              ← Anterior
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--lcars-peach)', letterSpacing: '1px' }}>
              Pagina {pageNum} / {totalPages}
            </span>
            <button onClick={nextPage} disabled={pageNum >= totalPages}
              style={{ ...btnStyle, background: pageNum >= totalPages ? '#333' : 'var(--lcars-sky)', color: pageNum >= totalPages ? '#666' : '#000' }}>
              Proxima →
            </button>
          </div>

          {/* Canvas do PDF */}
          <div style={{ textAlign: 'center', overflow: 'auto' }}>
            <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto', borderRadius: 'var(--lcars-radius-sm)', maxWidth: '100%' }} />
          </div>

          {/* Controles inferiores */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', marginTop: '12px', flexWrap: 'wrap',
          }}>
            <button onClick={prevPage} disabled={pageNum <= 1}
              style={{ ...btnStyle, background: pageNum <= 1 ? '#333' : 'var(--lcars-sky)', color: pageNum <= 1 ? '#666' : '#000' }}>
              ← Anterior
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--lcars-peach)', letterSpacing: '1px' }}>
              {pageNum} / {totalPages}
            </span>
            <button onClick={nextPage} disabled={pageNum >= totalPages}
              style={{ ...btnStyle, background: pageNum >= totalPages ? '#333' : 'var(--lcars-sky)', color: pageNum >= totalPages ? '#666' : '#000' }}>
              Proxima →
            </button>
          </div>

          {/* Link para download */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href={src} download style={{
              fontSize: '0.7rem', color: 'var(--lcars-text-dim)',
              textDecoration: 'underline',
            }}>
              Baixar PDF
            </a>
          </div>
        </>
      )}

      {!loading && totalPages === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: 'var(--lcars-text-dim)', marginBottom: '12px' }}>
            Nao foi possivel carregar o visualizador.
          </p>
          <a href={src} className="lcars-btn orange" download style={{ display: 'inline-block' }}>
            Baixar PDF
          </a>
        </div>
      )}
    </div>
  );
}
