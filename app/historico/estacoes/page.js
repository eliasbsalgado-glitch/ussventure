// ============================================
// ESTACOES ESPACIAIS — Bases da Frota Venture
// Infraestrutura orbital e estacoes de treinamento
// ============================================

import Link from 'next/link';

export const metadata = {
  title: 'Estacoes Espaciais — USS Venture',
  description: 'Estacoes espaciais construidas pela Frota Venture no Second Life.',
};

export default function EstacoesPage() {
  const sections = [
    {
      titulo: "Estacoes Espaciais da USS Venture",
      cor: "var(--lcars-sky)",
      texto: "Atualmente dispomos de uma Estacao Espacial operacional no complexo orbital da Land da USS Venture. A nossa primeira construcao dentro do meta-universo Star Trek do Second Life foi a Estacao de Treinamento Venture ET 71854. Procuramos criar em nossas Estacoes cenarios em terceira dimensao completamente interativos em realidade virtual, onde qualquer objeto encontrado em sua jornada viabilizara a sua interacao, conforme sua respectiva funcao.",
      textoExtra: "O objetivo foi permitir que os tripulantes do Grupo USS Venture 'vivam' dentro destas Estacoes sua experiencia pessoal, seja como membro da Frota Estelar ou como um civil do seculo 24.",
      imagens: [],
    },
    {
      titulo: "Estacao de Treinamento Venture — ET 71854",
      cor: "var(--lcars-lavender)",
      data: "Data Estelar 20080504",
      texto: "Em 04 de maio de 2008 foi implementada a primeira fase da Estacao de Treinamento Venture ET 71854, desenvolvida para ser uma unidade de simulacoes operacionais e taticas da nave estelar USS Venture — Classe Galaxy. Esta foi a primeira versao da Estacao que consistia de um modulo semelhante a Base Estelar 79, adaptada para a realidade do Second Life.",
      textoExtra: "O antigo Laboratorio de Astronomia foi desenvolvido pelo tripulante Elemer Piek com simulacoes holograficas de diversos sistemas planetarios e planetas conhecidos. Neste simulador tambem poderiam ser construidos ambientes alienigenas para o treinamento dos Grupos Avancados.",
      imagens: ["/img/historico/SL20-Estacao.jpg", "/img/historico/SL21-cartografia.jpg"],
    },
    {
      titulo: "Base Estelar SB-245",
      cor: "var(--lcars-orange)",
      data: "Data Estelar 20160319",
      construtor: "B7Web Xue",
      lema: "Um grao de areia para um universo... um grande Lar para todos nos.",
      texto: "A Estacao Espacial SB-245 (Star Base) e uma estacao orbital do planeta Trivas Prime de carater militar/civil, tendo em seu contingente membros da Federacao Unida dos Planetas. A Estacao e administrada pela Frota Estelar tendo o comando pelos oficiais do Grupo USS Venture. Nesta Estacao ficam docadas as naves da Frota Venture, prontas para atuarem em varias missoes.",
      textoExtra: "No ato da inauguracao oficial, um concurso entre os tripulantes escolheu a frase para a placa que pudesse trazer o espirito de colonizacao espacial e o objetivo do grupo para a Federacao Unida dos Planetas.",
      decks: [
        "Deck 1 — Operacoes: Hangar de reparo de grandes naves, Areas de lazer renderizaveis",
        "Deck 2 — Academia da Frota, Almoxarifado, Ambientes renderizaveis, Enfermaria e Canhoes phasers de defesa",
        "Deck 3 — Anel de Atracacao: Sala de Transporte, Bar do Quark, Area de Exposicao e Sala de Comando",
        "Deck 4 — Docas de atracacao de naves auxiliares e Laboratorios cientificos",
        "Deck 5 — Deck de Engenharia",
      ],
      imagens: [
        "/img/historico/SB245_025.jpg", "/img/historico/SB245_024.jpg",
        "/img/historico/SB245_002.jpg", "/img/historico/SB245_004.jpg",
        "/img/historico/SB245_006.jpg", "/img/historico/SB245_010.jpg",
        "/img/historico/SB245_014.jpg", "/img/historico/SB245_016.jpg",
        "/img/historico/SB245_018.jpg", "/img/historico/SB245_021.jpg",
        "/img/historico/SB245_023.jpg",
      ],
    },
    {
      titulo: "Estacao Deep Space 6 — Elim Garak",
      cor: "var(--lcars-teal)",
      data: "Data Estelar 20110220",
      construtor: "Neeo Andel e Shran Zeid",
      texto: "A Estacao Deep Space 6 Elim Garak representa a cultura e o povo Cardassiano. Trata-se da antiga Estacao Cardassiana Empok Nor que foi reformada para servir de apoio as atividades da Frota Venture na fronteira com o Espaco Cardassiano. E uma estacao orbital do planeta Trivas Prime de carater militar/civil.",
      textoExtra: "A Estacao DS6 tem a intencao de interagir e aproximar cada vez mais todos os tripulantes, civis, militares e amigos do Grupo USS Venture — proporcionando um ambiente fiel com lazer, cultura e moradia... em sua continua missao de exploracao em busca de novos mundos, novas vidas e civilizacoes.",
      decks: [
        "Deck 1 — Operacoes: Sala de Operacoes e controle da Estacao DS6",
        "Deck 2 — Nivel Laser: Bar do Quark",
        "Deck 3 — Hangar interno para pequenas naves auxiliares",
        "Deck 4 — Anel de Atracagem: Sala de Transporte, Docas, Academia, Sala de Reunioes, Auditorio, Enfermaria e Laboratorios",
        "Deck 5 — Engenharia em dois niveis",
      ],
      imagens: [
        "/img/historico/DS6 - logo FINAL.png",
        "/img/historico/Estacoes Venture 01_003.jpg", "/img/historico/Estacoes Venture 01_004.jpg",
        "/img/historico/Estacoes Venture 01_005.jpg", "/img/historico/Estacoes Venture 01_006.jpg",
        "/img/historico/Estacoes Venture 01_007.jpg", "/img/historico/Estacoes Venture 01_008.jpg",
        "/img/historico/Estacoes Venture 01_009.jpg", "/img/historico/Estacoes Venture 01_010.jpg",
        "/img/historico/Estacoes Venture 01_011.jpg", "/img/historico/Estacoes Venture 01_012.jpg",
        "/img/historico/Estacoes Venture 01_013.jpg", "/img/historico/Estacoes Venture 01_014.jpg",
        "/img/historico/Estacoes Venture 01_015.jpg", "/img/historico/Estacoes Venture 01_016.jpg",
      ],
    },
    {
      titulo: "Doca Espacial",
      cor: "var(--lcars-gold)",
      texto: "A Doca Espacial do Grupo USS Venture foi desenvolvida para abrigar e realizar reparos externos nas naves da Frota Venture apos as diversas missoes realizadas em territorio Cardassiano e da Federacao. Esta Doca Espacial estava em orbita do Planeta Trivas Prime no complexo orbital da Land.",
      imagens: [],
    },
  ];

  return (
    <div>
      <div className="lcars-hero">
        <h1>Estacoes Espaciais</h1>
        <div className="subtitle">Infraestrutura Orbital da Frota Venture</div>
      </div>

      <div className="lcars-bar" style={{ background: 'linear-gradient(90deg, var(--lcars-sky), var(--lcars-orange), var(--lcars-teal))' }} />

      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: '30px' }}>
          <div className="lcars-panel" style={{ borderColor: s.cor }}>
            <div className="lcars-panel-header" style={{ background: s.cor, color: '#000' }}>
              <span>{s.titulo}</span>
              {s.data && (
                <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>{s.data}</span>
              )}
            </div>
            <div className="lcars-panel-body">
              {s.construtor && (
                <div style={{ marginBottom: '12px' }}>
                  <span className="lcars-badge orange" style={{ fontSize: '0.7rem' }}>
                    Construtor: {s.construtor}
                  </span>
                </div>
              )}

              {s.lema && (
                <blockquote style={{
                  borderLeft: `3px solid ${typeof s.cor === 'string' && s.cor.startsWith('var') ? '#FF9900' : s.cor}`,
                  margin: '0 0 16px 0', padding: '10px 16px',
                  fontStyle: 'italic', color: 'var(--lcars-tanoi)',
                  background: 'rgba(255,153,0,0.05)', borderRadius: '0 var(--lcars-radius-sm) var(--lcars-radius-sm) 0',
                }}>
                  &ldquo;{s.lema}&rdquo;
                </blockquote>
              )}

              <p style={{ marginBottom: '12px', lineHeight: '1.8' }}>{s.texto}</p>

              {s.textoExtra && (
                <p style={{ color: 'var(--lcars-text-dim)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '12px' }}>
                  {s.textoExtra}
                </p>
              )}

              {/* Decks */}
              {s.decks && (
                <div style={{
                  background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--lcars-radius-sm)',
                  padding: '14px 18px', marginTop: '12px',
                }}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '2px', color: s.cor, marginBottom: '10px',
                  }}>
                    Configuracao dos Decks
                  </div>
                  {s.decks.map((deck, j) => (
                    <div key={j} style={{
                      padding: '6px 0', borderBottom: j < s.decks.length - 1 ? '1px solid #222' : 'none',
                      fontSize: '0.85rem', color: 'var(--lcars-text-light)',
                    }}>
                      <span style={{ color: 'var(--lcars-orange)', marginRight: '6px' }}>▸</span>
                      {deck}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Image gallery */}
          {s.imagens && s.imagens.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${s.imagens.length > 6 ? '180px' : '220px'}, 1fr))`,
              gap: '8px',
              marginTop: '8px',
            }}>
              {s.imagens.map((img, j) => (
                <div key={j} style={{
                  borderRadius: 'var(--lcars-radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid #333',
                  background: 'var(--lcars-bg-panel)',
                }}>
                  <img
                    src={img}
                    alt={`${s.titulo} ${j + 1}`}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Link href="/historico" className="lcars-btn lavender"
          style={{ fontSize: '0.8rem', padding: '8px 24px', display: 'inline-block' }}>
          ← Voltar ao Historico
        </Link>
      </div>
    </div>
  );
}
