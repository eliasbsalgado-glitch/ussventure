// ============================================
// PROJETO TERRA PRIME — Culturas Star Trek
// Registro das edificacoes culturais na Land
// ============================================

import Link from 'next/link';

export const metadata = {
  title: 'Projeto Terra Prime — USS Venture',
  description: 'O Projeto Terra Prime resgata as culturas e racas do Universo Star Trek no Second Life.',
};

export default function TerraPrimePage() {
  const sections = [
    {
      titulo: "O Projeto Terra Prime",
      cor: "var(--lcars-teal)",
      texto: "A expressao TERRA PRIME surgiu no Universo de Jornada nas Estrelas (Star Trek) em 2154 como a auto denominacao de um Grupo Terrorista do seculo 22, que tinha o objetivo de expulsar todos os alienigenas do Planeta Terra. O Grupo USS Venture resgatou este fato para batizar um Projeto que busca resgatar as mais importantes culturas e especies do Universo Star Trek, trazendo essas culturas para mais proximo de todos nos, mostrando que o respeito as diferencas, sejam elas de racas ou culturas, somente enobrece o Espirito do Universo Star Trek.",
      textoExtra: "O Projeto Terra Prime foi implantado ao longo dos anos em diversas 'Lands' do Grupo no Second Life com o objetivo de representar em nosso ambiente virtual 3D, dentro do meta-universo do Second Life, culturas e racas diferentes, atraves da construcao de planetas inteiros, edificacoes, naves ou estacoes espaciais.",
      imagens: ["/img/historico/Projeto_Terra_prime01.jpg"],
    },
    {
      titulo: "Tribunal Klingon",
      cor: "var(--lcars-red)",
      data: "Data Estelar 20090315",
      construtor: "Shran Zeid",
      texto: "Uma das primeiras edificacoes do Projeto Terra Prime. O Tribunal Klingon foi mostrado no sexto filme para o cinema (Jornada nas Estrelas VI: A Terra Desconhecida) e no episodio da 2a. Temporada de Enterprise. Se localiza no Planeta Natal Klingon Kronos e foi palco do julgamento do Capitao James T. Kirk, Dr. Leonard McCoy e o Capitao Jonathan Archer.",
      textoExtra: "O Tribunal Klingon e utilizado para diversas funcoes, mas a principal e servir de palco para as cerimonias de promocao de patentes e entregas de medalhas. Tambem e o Quartel Central da Divisao de Seguranca da Venture. No subsolo encontra-se o Stand de Tiro e cenarios de treinamento.",
      imagens: ["/img/historico/grupou10.jpg", "/img/historico/Tribunal01.jpg", "/img/historico/Tribunal02.jpg", "/img/historico/Tribunal03.jpg"],
    },
    {
      titulo: "Templo Vulcano de P'Jem",
      cor: "var(--lcars-orange)",
      data: "Data Estelar 20090315",
      construtor: "Trinitymatrixjf Aya",
      texto: "O Templo Vulcano de P'Jem foi visto pela primeira vez no episodio da 1a. Temporada de Enterprise (ENT: 1x15 - Shadows of P'Jem), onde fomos apresentados as historias de conflitos e intrigas entre os povos Vulcano e Andoriano.",
      textoExtra: "O Templo e uma replica do original e serve de palco para cerimonias diversas, inclusive casamentos. Assim como no Templo original, no subsolo encontra-se o Posto de Escuta Vulcano acessado por uma passagem secreta. Sofreu grande reforma por B7Web Xue e Neeo Andel.",
      imagens: ["/img/historico/grupou11.jpg", "/img/historico/Vulcano01.jpg", "/img/historico/Vulcano02.jpg", "/img/historico/Vulcano03.jpg"],
    },
    {
      titulo: "Senado Romulano",
      cor: "var(--lcars-purple)",
      data: "Data Estelar 20100228",
      construtor: "B7Web Xue",
      texto: "O Senado Romulano representa a cultura e o povo Romulano, que apesar de inimigo da Federacao, sao uma cultura rica e importante para o Universo Star Trek. O Senado apareceu em inumeros episodios das diversas series e filmes.",
      textoExtra: "Utilizado para reunioes gerais dos membros do Grupo. No segundo pavimento temos as representacoes de Grupos Star Trek do Second Life, constituindo um lugar diplomatico por essencia — abrigando embaixadas de grupos nacionais e internacionais.",
      imagens: ["/img/historico/grupou12.jpg", "/img/historico/Senado01.jpg", "/img/historico/Senado02.jpg", "/img/historico/Senado03.jpg"],
    },
    {
      titulo: "Praia de Risa",
      cor: "var(--lcars-green)",
      data: "Data Estelar 20100115",
      construtor: "Neeo Andel",
      texto: "As ferias no Universo Star Trek nao podem ser completas sem uma estadia no Planeta Risa e em suas belissimas praias. Hospedar-se nestes Resorts a beira mar e uma experiencia unica para qualquer oficial da Frota Estelar. Risa apareceu em diversos episodios do Universo Star Trek.",
      textoExtra: "A funcao basica da Praia de Risa e o lazer e relaxamento da Tripulacao no Second Life. Foi inaugurada quando a terra-formacao da Land foi finalizada.",
      imagens: ["/img/historico/Risa01.jpg", "/img/historico/Risa02.jpg", "/img/historico/Risa03.jpg"],
    },
    {
      titulo: "Jardins Betazoides",
      cor: "var(--lcars-lavender)",
      data: "Data Estelar 20090315",
      construtor: "Priscila Perl",
      texto: "Os Jardins Betazoides apareceram primeiramente em um episodio da Nova Geracao, como sendo os mais belos jardins dos planetas da Federacao. Lugar de tranquilidade e paz para o povo Betazoide, que devido as suas habilidades telepaticas, podem escutar os pensamentos dos demais seres.",
      textoExtra: "No Jardim temos areas destinadas a meditacao, reunioes ao ar livre e Tai Chi, alem de fazer parte do complexo do Museu do Grupo USS Venture.",
      imagens: ["/img/historico/Jardim_Beta_01.jpg", "/img/historico/Jardim_Beta_02.jpg", "/img/historico/Jardim_Beta_03.jpg"],
    },
    {
      titulo: "Laboratorio Subaquatico Dra. Gillian Taylor",
      cor: "var(--lcars-sky)",
      data: "Data Estelar 20101023",
      construtor: "Neeo Andel",
      texto: "Uma homenagem ao 4o filme de cinema: Star Trek - The Voyage Home (Jornada nas Estrelas IV: A Volta Para Casa). O Laboratorio foi batizado com o nome da Dra. Gillian Taylor que trouxe dois exemplares de baleias Jubarte do seculo XX para o seculo XXIII.",
      textoExtra: "O laboratorio esta cercado de uma exuberante vida marinha. Cabe ressaltar a presenca de Gracie, a baleia femea Jubarte. Neste ambiente marinho podemos ver semi-destruida a nave Klingon utilizada pelo Almirante James T. Kirk.",
      imagens: ["/img/historico/Lab_Sub_001.jpg", "/img/historico/Lab_Sub_002.jpg", "/img/historico/Lab_Sub_004.jpg", "/img/historico/Lab_Sub_005.jpg", "/img/historico/Lab_Sub_006.jpg", "/img/historico/Lab_Sub_007.jpg"],
    },
  ];

  return (
    <div>
      <div className="lcars-hero">
        <h1>Projeto Terra Prime</h1>
        <div className="subtitle">Culturas e Civilizacoes do Universo Star Trek</div>
      </div>

      <div className="lcars-bar" style={{ background: 'linear-gradient(90deg, var(--lcars-teal), var(--lcars-green), var(--lcars-sky))' }} />

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
              <p style={{ marginBottom: '12px', lineHeight: '1.8' }}>{s.texto}</p>
              {s.textoExtra && (
                <p style={{ color: 'var(--lcars-text-dim)', lineHeight: '1.7', fontSize: '0.9rem' }}>
                  {s.textoExtra}
                </p>
              )}
            </div>
          </div>

          {/* Image gallery */}
          {s.imagens && s.imagens.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${s.imagens.length > 3 ? '200px' : '250px'}, 1fr))`,
              gap: '8px',
              marginTop: '8px',
            }}>
              {s.imagens.map((img, j) => (
                <div key={j} style={{
                  borderRadius: 'var(--lcars-radius-sm)',
                  overflow: 'hidden',
                  border: `1px solid ${typeof s.cor === 'string' && s.cor.startsWith('var') ? '#333' : s.cor}`,
                  background: 'var(--lcars-bg-panel)',
                }}>
                  <img
                    src={img}
                    alt={`${s.titulo} ${j + 1}`}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
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
