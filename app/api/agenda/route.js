// API: /api/agenda — Gerenciamento de eventos da agenda por divisao
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AGENDA_FILE = path.join(process.cwd(), 'data', 'agenda.json');

function getAgenda() {
  if (!fs.existsSync(AGENDA_FILE)) return { eventos: [] };
  return JSON.parse(fs.readFileSync(AGENDA_FILE, 'utf-8'));
}

function saveAgenda(data) {
  fs.writeFileSync(AGENDA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// Divisoes e seus chefes (slug da ficha)
const DIVISAO_CHEFES = {
  'comando': { chefeSlug: 'ronnandrew-resident', nome: 'Comando', cor: '#CC6666' },
  'academia': { chefeSlug: 'achila16-resident', nome: 'Academia', cor: '#999999' },
  'ciencias': { chefeSlug: 'marchezini-winchester', nome: 'Ciencias', cor: '#6688CC' },
  'comunicacoes': { chefeSlug: 'tvashtar-uriza', nome: 'Comunicacoes', cor: '#66CC66' },
  'engenharia': { chefeSlug: 'laizamia-resident', nome: 'Engenharia', cor: '#FFAA00' },
  'operacoes': { chefeSlug: 'ludmilla-benoir', nome: 'Operacoes', cor: '#FFAA00' },
  'tatico': { chefeSlug: 'danielroma-resident', nome: 'Tatico', cor: '#CC6666' },
};

function getUserDivisao(session) {
  if (!session?.fichaSlug) return null;
  // Admin pode gerenciar qualquer divisao
  if (session.role === 'admin') return 'admin';
  for (const [key, val] of Object.entries(DIVISAO_CHEFES)) {
    if (val.chefeSlug === session.fichaSlug) return key;
  }
  return null;
}

// GET — listar eventos (publico)
export async function GET() {
  const agenda = getAgenda();
  return NextResponse.json(agenda.eventos || []);
}

// POST — criar evento (chefe de divisao ou admin)
export async function POST(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const userDiv = getUserDivisao(session);
  if (!userDiv) return NextResponse.json({ error: 'Apenas chefes de divisao podem criar eventos' }, { status: 403 });

  const { divisao, titulo, data, texto } = await request.json();
  if (!titulo || !data) return NextResponse.json({ error: 'Titulo e data obrigatorios' }, { status: 400 });

  // Admin pode postar em qualquer divisao, chefe so pode na sua
  const targetDiv = (session.role === 'admin' && divisao) ? divisao : userDiv;
  if (targetDiv === 'admin' && !divisao) {
    return NextResponse.json({ error: 'Admin precisa especificar a divisao' }, { status: 400 });
  }

  const divInfo = DIVISAO_CHEFES[targetDiv];
  if (!divInfo && session.role !== 'admin') {
    return NextResponse.json({ error: 'Divisao invalida' }, { status: 400 });
  }

  const agenda = getAgenda();
  const evento = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    divisao: targetDiv,
    divisaoNome: divInfo?.nome || targetDiv,
    divisaoCor: divInfo?.cor || '#888',
    titulo,
    data,
    texto: texto || '',
    autorSlug: session.fichaSlug || 'admin',
    criadoEm: new Date().toISOString(),
  };

  agenda.eventos.push(evento);
  saveAgenda(agenda);

  return NextResponse.json({ ok: true, evento }, { status: 201 });
}

// PUT — editar evento
export async function PUT(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const userDiv = getUserDivisao(session);
  if (!userDiv) return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });

  const { id, titulo, data, texto } = await request.json();
  const agenda = getAgenda();
  const evento = agenda.eventos.find(e => e.id === id);
  if (!evento) return NextResponse.json({ error: 'Evento nao encontrado' }, { status: 404 });

  // Verificar permissao
  if (session.role !== 'admin' && evento.divisao !== userDiv) {
    return NextResponse.json({ error: 'Sem permissao para editar este evento' }, { status: 403 });
  }

  if (titulo) evento.titulo = titulo;
  if (data) evento.data = data;
  if (texto !== undefined) evento.texto = texto;
  saveAgenda(agenda);

  return NextResponse.json({ ok: true, evento });
}

// DELETE — remover evento
export async function DELETE(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const userDiv = getUserDivisao(session);
  if (!userDiv) return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });

  const { id } = await request.json();
  const agenda = getAgenda();
  const idx = agenda.eventos.findIndex(e => e.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Evento nao encontrado' }, { status: 404 });

  // Verificar permissao
  if (session.role !== 'admin' && agenda.eventos[idx].divisao !== userDiv) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  agenda.eventos.splice(idx, 1);
  saveAgenda(agenda);

  return NextResponse.json({ ok: true });
}
