// ============================================
// FANFILME USS ANDOR - PHOENIX
// 1o Fanfilme Brasileiro de Star Trek
// ============================================

import Link from 'next/link';

export const metadata = {
  title: 'Fanfilme USS Andor Phoenix — USS Venture',
  description: 'Star Trek USS Andor - Phoenix: o primeiro fanfilme brasileiro sobre o Universo Star Trek, produzido pelo Grupo USS Venture no Second Life.',
};

export default function FanfilmePage() {
  const elenco = [
    { personagem: "Almirante Mdaniel Landman", ator: "Mdaniel Landman" },
    { personagem: "Capitão EdwardKirk", ator: "EdwardKirk Franizzi (Douglas Figueiredo)" },
    { personagem: "Comandante Shran", ator: "Shran Zeid (João Misael)" },
    { personagem: "Tenente Comandante Roger", ator: "Roger 'Suran' Romulano" },
    { personagem: "Tenente AnnaJaneway", ator: "AnnaJaneway Quintessa" },
    { personagem: "Almirante Elemer Piek", ator: "Elemer Piek" },
    { personagem: "OverLord Obscure", ator: "Overlord Obscure" },
    { personagem: "Sanival Writers", ator: "Sanival Writers" },
  ];

  const fichaTecnica = [
    { label: "Produzido por", valor: "Grupo USS Venture NCC 71854" },
    { label: "Criado por", valor: "Shran Zeid (João Misael)" },
    { label: "Direcao", valor: "Douglas Figueiredo & João Misael" },
    { label: "Historia e Roteiro", valor: "Douglas Figueiredo & João Misael" },
    { label: "Colaboracao Roteiro", valor: "Elemer Piek, Overlord Obscure" },
    { label: "Co-Producao", valor: "AnnaJaneway Quintessa, Sanival Writers" },
    { label: "Edicao Geral", valor: "Douglas Figueiredo" },
    { label: "Captura de Imagens", valor: "SM Recorder (Second Life)" },
    { label: "Edicao de Video", valor: "Sony Vegas 10" },
    { label: "Lancamento Parte 1", valor: "22 de outubro de 2011" },
    { label: "Lancamento Parte 2", valor: "18 de marco de 2012" },
  ];

  return (
    <div>
      {/* Hero with poster */}
      <div className="lcars-hero">
        <h1>Star Trek USS Andor — Phoenix</h1>
        <div className="subtitle">1o Fanfilme Brasileiro sobre o Universo Star Trek</div>
      </div>

      <div className="lcars-bar" style={{ background: 'linear-gradient(90deg, var(--lcars-mars), var(--lcars-orange), var(--lcars-gold))' }} />

      {/* Poster + Synopsis */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', marginBottom: '28px' }}>
        <div style={{
          borderRadius: 'var(--lcars-radius-sm)', overflow: 'hidden',
          border: '2px solid var(--lcars-mars)', background: 'var(--lcars-bg-panel)',
        }}>
          <img src="/img/historico/Cartaz_Fanfilme.jpg" alt="Cartaz Fanfilme USS Andor Phoenix"
            style={{ width: '100%', display: 'block' }} />
        </div>

        <div className="lcars-panel" style={{ borderColor: 'var(--lcars-mars)' }}>
          <div className="lcars-panel-header" style={{ background: 'var(--lcars-mars)', color: '#fff' }}>
            Sinopse
          </div>
          <div className="lcars-panel-body" style={{ lineHeight: '1.9' }}>
            <p style={{ marginBottom: '12px' }}>
              Depois da Guerra contra o Dominio, Cardassia estava arrasada. A populacao que resistiu
              exigiu um poder governante sem os militares, elegendo uma cupula civil para governar Cardassia.
            </p>
            <p style={{ marginBottom: '12px' }}>
              Alguns militares insatisfeitos resolveram sair de Cardassia e formar um Grupo Paramilitar,
              denominado <strong style={{ color: 'var(--lcars-orange)' }}>Neo-cardassianos</strong>, que
              iniciaram uma serie de ataques e atentados nas fronteiras do territorio Cardassiano.
            </p>
            <p style={{ marginBottom: '12px' }}>
              O Governo Civil Cardassiano solicita a ajuda da Federacao Unida dos Planetas para proteger
              setores vitais, entre eles o <strong style={{ color: 'var(--lcars-sky)' }}>Sistema Trivas</strong>,
              no setor Almatha. Em orbita de Trivas Prime esta a antiga Estacao Cardassiana abandonada
              &ldquo;Empok Nor&rdquo;.
            </p>
            <p style={{ marginBottom: '12px' }}>
              Ao tomar posse da Estacao, tres naves da Frota Venture sao designadas para o setor, e o
              Almirante Mdaniel Landman rebatiza a Estacao para{' '}
              <strong style={{ color: 'var(--lcars-teal)' }}>Deep Space 6 — Elim Garak</strong>.
            </p>
            <p>
              Os Neo-Cardassianos sofrem varias derrotas e convocam uma negociacao de paz, onde a
              <strong style={{ color: 'var(--lcars-blue)' }}> USS Andor</strong> e enviada para se reunir
              com uma nave classe Galor, denominada Traior...
            </p>
          </div>
        </div>
      </div>

      {/* Video Embeds */}
      <div className="lcars-panel" style={{ borderColor: 'var(--lcars-orange)', marginBottom: '20px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-orange)' }}>
          Star Trek Andor — Phoenix — Parte 1
        </div>
        <div className="lcars-panel-body" style={{ padding: '0', background: '#000' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/L0wtneyB20w"
              title="Star Trek Andor - Phoenix - Parte 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', border: 'none',
              }}
            />
          </div>
        </div>
      </div>

      <div className="lcars-panel" style={{ borderColor: 'var(--lcars-sky)', marginBottom: '28px' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-sky)' }}>
          Star Trek Andor — Phoenix — Parte 2
        </div>
        <div className="lcars-panel-body" style={{ padding: '0', background: '#000' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/bzVkApQXEBY"
              title="Star Trek Andor - Phoenix - Parte 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', border: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Cast and Credits side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Elenco */}
        <div className="lcars-panel" style={{ borderColor: 'var(--lcars-lavender)' }}>
          <div className="lcars-panel-header lavender">Elenco</div>
          <div className="lcars-panel-body" style={{ padding: 0 }}>
            <table className="lcars-table">
              <thead>
                <tr>
                  <th>Personagem</th>
                  <th>Ator / Avatar</th>
                </tr>
              </thead>
              <tbody>
                {elenco.map((e, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--lcars-orange)', fontWeight: 600 }}>{e.personagem}</td>
                    <td>{e.ator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ficha Técnica */}
        <div className="lcars-panel" style={{ borderColor: 'var(--lcars-gold)' }}>
          <div className="lcars-panel-header" style={{ background: 'var(--lcars-gold)' }}>Ficha Tecnica</div>
          <div className="lcars-panel-body" style={{ padding: 0 }}>
            <table className="lcars-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {fichaTecnica.map((f, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--lcars-tanoi)', fontWeight: 600, whiteSpace: 'nowrap' }}>{f.label}</td>
                    <td>{f.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Soundtrack */}
      <div className="lcars-panel" style={{ borderColor: 'var(--lcars-purple)', marginBottom: '24px' }}>
        <div className="lcars-panel-header purple">Trilha Sonora</div>
        <div className="lcars-panel-body">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '8px', fontSize: '0.85rem',
          }}>
            {[
              "Star Trek Voyager — Jerry Goldsmith",
              "Star Trek V: The Mountain — Jerry Goldsmith",
              "Star Trek VI: Sign Off — Clif Eidelman",
              "Star Trek VII: Out of Control — Dennis McCarthy",
              "Star Trek IX: The Drones Attack — Jerry Goldsmith",
              "Star Trek IX: The Healing Process — Jerry Goldsmith",
              "Star Trek DS9: One Last Visit — Dennis McCarthy",
              "Star Trek X: The Scorpion",
              "Star Trek TMP: A Good Start — Jerry Goldsmith",
              "Star Trek XI: Count Down",
              "Resident Evil — Fearful It's Not Word For This",
              "Prince of Persia — Warrior Whiting",
            ].map((t, i) => (
              <div key={i} style={{ padding: '6px 10px', background: 'rgba(153,119,170,0.1)', borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-text-light)' }}>
                <span style={{ color: 'var(--lcars-purple)', marginRight: '6px' }}>♪</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--lcars-radius-sm)',
        padding: '16px 20px', marginBottom: '20px',
        fontSize: '0.8rem', color: 'var(--lcars-text-dim)', lineHeight: '1.6',
        borderLeft: '3px solid var(--lcars-text-dim)',
      }}>
        Star Trek© e todas as series derivadas, assim como os personagens, sao marcas registradas da Paramount Pictures,
        uma divisao da Viacom, com todos os direitos reservados. Este Fanfilme foi produzido sem fins lucrativos,
        para exibicao gratuita, apenas com o objetivo de divulgar Star Trek entre os fans de Lingua Portuguesa.
        Material feito de fans para fans.
      </div>

      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Link href="/historico" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar ao Historico
        </Link>
      </div>
    </div>
  );
}
