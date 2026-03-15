// API: /api/fichas — CRUD para fichas de servico
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

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(request) {
  const body = await request.json();
  const fichas = read();

  const ficha = {
    slug: slugify(body.nome || 'sem-nome'),
    nome: body.nome || '',
    nascimentoSL: body.nascimentoSL || '',
    cidade: body.cidade || '',
    raca: body.raca || '',
    admissao: body.admissao || '',
    patente: body.patente || '',
    divisao: body.divisao || '',
    departamento: body.departamento || '',
    foto: body.foto || '',
    historia: body.historia || '',
    timeline: body.timeline || [],
    condecoracoes: body.condecoracoes || [],
    cursos: body.cursos || [],
    createdAt: new Date().toISOString(),
  };

  // Check duplicate slug
  const existing = fichas.findIndex(f => f.slug === ficha.slug);
  if (existing >= 0) {
    ficha.slug = ficha.slug + '-' + Date.now();
  }

  fichas.push(ficha);
  write(fichas);

  return NextResponse.json(ficha, { status: 201 });
}
