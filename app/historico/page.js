// ============================================
// HISTORICO — Registro Historico da Frota Venture
// Acessando logs temporais e culturais
// ============================================

import Link from 'next/link';

export const metadata = {
  title: 'Historico — USS Venture',
  description: 'Historico de missoes, Projeto Terra Prime e Estacoes Espaciais da Frota Venture.',
};

export default function HistoricoPage() {
  const timeline = [
    { ano: "2008", titulo: "Fundacao da Frota Venture", desc: "O Grupo USS Venture e fundado no Second Life pelo Almirante MDaniel. O entao Tenente Comandante Elemer Piek e convidado a integrar o grupo. Inicio das operacoes na Land Trivas com a Estacao de Treinamento ET 71854.", cor: "var(--lcars-orange)" },
    { ano: "2009", titulo: "Projeto Terra Prime", desc: "Implantacao do Tribunal Klingon, Templo Vulcano de P'Jem e Jardins Betazoides. Inauguracao do ambiente de roleplay cultural.", cor: "var(--lcars-sky)" },
    { ano: "2010", titulo: "Expansao Cultural e Naval", desc: "Inauguracao do Senado Romulano, Praia de Risa e Laboratorio Subaquatico Dra. Gillian Taylor. USS Adventure, USS Andor e USS Nautilus comissionadas.", cor: "var(--lcars-blue)" },
    { ano: "2011", titulo: "Estacao DS6 e Fanfilme Phoenix", desc: "Inauguracao da Estacao DS6 Elim Garak. Lancamento do 1o fanfilme brasileiro de Star Trek: 'Star Trek USS Andor - Phoenix' parte 1 em outubro.", cor: "var(--lcars-red)" },
    { ano: "2012", titulo: "Fanfilme Phoenix — Parte 2", desc: "Lancamento da segunda parte do fanfilme USS Andor - Phoenix em marco. Conclusao do projeto cinematografico pioneiro.", cor: "var(--lcars-lavender)" },
    { ano: "2014", titulo: "Renovacao da Esquadra", desc: "USS Andor descomissionada. USS Suidara comissionada para patrulhamento.", cor: "var(--lcars-teal)" },
    { ano: "2016", titulo: "Base Estelar SB-245", desc: "Inauguracao da Estacao Espacial SB-245, construida pelo Cap. B7Web Xue. 'Um grao de areia para um universo... um grande Lar para todos nos.'", cor: "var(--lcars-green)" },
    { ano: "2017", titulo: "USS Rerum Comissionada", desc: "Nova nave entra em servico sob o comando do Capitao Jeff.", cor: "var(--lcars-lavender)" },
    { ano: "2022", titulo: "Classe Explorer", desc: "USS Altotting e USS Serenity entram em servico. Marchezini assume o comando da Serenity.", cor: "var(--lcars-orange)" },
    { ano: "2026", titulo: "Refit Digital — Projeto LCARS", desc: "Modernizacao da presenca digital com interface LCARS responsiva e sistema Lal Data AI.", cor: "var(--lcars-peach)" },
  ];

  return (
    <div>
      <div className="lcars-hero">
        <h1>Registro Historico</h1>
        <div className="subtitle">Log de Missoes e Historia — Frota Venture desde 2008</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Featured sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '30px',
      }}>
        <Link href="/historico/missoes" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-green)', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--lcars-green)' }}>
                Log de Missoes
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                Registro de todas as missoes realizadas pela esquadra
              </div>
            </div>
            <div className="lcars-card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{ background: 'var(--lcars-green)', color: '#000', fontSize: '0.65rem' }}>Missoes</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.65rem' }}>Diarios</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-sky)', color: '#000', fontSize: '0.65rem' }}>Tripulacao</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/historico/contos" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-lavender)', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--lcars-lavender)' }}>
                Contos da Frota
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                Contos escritos pelo Comodoro Kharan — 3 Arcos Narrativos
              </div>
            </div>
            <div className="lcars-card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{ background: 'var(--lcars-sky)', color: '#000', fontSize: '0.65rem' }}>O Inicio</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.65rem' }}>A Fusao</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.65rem' }}>A Missao Final</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-lavender)', color: '#000', fontSize: '0.65rem' }}>9 Capitulos</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/historico/cronicas" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-orange)', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--lcars-orange)' }}>
                Cronicas da Frota
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                Historia em quadrinhos — Resgate em Prios
              </div>
            </div>
            <div className="lcars-card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.65rem' }}>HQ</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/historico/tribunas-quarks" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-sky)', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--lcars-sky)' }}>
                Tribunas Quarks
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                Revistas do acervo historico — 42 edicoes
              </div>
            </div>
            <div className="lcars-card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{ background: 'var(--lcars-sky)', color: '#000', fontSize: '0.65rem' }}>Revista</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-lavender)', color: '#000', fontSize: '0.65rem' }}>42 Edicoes</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.65rem' }}>Acervo</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/historico/estacoes" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-sky)', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--lcars-sky)' }}>
                Estacoes Espaciais
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                Bases estelares e estacoes orbitais construidas ao longo dos anos
              </div>
            </div>
            <div className="lcars-card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{ background: 'var(--lcars-sky)', color: '#000', fontSize: '0.65rem' }}>SB-245</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-lavender)', color: '#000', fontSize: '0.65rem' }}>ET 71854</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.65rem' }}>DS6 Elim Garak</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-blue)', color: '#000', fontSize: '0.65rem' }}>Doca Espacial</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/historico/terra-prime" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-teal)', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--lcars-teal)' }}>
                Projeto Terra Prime
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                Culturas e civilizacoes do Universo Star Trek recriadas no Second Life
              </div>
            </div>
            <div className="lcars-card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{ background: 'var(--lcars-teal)', color: '#000', fontSize: '0.65rem' }}>Tribunal Klingon</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-sky)', color: '#000', fontSize: '0.65rem' }}>Templo Vulcano</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-purple)', color: '#fff', fontSize: '0.65rem' }}>Senado Romulano</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-green)', color: '#000', fontSize: '0.65rem' }}>Praia de Risa</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-blue)', color: '#000', fontSize: '0.65rem' }}>+3 locais</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/historico/fanfilme" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{ borderColor: 'var(--lcars-red)', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--lcars-red)' }}>
                Fanfilme Phoenix
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-light)', marginTop: '4px' }}>
                1o fanfilme brasileiro de Star Trek — 2011
              </div>
            </div>
            <div className="lcars-card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="lcars-badge" style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.65rem' }}>Parte 1</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-red)', color: '#fff', fontSize: '0.65rem' }}>Parte 2</span>
                <span className="lcars-badge" style={{ background: 'var(--lcars-orange)', color: '#000', fontSize: '0.65rem' }}>YouTube</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Timeline */}
      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-lavender)', color: '#000' }}>Linha do Tempo — Frota Venture</div>
      </div>

      <div style={{ position: 'relative', paddingLeft: '40px', marginTop: '16px' }}>
        <div style={{
          position: 'absolute', left: '15px', top: 0, bottom: 0,
          width: '3px',
          background: 'linear-gradient(180deg, var(--lcars-orange), var(--lcars-blue), var(--lcars-teal))',
          borderRadius: '2px',
        }} />

        {timeline.map((ev, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: '24px', paddingLeft: '20px' }}>
            <div style={{
              position: 'absolute', left: '-31px', top: '12px',
              width: '14px', height: '14px', borderRadius: '50%',
              background: ev.cor, border: '2px solid var(--lcars-bg)',
            }} />
            <div className="lcars-card" style={{ borderColor: ev.cor }}>
              <div style={{ display: 'flex', alignItems: 'stretch', overflow: 'hidden', borderRadius: 'var(--lcars-radius-sm)' }}>
                <div style={{
                  width: '90px', background: ev.cor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 700, color: '#000',
                  flexShrink: 0, letterSpacing: '1px',
                }}>
                  {ev.ano}
                </div>
                <div style={{ padding: '14px 20px', flex: 1 }}>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '2px', color: ev.cor, marginBottom: '6px',
                  }}>
                    {ev.titulo}
                  </div>
                  <div style={{ color: 'var(--lcars-text-light)', fontSize: '0.85rem' }}>
                    {ev.desc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
