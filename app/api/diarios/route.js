// API: /api/diarios — Diarios de bordo pessoais
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FICHAS_FILE = path.join(process.cwd(), 'data', 'fichas.json');

function readFichas() {
  if (!fs.existsSync(FICHAS_FILE)) return [];
  return JSON.parse(fs.readFileSync(FICHAS_FILE, 'utf-8'));
}

function writeFichas(data) {
  fs.writeFileSync(FICHAS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getSession(request) {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try { return JSON.parse(cookie.value); } catch { return null; }
}

// GET — listar diarios de um tripulante
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 });

  const session = getSession(request);
  const fichas = readFichas();
  const ficha = fichas.find(f => f.slug === slug);
  if (!ficha) return NextResponse.json({ error: 'Ficha nao encontrada' }, { status: 404 });

  const diarios = ficha.diarios || [];

  // If it's the owner or admin, show all entries. Otherwise, show only public ones.
  const isOwner = session && (session.fichaSlug === slug || session.role === 'admin');
  const filtered = isOwner ? diarios : diarios.filter(d => d.publico);

  return NextResponse.json(filtered);
}

// POST — adicionar entrada no diario
export async function POST(request) {
  const session = getSession(request);
  if (!session || !session.fichaSlug) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const fichas = readFichas();
  const idx = fichas.findIndex(f => f.slug === session.fichaSlug);
  if (idx < 0) return NextResponse.json({ error: 'Ficha nao encontrada' }, { status: 404 });

  if (!fichas[idx].diarios) fichas[idx].diarios = [];

  const entry = {
    id: Date.now().toString(),
    data: body.data || new Date().toISOString().split('T')[0],
    texto: body.texto || '',
    publico: body.publico !== undefined ? body.publico : true,
    createdAt: new Date().toISOString(),
  };

  fichas[idx].diarios.unshift(entry); // mais recente primeiro
  writeFichas(fichas);

  return NextResponse.json(entry, { status: 201 });
}

// DELETE — remover entrada do diario
export async function DELETE(request) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('id');
  const slug = session.role === 'admin' ? searchParams.get('slug') : session.fichaSlug;

  if (!slug || !entryId) return NextResponse.json({ error: 'Parametros invalidos' }, { status: 400 });

  const fichas = readFichas();
  const idx = fichas.findIndex(f => f.slug === slug);
  if (idx < 0) return NextResponse.json({ error: 'Ficha nao encontrada' }, { status: 404 });

  fichas[idx].diarios = (fichas[idx].diarios || []).filter(d => d.id !== entryId);
  writeFichas(fichas);

  return NextResponse.json({ ok: true });
}
