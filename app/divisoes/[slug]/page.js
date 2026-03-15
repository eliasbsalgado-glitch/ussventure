// ============================================
// DIVISAO DETALHADA — Pagina individual da divisao
// Exibindo tripulantes ativos desta divisao
// ============================================

import Link from 'next/link';
import { getDivisoes, getDivisaoBySlug, getTripulantesByDivisao } from '@/lib/data';
import AgendaPanel from '@/components/AgendaPanel';

export async function generateStaticParams() {
  const divisoes = getDivisoes();
  return divisoes.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const div = getDivisaoBySlug(slug);
  if (!div) return { title: 'Divisao — USS Venture' };
  return {
    title: `${div.nome} — USS Venture`,
    description: div.desc,
  };
}

export default async function DivisaoDetailPage({ params }) {
  const { slug } = await params;
  const div = getDivisaoBySlug(slug);

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

  const tripulantes = getTripulantesByDivisao(slug);

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
              {div.qtd} tripulantes
            </span>
            {div.chefe && (
              <span className="lcars-badge orange" style={{ fontSize: '0.8rem' }}>
                ★ Chefe: {div.chefe}
              </span>
            )}
          </div>
          <p style={{ lineHeight: '1.7', color: 'var(--lcars-text)' }}>
            {div.desc}
          </p>
        </div>
      </div>

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

      {/* Agenda da Divisao */}
      <AgendaPanel divisaoSlug={slug} divisaoCor={div.cor} divisaoNome={div.nome} />

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
