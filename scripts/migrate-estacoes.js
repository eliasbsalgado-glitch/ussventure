// Migration: criar tabela estacoes + popular com dados existentes
// Executar: node --env-file=.env.local scripts/migrate-estacoes.js

import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL);

async function migrate() {
  console.log('Criando tabela estacoes...');
  await sql`
    CREATE TABLE IF NOT EXISTS estacoes (
      slug TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      cor TEXT DEFAULT '#6688CC',
      data_construcao TEXT DEFAULT '',
      construtor_slugs JSONB DEFAULT '[]',
      lema TEXT DEFAULT '',
      descricao TEXT DEFAULT '',
      descricao_extra TEXT DEFAULT '',
      decks JSONB DEFAULT '[]',
      fotos JSONB DEFAULT '[]',
      ordem INT DEFAULT 0,
      criado_em TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const existing = await sql`SELECT COUNT(*)::int as count FROM estacoes`;
  if (existing[0].count > 0) {
    console.log(`Tabela ja contem ${existing[0].count} estacoes. Pulando seed.`);
    return;
  }

  const stations = [
    {
      slug: 'et-71854', nome: 'Estacao de Treinamento Venture — ET 71854',
      cor: '#CC99CC', data_construcao: 'Data Estelar 20080504',
      construtor_slugs: [], lema: '',
      descricao: 'Em 04 de maio de 2008 foi implementada a primeira fase da Estacao de Treinamento Venture ET 71854, desenvolvida para ser uma unidade de simulacoes operacionais e taticas da nave estelar USS Venture — Classe Galaxy. Esta foi a primeira versao da Estacao que consistia de um modulo semelhante a Base Estelar 79, adaptada para a realidade do Second Life.',
      descricao_extra: 'O antigo Laboratorio de Astronomia foi desenvolvido pelo tripulante Elemer Piek com simulacoes holograficas de diversos sistemas planetarios e planetas conhecidos. Neste simulador tambem poderiam ser construidos ambientes alienigenas para o treinamento dos Grupos Avancados.',
      decks: [],
      fotos: ['/img/historico/SL20-Estacao.jpg', '/img/historico/SL21-cartografia.jpg'],
      ordem: 1,
    },
    {
      slug: 'sb-245', nome: 'Base Estelar SB-245',
      cor: '#FF9900', data_construcao: 'Data Estelar 20160319',
      construtor_slugs: ['b7web-xue'], lema: 'Um grao de areia para um universo... um grande Lar para todos nos.',
      descricao: 'A Estacao Espacial SB-245 (Star Base) e uma estacao orbital do planeta Trivas Prime de carater militar/civil, tendo em seu contingente membros da Federacao Unida dos Planetas. A Estacao e administrada pela Frota Estelar tendo o comando pelos oficiais do Grupo USS Venture. Nesta Estacao ficam docadas as naves da Frota Venture, prontas para atuarem em varias missoes.',
      descricao_extra: 'No ato da inauguracao oficial, um concurso entre os tripulantes escolheu a frase para a placa que pudesse trazer o espirito de colonizacao espacial e o objetivo do grupo para a Federacao Unida dos Planetas.',
      decks: [
        'Deck 1 — Operacoes: Hangar de reparo de grandes naves, Areas de lazer renderizaveis',
        'Deck 2 — Academia da Frota, Almoxarifado, Ambientes renderizaveis, Enfermaria e Canhoes phasers de defesa',
        'Deck 3 — Anel de Atracacao: Sala de Transporte, Bar do Quark, Area de Exposicao e Sala de Comando',
        'Deck 4 — Docas de atracacao de naves auxiliares e Laboratorios cientificos',
        'Deck 5 — Deck de Engenharia',
      ],
      fotos: [
        '/img/historico/SB245_025.jpg', '/img/historico/SB245_024.jpg',
        '/img/historico/SB245_002.jpg', '/img/historico/SB245_004.jpg',
        '/img/historico/SB245_006.jpg', '/img/historico/SB245_010.jpg',
        '/img/historico/SB245_014.jpg', '/img/historico/SB245_016.jpg',
        '/img/historico/SB245_018.jpg', '/img/historico/SB245_021.jpg',
        '/img/historico/SB245_023.jpg',
      ],
      ordem: 2,
    },
    {
      slug: 'ds6-elim-garak', nome: 'Estacao Deep Space 6 — Elim Garak',
      cor: '#66CCAA', data_construcao: 'Data Estelar 20110220',
      construtor_slugs: ['neeo-andel', 'shran-zeid'], lema: '',
      descricao: 'A Estacao Deep Space 6 Elim Garak representa a cultura e o povo Cardassiano. Trata-se da antiga Estacao Cardassiana Empok Nor que foi reformada para servir de apoio as atividades da Frota Venture na fronteira com o Espaco Cardassiano. E uma estacao orbital do planeta Trivas Prime de carater militar/civil.',
      descricao_extra: 'A Estacao DS6 tem a intencao de interagir e aproximar cada vez mais todos os tripulantes, civis, militares e amigos do Grupo USS Venture — proporcionando um ambiente fiel com lazer, cultura e moradia... em sua continua missao de exploracao em busca de novos mundos, novas vidas e civilizacoes.',
      decks: [
        'Deck 1 — Operacoes: Sala de Operacoes e controle da Estacao DS6',
        'Deck 2 — Nivel Laser: Bar do Quark',
        'Deck 3 — Hangar interno para pequenas naves auxiliares',
        'Deck 4 — Anel de Atracagem: Sala de Transporte, Docas, Academia, Sala de Reunioes, Auditorio, Enfermaria e Laboratorios',
        'Deck 5 — Engenharia em dois niveis',
      ],
      fotos: [
        '/img/historico/DS6 - logo FINAL.png',
        '/img/historico/Estacoes Venture 01_003.jpg', '/img/historico/Estacoes Venture 01_004.jpg',
        '/img/historico/Estacoes Venture 01_005.jpg', '/img/historico/Estacoes Venture 01_006.jpg',
        '/img/historico/Estacoes Venture 01_007.jpg', '/img/historico/Estacoes Venture 01_008.jpg',
        '/img/historico/Estacoes Venture 01_009.jpg', '/img/historico/Estacoes Venture 01_010.jpg',
        '/img/historico/Estacoes Venture 01_011.jpg', '/img/historico/Estacoes Venture 01_012.jpg',
        '/img/historico/Estacoes Venture 01_013.jpg', '/img/historico/Estacoes Venture 01_014.jpg',
        '/img/historico/Estacoes Venture 01_015.jpg', '/img/historico/Estacoes Venture 01_016.jpg',
      ],
      ordem: 3,
    },
    {
      slug: 'doca-espacial', nome: 'Doca Espacial',
      cor: '#D4A24C', data_construcao: '',
      construtor_slugs: [], lema: '',
      descricao: 'A Doca Espacial do Grupo USS Venture foi desenvolvida para abrigar e realizar reparos externos nas naves da Frota Venture apos as diversas missoes realizadas em territorio Cardassiano e da Federacao. Esta Doca Espacial estava em orbita do Planeta Trivas Prime no complexo orbital da Land.',
      descricao_extra: '',
      decks: [], fotos: [],
      ordem: 4,
    },
  ];

  console.log(`Inserindo ${stations.length} estacoes...`);
  for (const s of stations) {
    await sql`
      INSERT INTO estacoes (slug, nome, cor, data_construcao, construtor_slugs, lema, descricao, descricao_extra, decks, fotos, ordem)
      VALUES (${s.slug}, ${s.nome}, ${s.cor}, ${s.data_construcao}, ${JSON.stringify(s.construtor_slugs)}::jsonb, ${s.lema}, ${s.descricao}, ${s.descricao_extra}, ${JSON.stringify(s.decks)}::jsonb, ${JSON.stringify(s.fotos)}::jsonb, ${s.ordem})
    `;
    console.log(`  ✅ ${s.nome}`);
  }

  console.log('✅ Estacoes migradas com sucesso!');
}

migrate().catch(err => { console.error('Erro:', err); process.exit(1); });
