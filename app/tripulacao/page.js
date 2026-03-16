// ============================================
// TRIPULACAO — Banco de Dados de Pessoal
// Acessando registros classificados nivel 3
// ============================================

import TripulacaoClient from './TripulacaoClient';
import sql from '@/lib/db';

export const metadata = {
  title: 'Tripulacao — USS Venture',
  description: 'Fichas de servico dos oficiais da Frota Venture.',
};

export const dynamic = 'force-dynamic';

export default async function TripulacaoPage() {
  const rows = await sql`SELECT slug, nome, patente, divisao, departamento, foto FROM fichas ORDER BY LOWER(nome)`;
  const fichas = rows.map(r => ({
    slug: r.slug, nome: r.nome, patente: r.patente,
    divisao: r.divisao, departamento: r.departamento, foto: r.foto,
  }));

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
