// API: /api/sl/welcome — Endpoint otimizado para Second Life
// Retorna patente e nome em formato leve: "Patente|Nome"
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get('nome');

  if (!nome) {
    return new NextResponse('', { status: 400 });
  }

  // Busca por nome SL (case insensitive, com ou sem "resident")
  const searchTerm = nome.toLowerCase().replace(/\s+resident$/i, '');

  const rows = await sql`
    SELECT nome, patente FROM fichas
    WHERE LOWER(REPLACE(nome, ' Resident', '')) LIKE ${searchTerm + '%'}
    OR LOWER(REPLACE(REPLACE(nome, ' Resident', ''), ' ', '')) LIKE ${searchTerm.replace(/\s+/g, '') + '%'}
    LIMIT 1
  `;

  if (rows.length === 0) {
    return new NextResponse('', { status: 404 });
  }

  const ficha = rows[0];
  const patente = ficha.patente || 'Tripulante';
  const nomeDisplay = ficha.nome.replace(/ [Rr]esident$/, '');

  // Formato leve para LSL: "Patente|Nome"
  return new NextResponse(`${patente}|${nomeDisplay}`, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
