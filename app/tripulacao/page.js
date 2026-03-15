// ============================================
// TRIPULACAO — Banco de Dados de Pessoal
// Acessando registros classificados nivel 3
// ============================================

import fs from 'fs';
import path from 'path';
import TripulacaoClient from './TripulacaoClient';

const FILE = path.join(process.cwd(), 'data', 'fichas.json');

function getFichas() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

export const metadata = {
  title: 'Tripulacao — USS Venture',
  description: 'Fichas de servico dos oficiais da Frota Venture.',
};

export const dynamic = 'force-dynamic';

export default function TripulacaoPage() {
  const fichas = getFichas();

  return (
    <div>
      <div className="lcars-hero">
        <h1>Banco de Dados de Pessoal</h1>
        <div className="subtitle">Fichas de Servico — {fichas.length} registros</div>
      </div>

      <div className="lcars-bar gradient" />

      {fichas.length === 0 ? (
        <div className="lcars-panel">
          <div className="lcars-panel-header">Nenhum Registro</div>
          <div className="lcars-panel-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--gray)' }}>
              Nenhum tripulante cadastrado. Fichas de servico podem ser adicionadas pelo Painel Admin.
            </p>
          </div>
        </div>
      ) : (
        <TripulacaoClient fichas={fichas} />
      )}
    </div>
  );
}
