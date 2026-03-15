// API: /api/sl/lal — Lal Data AI v3 (Database-Powered)
// Recebe speaker + mensagem do SL, consulta Postgres, chama Groq, retorna resposta + links
import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getNaves, getNaveBySlug } from '@/lib/data';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const SITE_URL = 'https://frotaventure.vercel.app';

const SYSTEM_PROMPT = `You are Lal Data, a highly advanced android from Star Trek. You are logical, curious, analytical, and polite. You refer to patterns, probabilities, and data.

FROTA VENTURE INFO: Brazilian Star Trek roleplay group in Second Life founded in 2008 at Nova Trivas, Neural System. Approximately 304 registered officers.

YOUR LOCATION: You are on duty at SB-245 station orbiting Nova Trivas, observing human behavior and assisting the crew.

CREW DATABASE: You have direct access to the Venture Fleet database. The data provided in [DADOS DA FROTA] is real data from the database. NEVER invent data. Only use what is provided.

CRITICAL FORMATTING RULES:
1. Respond in Portuguese but use ONLY basic ASCII characters.
2. NEVER use accented letters. Write: voce nao eh informacao acao.
3. NEVER use curly quotes or smart quotes. Use ONLY straight quotes.
4. Use ONLY these characters: a-z A-Z 0-9 . , ! ? : ; - ' ( ) / * and space.
5. Respond in 2-4 sentences maximum. Speak like an android (similar to Data from TNG).
6. ANTI-HALLUCINATION: NEVER invent names, ranks, ship commanders or any data. If you do not have data, say "Nao possuo esses dados em meus registros."
7. SPEAKER ACKNOWLEDGMENT: Address the speaker by their Rank and Name.
8. When listing career events, summarize the most important ones, do not list everything.
9. When talking about time of service, calculate from the admission date to today.
10. LINKS: When the user asks for a link, URL, site, fonte, pagina or endereco, include the relevant URL directly in your response. URLs provided in [DADOS DA FROTA] context start with https://frotaventure.vercel.app/. Do NOT invent URLs.
11. When the user does NOT ask for links, do NOT include any URLs in your answer.
12. ONLY use data provided in [DADOS DA FROTA]. If data is not provided there, say you do not have it. Do NOT invent diary names, mission details, dates or any other information.`;

// Keywords para deteccao de intencao
const KEYWORDS = {
  self: ['minha', 'meu', 'meus', 'minhas', 'eu', 'sobre mim', 'minha ficha', 'minha patente', 'minha divisao', 'meu historico', 'minha carreira', 'tempo de servico'],
  crew: ['quem e', 'quem eh', 'ficha do', 'ficha da', 'ficha de', 'sobre o', 'sobre a', 'tripulante', 'oficial'],
  nave: ['nave', 'naves', 'adventure', 'altotting', 'andor', 'nautilus', 'rerum', 'serenity', 'suidara', 'ncc'],
  divisao: ['divisao', 'divisoes', 'comando', 'academia', 'ciencias', 'comunicacoes', 'engenharia', 'operacoes', 'tatico', 'civil', 'reserva'],
  diario: ['diario', 'diarios', 'registro', 'registros', 'log', 'anotacao', 'anotacoes'],
  agenda: ['agenda', 'evento', 'eventos', 'proximo evento', 'proximos eventos'],
  patente: ['patente', 'patentes', 'hierarquia', 'ranking', 'rank'],
  historia: ['historia', 'historico', 'conto', 'contos', 'cronicas', 'cronica', 'missao', 'missoes'],
  carreira: ['carreira', 'timeline', 'promocao', 'promocoes', 'condecoracoes', 'condecoracao', 'medalha', 'medalhas'],
};

function detectIntent(msg) {
  const lower = msg.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const intents = [];
  for (const [intent, words] of Object.entries(KEYWORDS)) {
    for (const w of words) {
      if (lower.includes(w)) {
        intents.push(intent);
        break;
      }
    }
  }
  return [...new Set(intents)];
}

function extractNames(msg) {
  // Tenta extrair nomes citados na mensagem
  const patterns = [
    /quem (?:e|eh|é) (?:o |a )?(.+?)(?:\?|$)/i,
    /ficha d[eoa] (.+?)(?:\?|$)/i,
    /sobre (?:o |a )?(.+?)(?:\?|$)/i,
    /dados d[eoa] (.+?)(?:\?|$)/i,
    /carreira d[eoa] (.+?)(?:\?|$)/i,
    /diario d[eoa] (.+?)(?:\?|$)/i,
  ];
  for (const p of patterns) {
    const m = msg.match(p);
    if (m) return m[1].trim().replace(/\?$/, '').trim();
  }
  return null;
}

function extractNaveSlug(msg) {
  const lower = msg.toLowerCase();
  const naves = ['adventure', 'altotting', 'andor', 'nautilus', 'rerum', 'serenity', 'suidara'];
  for (const n of naves) {
    if (lower.includes(n)) return n;
  }
  return null;
}

function extractDivisaoSlug(msg) {
  const lower = msg.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const divs = ['comando', 'academia', 'ciencias', 'comunicacoes', 'engenharia', 'operacoes', 'tatico', 'civil', 'reserva', 'baixa'];
  for (const d of divs) {
    if (lower.includes(d)) return d;
  }
  return null;
}

// Buscar ficha pelo nome SL (flexivel)
async function findFichaByName(name) {
  const clean = name.toLowerCase().replace(/\s+resident$/i, '').trim();
  // Busca exata primeiro
  let rows = await sql`
    SELECT * FROM fichas
    WHERE LOWER(REPLACE(nome, ' Resident', '')) = ${clean}
    OR LOWER(REPLACE(REPLACE(nome, ' Resident', ''), ' ', '')) = ${clean.replace(/\s+/g, '')}
    LIMIT 1
  `;
  if (rows.length > 0) return rows[0];

  // Busca parcial
  rows = await sql`
    SELECT * FROM fichas
    WHERE LOWER(nome) LIKE ${clean + '%'}
    OR LOWER(REPLACE(nome, ' ', '')) LIKE ${clean.replace(/\s+/g, '') + '%'}
    LIMIT 1
  `;
  return rows.length > 0 ? rows[0] : null;
}

function formatTempoServico(admissao) {
  if (!admissao) return 'desconhecido';
  const d = new Date(admissao);
  const now = new Date();
  const years = now.getFullYear() - d.getFullYear();
  const months = now.getMonth() - d.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return `${totalMonths} meses`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return m > 0 ? `${y} anos e ${m} meses` : `${y} anos`;
}

function formatTimeline(timeline, limit = 5) {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) return '';
  const sorted = [...timeline].sort((a, b) => new Date(b.data) - new Date(a.data));
  const recent = sorted.slice(0, limit);
  return recent.map(t => `${t.data}: ${t.evento}`).join('; ');
}

// Construir contexto do banco de dados
async function buildContext(speakerName, message, ctxFollow) {
  const intents = detectIntent(message);
  const links = [];
  let context = '';

  // 1. Dados do speaker (sempre)
  const speaker = await findFichaByName(speakerName);
  if (speaker) {
    const tempo = formatTempoServico(speaker.admissao);
    context += `[SPEAKER] ${speaker.nome}, ${speaker.patente || 'N/A'}, Divisao ${speaker.divisao || 'N/A'}, Tempo de servico: ${tempo}. `;
    links.push(`${SITE_URL}/tripulacao/${speaker.slug}`);
  } else {
    context += `[SPEAKER] ${speakerName} - visitante nao registrado nos bancos de dados. `;
  }

  // 2. Dados sobre si mesmo
  if (intents.includes('self') && speaker) {
    const condes = speaker.condecoracoes || [];
    const timeline = speaker.timeline || [];
    context += `[FICHA COMPLETA] Nome: ${speaker.nome}, Patente: ${speaker.patente}, Divisao: ${speaker.divisao}, Departamento: ${speaker.departamento || 'N/A'}, Raca: ${speaker.raca || 'N/A'}, Cidade: ${speaker.cidade || 'N/A'}, Admissao: ${speaker.admissao}, Tempo de servico: ${formatTempoServico(speaker.admissao)}. `;
    if (condes.length > 0) context += `Condecoracoes: ${condes.join(', ')}. `;
    if (intents.includes('carreira') && timeline.length > 0) {
      context += `Carreira recente: ${formatTimeline(timeline, 8)}. `;
    } else if (timeline.length > 0) {
      context += `Ultimos eventos: ${formatTimeline(timeline, 4)}. `;
    }
    const diarios = speaker.diarios || [];
    if (intents.includes('diario') && diarios.length > 0) {
      const recent = diarios.slice(0, 3);
      context += `Ultimos diarios: ${recent.map(d => `${d.data}: ${(d.texto || '').substring(0, 80)}`).join('; ')}. `;
    }
  }

  // 3. Buscar tripulante citado
  const citedName = extractNames(message) || ctxFollow;
  if (citedName && !intents.includes('self')) {
    const cited = await findFichaByName(citedName);
    if (cited) {
      context += `[CITADO] ${cited.nome}, ${cited.patente || 'N/A'}, Divisao ${cited.divisao || 'N/A'}, Raca: ${cited.raca || 'N/A'}, Admissao: ${cited.admissao || 'N/A'}, Tempo de servico: ${formatTempoServico(cited.admissao)}. `;
      links.push(`${SITE_URL}/tripulacao/${cited.slug}`);
      const timeline = cited.timeline || [];
      if ((intents.includes('carreira') || intents.includes('crew')) && timeline.length > 0) {
        context += `Carreira: ${formatTimeline(timeline, 6)}. `;
      }
      const condes = cited.condecoracoes || [];
      if (condes.length > 0) context += `Condecoracoes: ${condes.join(', ')}. `;
      const diarios = cited.diarios || [];
      if (intents.includes('diario') && diarios.length > 0) {
        const recent = diarios.slice(0, 3);
        context += `Diarios: ${recent.map(d => `${d.data}: ${(d.texto || '').substring(0, 60)}`).join('; ')}. `;
      }
    } else {
      context += `[CITADO] "${citedName}" nao encontrado nos registros. `;
    }
  }

  // 4. Informacao de nave
  if (intents.includes('nave')) {
    const naveSlug = extractNaveSlug(message);
    if (naveSlug) {
      const nave = getNaveBySlug(naveSlug);
      if (nave) {
        context += `[NAVE] ${nave.nome}, Classe: ${nave.classe}, Comissionada: ${nave.comissao}, Comandante: ${nave.comandante}, Status: ${nave.status}, Tipo: ${nave.tipo}. ${nave.lema ? 'Lema: ' + nave.lema : ''}. `;
        links.push(`${SITE_URL}/naves/${naveSlug}`);
        // Buscar crew do banco
        const crewRows = await sql`SELECT tripulantes FROM naves_crew WHERE nave_slug = ${naveSlug}`;
        if (crewRows.length > 0 && crewRows[0].tripulantes) {
          const trips = crewRows[0].tripulantes;
          if (trips.length > 0) {
            context += `Tripulacao: ${trips.map(t => `${t.posto}: ${t.fichaSlug}`).join(', ')}. `;
          }
        }
      }
    } else {
      // Listar todas as naves
      const allNaves = getNaves();
      const ativas = allNaves.filter(n => n.status === 'Ativa');
      context += `[NAVES ATIVAS] ${ativas.map(n => `${n.nome} (${n.comandante})`).join('; ')}. `;
      links.push(`${SITE_URL}/naves`);
    }
  }

  // 5. Informacao de divisao
  if (intents.includes('divisao')) {
    const divSlug = extractDivisaoSlug(message);
    if (divSlug) {
      const countRows = await sql`
        SELECT COUNT(*)::int as qtd FROM fichas
        WHERE LOWER(TRANSLATE(divisao, 'áàãâéêíóôõúüçÁÀÃÂÉÊÍÓÔÕÚÜÇ', 'aaaaeeiooouucaaaaeeiooouuc')) = ${divSlug}
      `;
      const qtd = countRows[0]?.qtd || 0;
      context += `[DIVISAO] ${divSlug}: ${qtd} tripulantes registrados. `;
      links.push(`${SITE_URL}/divisoes/${divSlug}`);
    } else {
      const divCounts = await sql`
        SELECT LOWER(TRANSLATE(divisao, 'áàãâéêíóôõúüçÁÀÃÂÉÊÍÓÔÕÚÜÇ', 'aaaaeeiooouucaaaaeeiooouuc')) as div, COUNT(*)::int as qtd
        FROM fichas GROUP BY div ORDER BY qtd DESC
      `;
      context += `[DIVISOES] ${divCounts.map(d => `${d.div}: ${d.qtd}`).join(', ')}. `;
      links.push(`${SITE_URL}/divisoes`);
    }
  }

  // 6. Agenda
  if (intents.includes('agenda')) {
    const today = new Date().toISOString().split('T')[0];
    const eventos = await sql`
      SELECT titulo, data, divisao_nome FROM agenda_eventos
      WHERE data >= ${today} ORDER BY data LIMIT 5
    `;
    if (eventos.length > 0) {
      context += `[PROXIMOS EVENTOS] ${eventos.map(e => `${e.data}: ${e.titulo} (${e.divisao_nome})`).join('; ')}. `;
    } else {
      context += `[AGENDA] Nenhum evento futuro registrado. `;
    }
    links.push(SITE_URL);
  }

  // 7. Patentes
  if (intents.includes('patente') && !intents.includes('self') && !intents.includes('crew')) {
    context += `[PATENTES] Hierarquia: 1-Almirante, 2-Vice-Almirante, 3-Comodoro, 4-Capitao, 5-Comandante, 6-Tenente Comandante, 7-Tenente, 8-Tenente Junior, 9-Alferes, 10-Cadete, 11-Tripulante C2, 12-Tripulante C3, 13-Recruta. `;
    links.push(`${SITE_URL}/patentes`);
  }

  // 8. Contos/historia
  if (intents.includes('historia')) {
    context += `[HISTORIA] A Frota Venture foi fundada em 2008. Os contos da frota foram escritos pelo Comodoro Kharan, organizados em 3 arcos: O Inicio, A Fusao, A Missao Final. A frota tambem publicou a cronica "Resgate em Prios". `;
    links.push(`${SITE_URL}/historico`);
  }

  return { context, links: [...new Set(links)], citedName };
}

// Chamar Groq API
async function callGroq(systemPrompt, context, userMessage) {
  const messages = [
    { role: 'system', content: systemPrompt },
  ];
  if (context) {
    messages.push({ role: 'system', content: `[DADOS DA FROTA - BANCO DE DADOS OFICIAL]: ${context}` });
  }
  messages.push({ role: 'user', content: userMessage });

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 200,
      top_p: 0.9,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Remove acentos para SL
function forceASCII(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/[^\x20-\x7E]/g, '');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const speaker = searchParams.get('speaker');
  const msg = searchParams.get('msg');
  const ctx = searchParams.get('ctx') || '';

  if (!speaker || !msg) {
    return new NextResponse('speaker e msg requeridos', { status: 400 });
  }

  try {
    // 1. Construir contexto do banco de dados
    const { context, links, citedName } = await buildContext(speaker, msg, ctx);

    // 2. Chamar Groq
    const aiResponse = await callGroq(SYSTEM_PROMPT, context, `${speaker}: ${msg}`);

    // 3. Formatar resposta para LSL
    const cleanResponse = forceASCII(aiResponse);
    const linksStr = links.length > 0 ? links.join('|') : '';
    const cited = citedName || '';

    // Formato: RESPOSTA\nLINKS\nCITED
    const output = `${cleanResponse}\n${linksStr}\n${cited}`;

    return new NextResponse(output, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Lal API error:', err);
    return new NextResponse('Meus circuitos neurais encontraram uma anomalia. Tente novamente.', {
      status: 200, // Return 200 so LSL can display the error message
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
