// ============================================
// ACADEMIA — Centro de Treinamento da Venture
// Protocolos pedagogicos carregados
// ============================================

export const metadata = {
  title: 'Academia — USS Venture',
  description: 'Academia de treinamento da Frota Venture.',
};

export default function AcademiaPage() {
  const cursos = [
    { nome: "Procedimentos da Frota", area: "Basico", desc: "Introducao aos protocolos da Frota Estelar, hierarquia, comunicacoes e conduta." },
    { nome: "Combate Tatico", area: "Tatico", desc: "Treinamento em taticas de combate pessoal e naval. Uso de armamentos padrao da Frota." },
    { nome: "Ciencias e Pesquisa", area: "Ciencias", desc: "Estudos em astronomia, xenobiologia, fisica subespaco e protocolos de pesquisa." },
    { nome: "Engenharia Estelar", area: "Engenharia", desc: "Construcao e manutencao de naves, estacoes e sistemas da Frota." },
    { nome: "Operacoes", area: "Operacoes", desc: "Logistica, planejamento de missoes, gerenciamento de recursos e pessoal." },
    { nome: "Medicina", area: "Ciencias", desc: "Procedimentos medicos, primeiros socorros e biologia de diversas especies." },
  ];

  return (
    <div>
      <div className="lcars-hero">
        <h1>Academia da Venture</h1>
        <div className="subtitle">Centro de Treinamento e Formacao</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: '#999', color: '#000' }}>
          Sobre a Academia
        </div>
        <div className="lcars-panel-body">
          <p>
            A Academia da Venture e responsavel pelo treinamento de novos tripulantes.
            Cadetes passam por cursos antes de serem promovidos a Alferes. Areas de estudo
            incluem procedimentos da Frota, combate tatico, ciencias e engenharia.
          </p>
          <br />
          <p>
            <strong style={{ color: 'var(--lcars-orange)' }}>Chefe da Academia:</strong> Comandante Achila16
          </p>
        </div>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-lcars)',
        fontSize: '1.1rem',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        color: 'var(--lcars-teal)',
        marginBottom: '16px',
      }}>
        Areas de Estudo
      </h2>

      <div className="lcars-grid">
        {cursos.map((c, i) => {
          const badgeColors = {
            'Basico': { bg: '#fff', color: '#000' },
            'Tatico': { bg: 'var(--lcars-red)', color: '#000' },
            'Ciencias': { bg: 'var(--lcars-blue)', color: '#000' },
            'Engenharia': { bg: 'var(--lcars-orange)', color: '#000' },
            'Operacoes': { bg: 'var(--lcars-orange)', color: '#000' },
          };
          const badge = badgeColors[c.area] || { bg: 'var(--lcars-blue)', color: '#000' };
          return (
          <div key={i} className="lcars-card lcars-card-hover" style={{
            borderColor: '#999',
            cursor: 'pointer',
          }}>
            <div className="lcars-card-header" style={{ background: '#999', color: '#000' }}>
              {c.nome}
            </div>
            <div className="lcars-card-body">
              <span style={{ marginBottom: '8px', display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', background: badge.bg, color: badge.color }}>
                {c.area}
              </span>
              <p>{c.desc}</p>
            </div>
          </div>
          );
        })}
      </div>

      <div className="lcars-bar gradient" style={{ marginTop: '30px' }} />

      <div className="lcars-panel">
        <div className="lcars-panel-header" style={{ background: '#fff', color: '#000' }}>
          Como Ingressar
        </div>
        <div className="lcars-panel-body">
          <ol style={{ paddingLeft: '20px', lineHeight: '2' }}>
            <li>Crie uma conta gratuita no <a href="https://www.secondlife.com" target="_blank">Second Life</a></li>
            <li>Baixe o navegador do Second Life</li>
            <li>Visite a Land Trivas: <a href="https://maps.secondlife.com/secondlife/Trivas/125/125/600" target="_blank">Teletransporte Direto</a></li>
            <li>Procure os tripulantes <strong style={{ color: 'var(--lcars-orange)' }}>Elemer Piek</strong> ou <strong style={{ color: 'var(--lcars-orange)' }}>RonnAndrew</strong></li>
            <li>Voce entrara como <strong>Cadete</strong> e apos curso sera promovido a <strong>Alferes</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
