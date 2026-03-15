// ============================================
// CONDECORACOES — Medalhas e Honrarias da Frota
// Acessando registros de merito nivel 5
// ============================================

export const metadata = {
  title: 'Condecoracoes — USS Venture',
  description: 'Medalhas e condecoracoes da Frota Venture.',
};

const BASE = "/img/condecoracoes/";

const categorias = [
  {
    nome: "Academia",
    cor: "var(--lcars-teal)",
    medalhas: [
      { nome: "Condecoração Miles O'Brien", img: BASE + "Miles.jpg", desc: "Destinada aos tripulantes que completarem todas as provas da Academia." },
      { nome: "Professor da Academia", img: BASE + "ac_professor.jpg", desc: "Destinada aos tripulantes que ministrarem aulas na Academia da Venture." },
      { nome: "Mestre da Academia", img: BASE + "ac_mestre.jpg", desc: "Destinada aos tripulantes que se destacarem como instrutores na Academia." },
      { nome: "Doutor da Academia", img: BASE + "ac_doutor.jpg", desc: "Mais alta honraria academica. Destinada a instrutores com contribuicao excepcional." },
    ]
  },
  {
    nome: "Medalhas de Merito",
    cor: "var(--lcars-orange)",
    medalhas: [
      { nome: "Medalha Malcom Reed", img: BASE + "barrete%20Malcon%20Reff.png", desc: "Destinada a premiar tripulantes que participaram de combates e se destacaram por coragem e bravura." },
      { nome: "Medalha de Distincao Jonathan Archer", img: BASE + "md_jonathan_archer.jpg", desc: "Homenagem destinada a premiar participacoes em campanhas ou servicos prestados de grande importancia ao Grupo." },
      { nome: "Medalha de Bons Servicos Montgomery Scott", img: BASE + "md_montgomery_scott.jpg", desc: "Destinada a premiar tripulantes que se destacaram em servicos prestados a Frota Venture." },
      { nome: "Cruz de Honra Zeffran Cochrane", img: BASE + "md_zeffran_cochrane.png", desc: "Destinada a premiar tripulantes que demonstraram honra e dedicacao excepcionais a Frota." },
      { nome: "Gran Cruz Jean-Luc Picard", img: BASE + "md_Jean_Luc.jpg", desc: "Uma das mais altas honrarias da Frota Venture. Destinada a oficiais com servicos extraordinarios." },
      { nome: "Medalha Pavel Chekov de Excelencia N1", img: BASE + "MD_PC_EM_I.png", desc: "Primeiro nivel da serie de excelencia Pavel Chekov. Reconhece dedicacao inicial." },
      { nome: "Medalha Pavel Chekov de Excelencia N2", img: BASE + "MD_PC_EM_II.png", desc: "Segundo nivel da serie de excelencia Pavel Chekov." },
      { nome: "Medalha Pavel Chekov de Excelencia N3", img: BASE + "MD_PC_EM_III.png", desc: "Terceiro nivel da serie de excelencia Pavel Chekov." },
      { nome: "Medalha Pavel Chekov de Excelencia N4", img: BASE + "MD_PC_EM_IV.png", desc: "Quarto nivel da serie de excelencia Pavel Chekov." },
      { nome: "Medalha Pavel Chekov de Excelencia N5", img: BASE + "MD_PC_EM_V.png", desc: "Nivel maximo da serie de excelencia Pavel Chekov. Mais alta honraria de excelencia." },
      { nome: "Medalha James T. Kirk de Valor e Lideranca N1", img: BASE + "MD_JTK_VL_I.png", desc: "Primeiro nivel da medalha de valor e lideranca. Reconhece capacidade de lideranca em missoes." },
      { nome: "Medalha James T. Kirk de Valor e Lideranca N2", img: BASE + "MD_JTK_VL_II.png", desc: "Segundo nivel da medalha James T. Kirk de valor e lideranca." },
      { nome: "Medalha James T. Kirk de Valor e Lideranca N3", img: BASE + "MD_JTK_VL_III.png", desc: "Terceiro nivel da medalha James T. Kirk de valor e lideranca." },
      { nome: "Medalha James T. Kirk de Valor e Lideranca N4", img: BASE + "MD_JTK_VL_IV.png", desc: "Quarto nivel da medalha James T. Kirk de valor e lideranca." },
      { nome: "Medalha James T. Kirk de Valor e Lideranca N5", img: BASE + "MD_JTK_VL_V.png", desc: "Nivel maximo da medalha James T. Kirk. Mais alta honraria de valor e lideranca." },
      { nome: "Medalha Niota Uhura de Comunicacao N1", img: BASE + "MD_NU_BS_I.png", desc: "Primeiro nivel da medalha de comunicacao. Reconhece contribuicoes em comunicacoes da Frota." },
      { nome: "Medalha Niota Uhura de Comunicacao N2", img: BASE + "MD_NU_BS_II.png", desc: "Segundo nivel da medalha Niota Uhura de comunicacao." },
      { nome: "Medalha Niota Uhura de Comunicacao N3", img: BASE + "MD_NU_BS_III.png", desc: "Terceiro nivel da medalha Niota Uhura de comunicacao." },
      { nome: "Medalha Niota Uhura de Comunicacao N4", img: BASE + "MD_NU_BS_IV.png", desc: "Quarto nivel da medalha Niota Uhura de comunicacao." },
      { nome: "Medalha Niota Uhura de Comunicacao N5", img: BASE + "MD_NU_BS_V.png", desc: "Nivel maximo da medalha Niota Uhura. Mais alta honraria de comunicacao." },
      { nome: "Medalha Spock de Logica e Ciencia N1", img: BASE + "MD_SP_DT_I.png", desc: "Primeiro nivel da medalha Spock. Reconhece contribuicoes cientificas e logica exemplar." },
      { nome: "Medalha Spock de Logica e Ciencia N2", img: BASE + "MD_SP_DT_II.png", desc: "Segundo nivel da medalha Spock de logica e ciencia." },
      { nome: "Medalha Spock de Logica e Ciencia N3", img: BASE + "MD_SP_DT_III.png", desc: "Terceiro nivel da medalha Spock de logica e ciencia." },
      { nome: "Medalha Spock de Logica e Ciencia N4", img: BASE + "MD_SP_DT_IV.png", desc: "Quarto nivel da medalha Spock de logica e ciencia." },
      { nome: "Medalha Spock de Logica e Ciencia N5", img: BASE + "MD_SP_DT_V.png", desc: "Nivel maximo da medalha Spock. Mais alta honraria de logica e ciencia. Vida longa e prospera." },
    ]
  },
  {
    nome: "Tecnicas e Desenvolvimento",
    cor: "var(--lcars-blue)",
    medalhas: [
      { nome: "Condecoração Data - Script Junior", img: BASE + "SC_Data_NJ.jpg", desc: "Destinada aos tripulantes que desenvolvem scripts para a Frota Venture - Nivel Junior." },
      { nome: "Condecoração Data - Script Senior", img: BASE + "SC_Data_NS.jpg", desc: "Destinada aos tripulantes que desenvolvem scripts para a Frota Venture - Nivel Senior." },
      { nome: "Condecoração Data - Script Advanced", img: BASE + "SC_Data_NA.jpg", desc: "Destinada aos tripulantes que desenvolvem scripts para a Frota Venture - Nivel Advanced." },
      { nome: "Construtor Junior", img: BASE + "ConstJ.jpg", desc: "Reconhece tripulantes que contribuem com construcoes para o Grupo - Nivel Junior." },
      { nome: "Construtor Senior", img: BASE + "ConstS.jpg", desc: "Reconhece tripulantes que contribuem com construcoes para o Grupo - Nivel Senior." },
      { nome: "Construtor Advanced", img: BASE + "ConstA.jpg", desc: "Reconhece tripulantes que contribuem com construcoes para o Grupo - Nivel Advanced." },
    ]
  },
  {
    nome: "Tempo de Servico",
    cor: "var(--lcars-lavender)",
    medalhas: [
      { nome: "1 Ano de Servico", img: BASE + "barrete_1_ano.jpg", desc: "Barra comemorativa de 1 ano de servico ativo na Frota Venture." },
      { nome: "2 Anos de Servico", img: BASE + "barrete_2_anos.jpg", desc: "Barra comemorativa de 2 anos de servico ativo na Frota Venture." },
      { nome: "3 Anos de Servico", img: BASE + "barrete_3_anos.jpg", desc: "Barra comemorativa de 3 anos de servico ativo na Frota Venture." },
      { nome: "4 Anos de Servico", img: BASE + "BAR_ano_04.jpg", desc: "Barra comemorativa de 4 anos de servico ativo na Frota Venture." },
      { nome: "5 Anos de Servico", img: BASE + "barrete%20de%205%20anos.jpg", desc: "Barra comemorativa de 5 anos de servico ativo na Frota Venture." },
      { nome: "6 Anos de Servico", img: BASE + "barrete%20de%206%20anos.jpg", desc: "Barra comemorativa de 6 anos de servico ativo na Frota Venture." },
      { nome: "7 Anos de Servico", img: BASE + "barrete%20de%207%20anos.jpg", desc: "Barra comemorativa de 7 anos de servico ativo na Frota Venture." },
      { nome: "8 Anos de Servico", img: BASE + "barrete%20de%208%20anos.jpg", desc: "Barra comemorativa de 8 anos de servico ativo na Frota Venture." },
      { nome: "9 Anos de Servico", img: BASE + "barrete%20de%209%20anos.jpg", desc: "Barra comemorativa de 9 anos de servico ativo na Frota Venture." },
      { nome: "10 Anos de Servico", img: BASE + "barrete%20de%2010%20anos.jpg", desc: "Barra comemorativa de 10 anos de servico ativo na Frota Venture." },
    ]
  },
];

export default function CondecoacoesPage() {
  return (
    <div>
      <div className="lcars-hero">
        <h1>Condecoracoes</h1>
        <div className="subtitle">Medalhas e Honrarias — Frota Venture</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="lcars-panel">
        <div className="lcars-panel-header">
          Registro de Honrarias
        </div>
        <div className="lcars-panel-body">
          <p>
            Medalhas e condecoracoes pessoais do Grupo USS Venture para reconhecimento
            da participacao e merito de cada membro. As honrarias sao concedidas pelo
            Almirantado com base em servicos prestados, tempo de dedicacao e contribuicoes
            excepcionais a Frota.
          </p>
        </div>
      </div>

      {categorias.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontFamily: 'var(--font-lcars)',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: cat.cor,
            marginBottom: '16px',
            paddingBottom: '6px',
            borderBottom: `2px solid ${cat.cor}`,
          }}>
            {cat.nome}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '14px',
          }}>
            {cat.medalhas.map((m, mi) => (
              <div key={mi} className="lcars-card" style={{ borderColor: cat.cor }}>
                <div className="lcars-card-body" style={{ textAlign: 'center' }}>
                  <div style={{
                    padding: '16px',
                    marginBottom: '12px',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: 'var(--lcars-radius-sm)',
                    border: '1px solid #333',
                  }}>
                    <img
                      src={m.img}
                      alt={m.nome}
                      style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 0 6px rgba(255,153,0,0.3))',
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: cat.cor,
                    marginBottom: '8px',
                    lineHeight: '1.3',
                  }}>
                    {m.nome}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--lcars-text-light)',
                    lineHeight: '1.5',
                  }}>
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="lcars-bar gradient" />

      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: 'var(--lcars-text-dim)',
        fontSize: '0.8rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Total: {categorias.reduce((acc, c) => acc + c.medalhas.length, 0)} condecoracoes registradas
      </div>
    </div>
  );
}
