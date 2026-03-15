// ============================================
// PONTE DE COMANDO — Pagina inicial do sistema
// Todos os sistemas funcionando normalmente
// ============================================

import Link from 'next/link';
import { getFichaStats, getDivisoes, getNaves } from '@/lib/data';
import AgendaHome from '@/components/AgendaHome';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const stats = await getFichaStats();
  const divisoes = await getDivisoes();
  const naves = getNaves();
  // Active divisions = those with at least 1 active member (excluding Reserva and Baixa)
  const activeDivisions = divisoes.filter(d => d.nome !== 'Reserva' && d.nome !== 'Baixa' && d.qtd > 0).length;
  const activeNaves = naves.filter(n => n.status === 'Ativa').length;

  return (
    <div>
      {/* Hero Section */}
      <div className="lcars-hero">
        <h1>FROTA VENTURE</h1>
        <div className="subtitle">Sistema de Computador Central — Starbase 245</div>
      </div>

      <div className="lcars-bar gradient" />

      {/* Stats */}
      <div className="lcars-stats">
        <div className="lcars-stat">
          <div className="lcars-stat-value">{stats.total}</div>
          <div className="lcars-stat-label">Tripulantes Registrados</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-teal)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-teal)' }}>{stats.ativos}</div>
          <div className="lcars-stat-label">Tripulantes Ativos</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-blue)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-blue)' }}>{activeNaves}</div>
          <div className="lcars-stat-label">Naves em Servico</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-lavender)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-lavender)' }}>{activeDivisions}</div>
          <div className="lcars-stat-label">Divisoes Ativas</div>
        </div>
        <div className="lcars-stat" style={{ borderColor: 'var(--lcars-green)' }}>
          <div className="lcars-stat-value" style={{ color: 'var(--lcars-green)' }}>2008</div>
          <div className="lcars-stat-label">Ano de Fundacao</div>
        </div>
      </div>

      {/* Cards de acesso rapido */}
      <div className="lcars-grid">
        <Link href="/tripulacao" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{
            borderColor: 'var(--african-violet)',
            cursor: 'pointer',
          }}>
            <div className="lcars-card-header" style={{ background: 'var(--african-violet)', color: '#000' }}>
              Fichas de Servico
            </div>
            <div className="lcars-card-body">
              <p>Acesse os dados da tripulacao ativa da Frota Venture.
              Fichas individuais com patente, divisao e historico.</p>
            </div>
          </div>
        </Link>

        <Link href="/divisoes" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{
            borderColor: 'var(--moonlit-violet)',
            cursor: 'pointer',
          }}>
            <div className="lcars-card-header" style={{ background: 'var(--moonlit-violet)', color: '#000' }}>
              Divisoes
            </div>
            <div className="lcars-card-body">
              <p>Organizacao do Grupo USS Venture com suas divisoes
              e departamentos operacionais.</p>
            </div>
          </div>
        </Link>

        <Link href="/naves" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{
            borderColor: 'var(--sky)',
            cursor: 'pointer',
          }}>
            <div className="lcars-card-header" style={{ background: 'var(--sky)', color: '#000' }}>
              Naves Capitaneas
            </div>
            <div className="lcars-card-body">
              <p>Descricao das naves da frota Venture docadas
              na Estacao SB-245.</p>
            </div>
          </div>
        </Link>

        <Link href="/academia" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{
            borderColor: '#999',
            cursor: 'pointer',
          }}>
            <div className="lcars-card-header" style={{ background: '#999', color: '#000' }}>
              Academia
            </div>
            <div className="lcars-card-body">
              <p>Apresentacao da Academia da Venture, incluindo
              areas de estudo e cursos existentes.</p>
            </div>
          </div>
        </Link>

        <Link href="/patentes" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{
            borderColor: 'var(--bluey)',
            cursor: 'pointer',
          }}>
            <div className="lcars-card-header" style={{ background: 'var(--bluey)', color: '#000' }}>
              Patentes
            </div>
            <div className="lcars-card-body">
              <p>Estrutura hierarquica de patentes da Frota Venture
              com responsabilidades individuais.</p>
            </div>
          </div>
        </Link>

        <Link href="/historico" style={{ textDecoration: 'none' }}>
          <div className="lcars-card lcars-card-hover" style={{
            borderColor: 'var(--orange)',
            cursor: 'pointer',
          }}>
            <div className="lcars-card-header" style={{ background: 'var(--orange)', color: '#000' }}>
              Historico de Missoes
            </div>
            <div className="lcars-card-body">
              <p>Registro historico das aventuras do grupo desde
              a fundacao ate a data estelar atual.</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="lcars-bar gradient" />

      {/* Agenda da Frota */}
      <AgendaHome />

      {/* Welcome Panel */}
      <div className="lcars-panel">
        <div className="lcars-panel-header">
          Comunicado da Ponte — Setor de Comunicacoes
        </div>
        <div className="lcars-panel-body">
          <p>
            Bem-vindo ao sistema LCARS da Frota Venture. Este e o computador central
            da Estacao Estelar SB-245, em orbita do planeta Nova Trivas no sistema Neural.
          </p>
          <br />
          <p>
            A Frota Venture e um grupo brasileiro de roleplay Star Trek no Second Life,
            fundado em 2008. Operamos no meta-universo do Second Life, onde e possivel
            vivenciar o seculo 24 atraves de um avatar.
          </p>
          <br />
          <p>
            Faca parte da Frota voce tambem! Crie uma conta gratuita no{' '}
            <a href="https://www.secondlife.com" target="_blank" rel="noopener noreferrer">
              Second Life
            </a>
            , visite a Land Trivas e procure pelos tripulantes Elemer Piek ou RonnAndrew.
          </p>
        </div>
      </div>

      {/* Data Estelar */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: 'var(--lcars-text-dim)',
        fontSize: '0.8rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        <span className="lcars-blink" style={{ color: 'var(--lcars-green)', marginRight: '8px' }}>●</span>
        Sistemas operacionais — Todos os protocolos funcionando
      </div>
    </div>
  );
}
