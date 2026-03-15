// ============================================
// BANCO DE DADOS — Acesso aos registros da Frota
// Modulo de leitura dos bancos de dados de pessoal
// ============================================

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function loadJSON(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

// Dados hardcoded para divisoes, patentes, naves, lore
// (serao carregados diretamente nos components)

export function getTripulantes() {
  return loadJSON('tripulantes.json');
}

export function getFichas() {
  return loadJSON('fichas.json');
}

export function getFichaStats() {
  const fichas = getFichas();
  const divisoes = {};
  fichas.forEach(f => {
    const d = f.divisao || 'N/A';
    divisoes[d] = (divisoes[d] || 0) + 1;
  });
  return { total: fichas.length, divisoes };
}

export function getDivisoes() {
  const fichas = getFichas();
  // Count per division from real data
  const counts = {};
  fichas.forEach(f => {
    const d = (f.divisao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    counts[d] = (counts[d] || 0) + 1;
  });

  const divDefs = [
    { nome: "Comando", key: "comando", cor: "#CC6666", corNome: "Vermelho", chefe: "RonnAndrew", desc: "Oficiais mais graduados do Grupo USS Venture. Responsaveis pela lideranca estrategica e tomada de decisoes." },
    { nome: "Academia", key: "academia", cor: "#999999", corNome: "Cinza", chefe: "Achila16", desc: "Tripulantes em treinamento ou reciclagem, ainda nao designados a divisao especifica." },
    { nome: "Ciencias", key: "ciencias", cor: "#6688CC", corNome: "Azul", chefe: "Marchezini Winchester", desc: "Responsavel por experimentos cientificos, novas tecnologias, pesquisa, astronomia. Inclui a Divisao Medica." },
    { nome: "Comunicacoes", key: "comunicacoes", cor: "#66CC66", corNome: "Verde", chefe: "Tvashtar Uriza", desc: "Emissao de Press Releases, presenca do Grupo nos meios de comunicacao no SL e Web." },
    { nome: "Engenharia", key: "engenharia", cor: "#FFAA00", corNome: "Amarelo", chefe: "Laizamia", desc: "Construtores e criadores do Grupo. Construir e manter estruturas, naves, artes, armas. Bureau de Design de Naves." },
    { nome: "Operacoes", key: "operacoes", cor: "#FFAA00", corNome: "Amarelo", chefe: "Ludmilla Benoir", desc: "Operacoes do dia-a-dia: Pessoal, Suprimentos, Logistica, Eventos, Treinamentos, Simulacoes e RPG." },
    { nome: "Tatico", key: "tatico", cor: "#CC6666", corNome: "Vermelho", chefe: "DanielRoma", desc: "Taticas de combate e defesa, pessoais e em estacoes/naves. Armamentos e equipamentos de combate." },
    { nome: "Civil", key: "civil", cor: "#888888", corNome: "N/A", chefe: "", desc: "Pessoal pertencente ao grupo porem nao faz parte da Frota Estelar." },
    { nome: "Baixa", key: "baixa", cor: "#884444", corNome: "N/A", chefe: "", desc: "Tripulantes desligados do servico ativo por motivos diversos." },
    { nome: "Reserva", key: "reserva", cor: "#666666", corNome: "N/A", chefe: "", desc: "Oficiais que nao estao em servico ativo. Podem ser convocados para missoes especiais ou eventos." },
  ];

  return divDefs.map(d => ({
    slug: d.key,
    nome: d.nome,
    cor: d.cor,
    corNome: d.corNome,
    qtd: counts[d.key] || 0,
    chefe: d.chefe,
    desc: d.desc,
  }));
}

export function getDivisaoBySlug(slug) {
  return getDivisoes().find(d => d.slug === slug) || null;
}

export function getTripulantesByDivisao(divisaoSlug) {
  const fichas = getFichas();
  return fichas.filter(f => {
    const d = (f.divisao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return d === divisaoSlug;
  });
}

export function getPatentes() {
  return [
    { nome: "Almirante", hierarquia: 1, desc: "Patente mais alta da Frota Venture. Responsavel pelo comando geral." },
    { nome: "Vice-Almirante", hierarquia: 2, desc: "Segundo em comando da Frota. Auxilia o Almirante na coordenacao estrategica." },
    { nome: "Comodoro", hierarquia: 3, desc: "Oficial superior responsavel por coordenar esquadras ou divisoes estrategicas." },
    { nome: "Capitao", hierarquia: 4, desc: "Comandante de nave estelar. Autoridade maxima a bordo." },
    { nome: "Comandante", hierarquia: 5, desc: "Segundo em comando. Pode assumir o comando na ausencia do Capitao." },
    { nome: "Tenente Comandante", hierarquia: 6, desc: "Oficial intermediario entre Tenente e Comandante. Geralmente chefes de departamento." },
    { nome: "Tenente", hierarquia: 7, desc: "Oficial com experiencia. Lidera equipes e participa de missoes criticas." },
    { nome: "Tenente Junior", hierarquia: 8, desc: "Oficial em desenvolvimento. Apoia tenentes e comandantes em suas funcoes." },
    { nome: "Alferes", hierarquia: 9, desc: "Primeiro posto oficial apos a graduacao na Academia. Inicio da carreira ativa." },
    { nome: "Cadete", hierarquia: 10, desc: "Tripulante em treinamento na Academia da Venture." },
    { nome: "Tripulante Classe 2", hierarquia: 11, desc: "Tripulante em fase inicial de integracao ao grupo." },
    { nome: "Tripulante Classe 3", hierarquia: 12, desc: "Tripulante recem-admitido no grupo." },
    { nome: "Recruta", hierarquia: 13, desc: "Nivel inicial. Recem-chegado ao Grupo USS Venture." },
  ];
}

export function getNaves() {
  return [
    {
      slug: "adventure", nome: "USS Adventure NCC 74508", classe: "Valiant", comissao: "2010",
      comandante: "Almirante Elemer Piek", tipo: "Exploracao", status: "Ativa",
      desc: "Lema: Buscando novos caminhos...",
      lema: "Buscando novos caminhos...",
      selo: "/img/naves/Logo Adventure Final.png",
      esquema: "",
      screenshots: [],
      tripulantes: ["Almirante Elemer Piek (Comandante)"],
      historia: "A USS Adventure NCC 74508 foi comissionada em 2010 para missoes de exploracao. Sob o comando do Almirante Elemer Piek, seu lema 'Buscando novos caminhos...' reflete o espirito de descoberta da Frota Venture."
    },
    {
      slug: "altotting", nome: "USS Altotting NCC 171133", classe: "Nao informada", comissao: "2022",
      comandante: "Capitao RonnAndrew", tipo: "Patrulhamento", status: "Ativa",
      desc: "Nave de patrulhamento comissionada em 2022.",
      lema: "Segunda estrela a direita...",
      selo: "/img/naves/LOGO_ALTOTTING.png",
      esquema: "",
      screenshots: [],
      tripulantes: ["Capitao RonnAndrew (Comandante)"],
      historia: "A USS Altotting NCC 171133 foi comissionada em 2022 para missoes de patrulhamento e exploracao, sob o comando do Capitao RonnAndrew. Seu lema 'Segunda estrela a direita...' homenageia a famosa frase de Star Trek."
    },
    {
      slug: "andor", nome: "USS Andor NX 92095", classe: "Nao informada", comissao: "2010",
      comandante: "Nao informado", tipo: "Exploracao", status: "Descomissionada",
      desc: "Nave de exploracao descomissionada em 2014.",
      lema: "",
      selo: "/img/naves/Andor logo FINAL.png",
      esquema: "",
      screenshots: [],
      tripulantes: [],
      historia: "A USS Andor NX 92095 foi comissionada em 2010 como nave de exploracao. Descomissionada em 2014, a Andor foi imortalizada no primeiro fanfilme brasileiro de Star Trek: 'Star Trek USS Andor - Phoenix', partes 1 e 2."
    },
    {
      slug: "nautilus", nome: "USS Nautilus NCC 38187", classe: "Nao informada", comissao: "2010",
      comandante: "Capitao B7Web Xue (In Memoriam)", tipo: "Cientifica", status: "Descomissionada",
      desc: "Descomissionada em tributo ao Capitao B7Web Xue.",
      lema: "",
      selo: "/img/naves/LOGO_NAUTILUS-2017-01.jpg",
      esquema: "",
      screenshots: [],
      tripulantes: ["Capitao B7Web Xue (Comandante — In Memoriam)"],
      historia: "A USS Nautilus NCC 38187 foi comissionada em 2010 como a principal nave cientifica da Frota Venture, sob o comando do Capitao B7Web Xue. Descomissionada em tributo ao seu comandante. A Nautilus e seu legado cientifico permanecem como homenagem eterna ao Capitao B7Web Xue. Que sua memoria viva longa e prosper."
    },
    {
      slug: "rerum", nome: "USS Rerum NCC 61913", classe: "Nao informada", comissao: "2017",
      comandante: "Capitao Jeff (In Memoriam)", tipo: "Nao informado", status: "Descomissionada",
      desc: "Descomissionada em tributo ao Capitao Jeff.",
      lema: "",
      selo: "/img/naves/Rerum Simbolo PNG.png",
      esquema: "/img/naves/Rerum Detalhes.jpg",
      screenshots: [],
      tripulantes: ["Capitao Jeff (Comandante — In Memoriam)"],
      historia: "A USS Rerum NCC 61913 foi comissionada em 2017 sob o comando do Capitao Jeff. Descomissionada em tributo ao seu comandante, que faleceu. A Rerum e seus dados tecnicos LCARS permanecem como homenagem eterna a um grande oficial da Frota Venture. Sua dedicacao nunca sera esquecida."
    },
    {
      slug: "serenity", nome: "USS Serenity NCC 7777", classe: "Scouter Ship", comissao: "2022",
      comandante: "Capitao Marchezini Winchester", tipo: "Explorador", status: "Ativa",
      desc: "Nave exploradora comandada por Marchezini Winchester.",
      lema: "Desvendando o universo",
      selo: "/img/naves/LOGO USS Serenity NCC7777.png",
      esquema: "",
      screenshots: [],
      tripulantes: ["Capitao Marchezini Winchester (Comandante)"],
      historia: "A USS Serenity NCC 7777 foi comissionada em 2022 como nave exploradora. Sob o comando do Capitao Marchezini Winchester, seu lema 'Desvendando o universo' guia a tripulacao em missoes de exploracao de espaco profundo."
    },
    {
      slug: "suidara", nome: "USS Suidara NCC 7808", classe: "Nao informada", comissao: "2014",
      comandante: "Capitao Kharan Resident", tipo: "Nao informado", status: "Ativa",
      desc: "Comissionada em 2014.",
      lema: "",
      selo: "/img/naves/suidara emblema modificado.png",
      esquema: "",
      screenshots: [],
      tripulantes: ["Capitao Kharan Resident (Comandante)"],
      historia: "A USS Suidara NCC 7808 foi comissionada em 2014, entrando em servico para substituir operacoes de patrulha apos o descomissionamento da USS Andor."
    },
  ];
}

export function getNaveBySlug(slug) {
  return getNaves().find(n => n.slug === slug) || null;
}

export function getContos() {
  const data = loadJSON('contos.json');
  return data.arcos || [];
}

export function getContoBySlug(slug) {
  const arcos = getContos();
  for (const arco of arcos) {
    for (const cap of arco.capitulos) {
      if (cap.slug === slug) {
        return { arco, capitulo: cap };
      }
    }
  }
  return null;
}

export function getAllContoSlugs() {
  const arcos = getContos();
  const slugs = [];
  for (const arco of arcos) {
    for (const cap of arco.capitulos) {
      slugs.push(cap.slug);
    }
  }
  return slugs;
}
