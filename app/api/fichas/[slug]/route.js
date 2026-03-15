// API: /api/fichas/[slug] — GET, PUT, DELETE individual
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'fichas.json');

function read() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const fichas = read();
  const ficha = fichas.find(f => f.slug === slug);
  if (!ficha) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });
  return NextResponse.json(ficha);
}

export async function PUT(request, { params }) {
  const { slug } = await params;
  const body = await request.json();
  const fichas = read();
  const idx = fichas.findIndex(f => f.slug === slug);
  if (idx < 0) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  fichas[idx] = { ...fichas[idx], ...body, slug: fichas[idx].slug };
  write(fichas);

  return NextResponse.json(fichas[idx]);
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  const fichas = read();
  const idx = fichas.findIndex(f => f.slug === slug);
  if (idx < 0) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  fichas.splice(idx, 1);
  write(fichas);

  return NextResponse.json({ ok: true });
}
