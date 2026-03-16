// ============================================
// FICHA DE SERVICO — Perfil publico do tripulante
// Carregando registro classificado nivel 4
// ============================================

import Link from 'next/link';
import { notFound } from 'next/navigation';
import sql from '@/lib/db';

async function getFicha(slug) {
  const rows = await sql`SELECT * FROM fichas WHERE slug = ${slug}`;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    slug: r.slug, nome: r.nome, nascimentoSL: r.nascimento_sl, cidade: r.cidade,
    raca: r.raca, admissao: r.admissao, patente: r.patente, divisao: r.divisao,
    departamento: r.departamento, foto: r.foto, historia: r.historia,
    timeline: r.timeline || [], condecoracoes: r.condecoracoes || [],
    cursos: r.cursos || [], diarios: r.diarios || [],
  };
}

// Resolve honraria IDs from DB and render condecoracoes
async function CondecoracoesDisplay({ condecoracoes }) {
  // Fetch all honrarias to resolve IDs
  const honrarias = await sql`SELECT id, nome, imagem, categoria FROM honrarias`;
  const honrariaMap = {};
  honrarias.forEach(h => { honrariaMap[h.id] = h; });

  // Build resolved list: DB honrarias + legacy file-based fallback
  const resolved = condecoracoes.map(entry => {
    if (honrariaMap[entry]) {
      return { type: 'db', id: entry, nome: honrariaMap[entry].nome, imagem: honrariaMap[entry].imagem };
    }
    // Legacy: old file-based entry
    return { type: 'legacy', file: entry, nome: entry.replace(/\.\w+$/, '').replace(/[_-]/g, ' ') };
  });

  return (
    <div className="lcars-panel">
      <div className="lcars-panel-header lavender">Condecoracoes — {resolved.length}</div>
      <div className="lcars-panel-body">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {resolved.map((medal, i) => (
            <div key={i} style={{
              width: '80px', textAlign: 'center', padding: '8px 4px',
              background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--lcars-radius-sm)',
              border: '1px solid #333',
            }}>
              {medal.type === 'db' ? (
                medal.imagem ? (
                  <img src={medal.imagem} alt={medal.nome}
                    style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(255,153,0,0.3))' }}
                  />
                ) : (
                  <div style={{
                    width: '60px', height: '60px', margin: '0 auto',
                    background: 'rgba(204,153,204,0.15)', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.5rem', color: 'var(--lcars-lavender)',
                  }}>★</div>
                )
              ) : (
                <img src={`/img/condecoracoes/${medal.file}`} alt={medal.nome}
                  style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(255,153,0,0.3))' }}
                />
              )}
              <div style={{
                fontSize: '0.5rem', marginTop: '4px', lineHeight: '1.2',
                color: 'var(--lcars-lavender)',
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {medal.nome}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ficha = await getFicha(slug);
  if (!ficha) return { title: 'Tripulante nao encontrado' };
  return { title: `${ficha.nome} — Ficha de Servico`, description: `Ficha de servico de ${ficha.nome}` };
}

export const dynamic = 'force-dynamic';

export default async function FichaPage({ params }) {
  const { slug } = await params;
  const ficha = await getFicha(slug);
  if (!ficha) notFound();

  // Calcular tempo de servico descontando periodos em reserva
  function calcTempoServico(ficha) {
    if (!ficha.admissao) return { total: 'N/A', reserva: 0, ativo: 'N/A' };

    const admissao = new Date(ficha.admissao).getTime();
    const agora = Date.now();
    const totalMs = agora - admissao;

    // Analisar timeline para encontrar periodos de reserva
    const timeline = (ficha.timeline || [])
      .filter(ev => ev.data)
      .sort((a, b) => a.data.localeCompare(b.data));

    let reservaMs = 0;
    let emReserva = false;
    let inicioReserva = 0;

    for (const ev of timeline) {
      const evDate = new Date(ev.data).getTime();
      const texto = (ev.evento || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      // Detectar entrada na reserva
      if (!emReserva && (
        texto.includes('divisao reserva') ||
        texto.includes('para reserva') ||
        texto.includes('transferencia para reserva') ||
        texto.includes('transferncia para reserva')
      )) {
        emReserva = true;
        inicioReserva = evDate;
      }
      // Detectar saida da reserva
      else if (emReserva && (
        texto.includes('de reserva') ||
        texto.includes('retorna da reserva') ||
        (texto.includes('foi designado para a divisao') && !texto.includes('reserva')) ||
        (texto.includes('transferencia de reserva'))
      )) {
        reservaMs += evDate - inicioReserva;
        emReserva = false;
      }
    }

    // Se ainda esta em reserva, contar ate hoje
    if (emReserva) {
      reservaMs += agora - inicioReserva;
    }

    const ativoMs = totalMs - reservaMs;
    const msParaAnos = (ms) => (ms / (365.25 * 24 * 3600 * 1000));

    const totalAnos = msParaAnos(totalMs);
    const reservaAnos = msParaAnos(reservaMs);
    const ativoAnos = msParaAnos(ativoMs);

    return {
      total: totalAnos.toFixed(1),
      reserva: reservaAnos.toFixed(1),
      ativo: ativoAnos.toFixed(1),
      temReserva: reservaMs > 0,
    };
  }

  const ts = calcTempoServico(ficha);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '16px', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        <Link href="/tripulacao" style={{ color: 'var(--lcars-text-dim)' }}>← Tripulacao</Link>
      </div>

      {/* HEADER — Foto + Nome + Badges */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Foto */}
        <div style={{
          width: '160px', height: '200px',
          borderRadius: 'var(--lcars-radius)',
          border: '2px solid var(--lcars-orange)',
          background: 'rgba(0,0,0,0.5)',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {ficha.foto ? (
            <img src={ficha.foto} alt={ficha.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lcars-text-dim)', fontSize: '0.8rem' }}>
              SEM FOTO
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: 'var(--font-lcars)', fontSize: '1.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '4px',
            color: 'var(--lcars-orange)', marginBottom: '10px',
          }}>
            {ficha.nome}
          </h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="lcars-badge orange">{ficha.patente || 'Sem Patente'}</span>
            <span className="lcars-badge blue">{ficha.divisao || 'Sem Divisao'}</span>
            <span className="lcars-badge lavender">{ficha.raca || 'N/A'}</span>
          </div>
          <div style={{ color: 'var(--lcars-text-dim)', fontSize: '0.85rem' }}>
            {ficha.departamento && <span>Departamento: <strong style={{ color: 'var(--lcars-peach)' }}>{ficha.departamento}</strong> | </span>}
            Tempo de servico ativo: <strong style={{ color: 'var(--lcars-peach)' }}>{ts.ativo} anos</strong>
            {ts.temReserva && (
              <span style={{ color: 'var(--lcars-text-dim)', fontSize: '0.75rem', marginLeft: '8px' }}>
                (Total: {ts.total} anos — Reserva: {ts.reserva} anos descontados)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="lcars-bar gradient" />

      {/* DADOS PESSOAIS */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px', margin: '20px 0',
      }}>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-orange)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-orange)', fontSize: '1rem' }}>{ficha.nascimentoSL || 'N/A'}</div>
          <div className="lcars-stat-label">Nascimento SL</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-sky)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-sky)', fontSize: '1rem' }}>{ficha.admissao || 'N/A'}</div>
          <div className="lcars-stat-label">Data de Admissao</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-lavender)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-lavender)', fontSize: '1rem' }}>{ficha.cidade || 'N/A'}</div>
          <div className="lcars-stat-label">Cidade / Origem</div>
        </div>
      </div>

      {/* HISTORIA PREGRESSA */}
      {ficha.historia && (
        <div className="lcars-panel">
          <div className="lcars-panel-header">Historia Pregressa</div>
          <div className="lcars-panel-body">
            <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{ficha.historia}</p>
          </div>
        </div>
      )}

      {/* TIMELINE CARREIRA */}
      {ficha.timeline && ficha.timeline.length > 0 && (
        <div className="lcars-panel">
          <div className="lcars-panel-header sky">Carreira na USS Venture</div>
          <div className="lcars-panel-body" style={{ padding: 0 }}>
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              <div style={{
                position: 'absolute', left: '10px', top: 0, bottom: 0,
                width: '2px', background: 'linear-gradient(180deg, var(--lcars-sky), var(--lcars-orange))',
              }} />
              {ficha.timeline.map((ev, i) => (
                <div key={i} style={{ position: 'relative', padding: '12px 16px', borderBottom: '1px solid #222' }}>
                  <div style={{
                    position: 'absolute', left: '-25px', top: '16px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: 'var(--lcars-sky)', border: '2px solid var(--lcars-bg)',
                  }} />
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem', color: 'var(--lcars-text-dim)',
                      fontFamily: 'var(--font-lcars)', letterSpacing: '1px', minWidth: '90px',
                    }}>
                      {ev.data}
                    </span>
                    <span style={{ color: 'var(--lcars-peach)', fontSize: '0.9rem' }}>{ev.evento}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONDECORACOES */}
      {ficha.condecoracoes && ficha.condecoracoes.length > 0 && (
        <CondecoracoesDisplay condecoracoes={ficha.condecoracoes} />
      )}

      {/* CURSOS */}
      {ficha.cursos && ficha.cursos.length > 0 && (
        <div className="lcars-panel">
          <div className="lcars-panel-header teal">Academia Venture — Cursos</div>
          <div className="lcars-panel-body" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="lcars-table">
              <thead><tr><th>Curso</th><th>Data</th></tr></thead>
              <tbody>
                {ficha.cursos.map((c, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--lcars-peach)' }}>{c.nome}</td>
                    <td style={{ color: 'var(--lcars-text-dim)' }}>{c.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIARIOS DE BORDO PUBLICOS */}
      {ficha.diarios && ficha.diarios.filter(d => d.publico).length > 0 && (
        <div className="lcars-panel">
          <div className="lcars-panel-header sky">Diario de Bordo</div>
          <div className="lcars-panel-body" style={{ padding: 0 }}>
            {ficha.diarios.filter(d => d.publico).map((d, i) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #222' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--lcars-sky)', fontFamily: 'var(--font-lcars)', letterSpacing: '1px', marginBottom: '6px' }}>
                  {d.data}
                </div>
                <p style={{ color: 'var(--lcars-peach)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {d.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="lcars-bar gradient" />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/tripulacao" className="lcars-btn blue">← Voltar a Tripulacao</Link>
      </div>
    </div>
  );
}
