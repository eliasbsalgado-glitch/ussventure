// ============================================
// DIVISAO DETALHADA — Pagina individual (consulta)
// Exibe dados editaveis do banco + tripulantes + agenda
// ============================================

import Link from 'next/link';
import { getDivisoes, getDivisaoBySlug, getTripulantesByDivisao } from '@/lib/data';
import AgendaPanel from '@/components/AgendaPanel';
import sql from '@/lib/db';

export async function generateStaticParams() {
  const divisoes = await getDivisoes();
  return divisoes.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const div = await getDivisaoBySlug(slug);
  if (!div) return { title: 'Divisao — USS Venture' };
  return {
    title: `${div.nome} — USS Venture`,
    description: div.desc,
  };
}

export const dynamic = 'force-dynamic';

async function getDivisaoData(slug) {
  const rows = await sql`SELECT * FROM divisoes_data WHERE divisao_slug = ${slug}`;
  if (rows.length === 0) return { descricao: '', departamentos: [] };
  return { descricao: rows[0].descricao || '', departamentos: rows[0].departamentos || [] };
}

export default async function DivisaoDetailPage({ params }) {
  const { slug } = await params;
  const div = await getDivisaoBySlug(slug);

  if (!div) {
    return (
      <div>
        <div className="lcars-hero">
          <h1>Divisao Nao Encontrada</h1>
          <div className="subtitle">Registro nao localizado nos bancos de dados</div>
        </div>
        <div className="lcars-bar gradient" />
        <div className="lcars-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--lcars-text-dim)' }}>
            Esta divisao nao existe nos registros do computador central.
          </p>
          <Link href="/divisoes" className="lcars-btn sky" style={{ marginTop: '16px', display: 'inline-block' }}>
            Voltar para Divisoes
          </Link>
        </div>
      </div>
    );
  }

  const [tripulantes, divData] = await Promise.all([
    getTripulantesByDivisao(slug),
    getDivisaoData(slug),
  ]);

  // Rank priority for sorting
  const rankOrder = {
    'Almirante': 1, 'Comodoro': 2, 'Capitão': 3, 'Capitao': 3,
    'Comandante': 4, 'Tenente Comandante': 5, 'Tenente': 6,
    'Tenente Junior': 7, 'Alferes': 8, 'Cadete': 9,
    'Tripulante Classe 1': 10, 'Tripulante Classe 2': 11,
    'Tripulante Classe 3': 12, 'Recruta': 13, 'Não designado': 14,
  };
  tripulantes.sort((a, b) => {
    const ra = rankOrder[a.patente] || 99;
    const rb = rankOrder[b.patente] || 99;
    return ra - rb || a.nome.localeCompare(b.nome);
  });

  // Resolve department chief names
  const departamentos = (divData.departamentos || []).map(dep => {
    const chefe = dep.chefeSlug ? tripulantes.find(t => t.slug === dep.chefeSlug) : null;
    return { ...dep, chefeNome: chefe?.nome || dep.chefeSlug || '' };
  });

  // Use DB description if available, otherwise fallback to hardcoded
  const descricao = divData.descricao || div.desc;

  return (
    <div>
      {/* Hero */}
      <div className="lcars-hero">
        <h1>Divisao {div.nome}</h1>
        <div className="subtitle">{tripulantes.length} tripulantes designados</div>
      </div>

      <div className="lcars-bar gradient" style={{ background: `linear-gradient(90deg, ${div.cor}, ${div.cor}88, ${div.cor}44)` }} />

      {/* Division info panel */}
      <div className="lcars-panel" style={{ borderColor: div.cor }}>
        <div className="lcars-panel-header" style={{ background: div.cor, color: '#000' }}>
          Informacoes da Divisao
        </div>
        <div className="lcars-panel-body">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className="lcars-badge" style={{ background: div.cor, color: '#000', fontSize: '0.8rem' }}>
              Cor: {div.corNome}
            </span>
            <span className="lcars-badge blue" style={{ fontSize: '0.8rem' }}>
              {tripulantes.length} tripulantes
            </span>
            {div.chefe && (
              <span className="lcars-badge orange" style={{ fontSize: '0.8rem' }}>
                ★ Chefe: {div.chefe}
              </span>
            )}
          </div>
          <p style={{ lineHeight: '1.7', color: 'var(--lcars-text)' }}>
            {descricao}
          </p>
        </div>
      </div>

      {/* Departamentos */}
      {departamentos.length > 0 && (
        <div className="lcars-panel" style={{ marginTop: '20px', borderColor: div.cor }}>
          <div className="lcars-panel-header" style={{ background: div.cor, color: '#000' }}>
            Departamentos — {departamentos.length}
          </div>
          <div className="lcars-panel-body" style={{ padding: 0 }}>
            {departamentos.map((dep, i) => (
              <div key={dep.id || i} style={{ padding: '14px 16px', borderBottom: i < departamentos.length - 1 ? '1px solid #222' : 'none' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--lcars-blue)', fontSize: '0.95rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {dep.nome}
                    </div>
                    {dep.chefeNome && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--lcars-orange)', marginBottom: '4px' }}>
                        ★ Chefe: <Link href={`/tripulacao/${dep.chefeSlug}`} style={{ color: 'var(--lcars-orange)', textDecoration: 'none' }}>{dep.chefeNome}</Link>
                      </div>
                    )}
                    {dep.descricao && (
                      <p style={{ color: 'var(--lcars-text-light)', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>
                        {dep.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew cards grid */}
      {tripulantes.length > 0 ? (
        <>
          <div className="lcars-panel" style={{ marginTop: '20px', borderColor: div.cor }}>
            <div className="lcars-panel-header" style={{ background: div.cor, color: '#000' }}>
              Tripulantes — {div.nome}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}>
            {tripulantes.map((f, i) => (
              <div key={i} className="lcars-card" style={{
                borderColor: f.patente === 'Almirante' ? 'var(--lcars-orange)' :
                  f.patente === 'Comodoro' ? 'var(--lcars-purple)' :
                  f.patente === 'Capitao' || f.patente === 'Capitão' ? 'var(--lcars-sky)' :
                  f.patente === 'Comandante' ? 'var(--lcars-lavender)' : div.cor,
              }}>
                <div className="lcars-card-body" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {/* Photo */}
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
                      color: 'var(--lcars-orange)', textTransform: 'uppercase',
                      letterSpacing: '1px', marginBottom: '6px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {f.nome}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span className="lcars-badge orange" style={{ fontSize: '0.65rem' }}>{f.patente || 'N/A'}</span>
                      <span className="lcars-badge" style={{ fontSize: '0.65rem', background: div.cor, color: '#000' }}>{div.nome}</span>
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
        </>
      ) : (
        <div className="lcars-panel" style={{ marginTop: '20px', textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--lcars-text-dim)' }}>
            Nenhum tripulante designado para esta divisao no momento.
          </p>
        </div>
      )}

      {/* Agenda da Divisao — somente consulta */}
      <AgendaPanel divisaoSlug={slug} divisaoCor={div.cor} divisaoNome={div.nome} readOnly={true} />

      {/* Back link */}
      <div style={{ textAlign: 'center', marginTop: '24px', paddingBottom: '20px' }}>
        <Link href="/divisoes" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar para Divisoes
        </Link>
      </div>
    </div>
  );
}
