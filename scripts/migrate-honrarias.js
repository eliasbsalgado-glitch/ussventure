// ============================================
// MIGRATION: Migrar honrarias hardcoded para o banco
// Executar: node --env-file=.env.local scripts/migrate-honrarias.js
// ============================================

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

const BASE = "/img/condecoracoes/";

const honrarias = [
  // Academia
  { categoria: 'academia', nome: "Condecoração Miles O'Brien", imagem: BASE + "Miles.jpg", descricao: "Destinada aos tripulantes que completarem todas as provas da Academia.", ordem: 1 },
  { categoria: 'academia', nome: "Professor da Academia", imagem: BASE + "ac_professor.jpg", descricao: "Destinada aos tripulantes que ministrarem aulas na Academia da Venture.", ordem: 2 },
  { categoria: 'academia', nome: "Mestre da Academia", imagem: BASE + "ac_mestre.jpg", descricao: "Destinada aos tripulantes que se destacarem como instrutores na Academia.", ordem: 3 },
  { categoria: 'academia', nome: "Doutor da Academia", imagem: BASE + "ac_doutor.jpg", descricao: "Mais alta honraria academica. Destinada a instrutores com contribuicao excepcional.", ordem: 4 },

  // Merito
  { categoria: 'merito', nome: "Medalha Malcom Reed", imagem: BASE + "barrete%20Malcon%20Reff.png", descricao: "Destinada a premiar tripulantes que participaram de combates e se destacaram por coragem e bravura.", ordem: 1 },
  { categoria: 'merito', nome: "Medalha de Distincao Jonathan Archer", imagem: BASE + "md_jonathan_archer.jpg", descricao: "Homenagem destinada a premiar participacoes em campanhas ou servicos prestados de grande importancia ao Grupo.", ordem: 2 },
  { categoria: 'merito', nome: "Medalha de Bons Servicos Montgomery Scott", imagem: BASE + "md_montgomery_scott.jpg", descricao: "Destinada a premiar tripulantes que se destacaram em servicos prestados a Frota Venture.", ordem: 3 },
  { categoria: 'merito', nome: "Cruz de Honra Zeffran Cochrane", imagem: BASE + "md_zeffran_cochrane.png", descricao: "Destinada a premiar tripulantes que demonstraram honra e dedicacao excepcionais a Frota.", ordem: 4 },
  { categoria: 'merito', nome: "Gran Cruz Jean-Luc Picard", imagem: BASE + "md_Jean_Luc.jpg", descricao: "Uma das mais altas honrarias da Frota Venture. Destinada a oficiais com servicos extraordinarios.", ordem: 5 },
  { categoria: 'merito', nome: "Medalha Pavel Chekov de Excelencia N1", imagem: BASE + "MD_PC_EM_I.png", descricao: "Primeiro nivel da serie de excelencia Pavel Chekov. Reconhece dedicacao inicial.", ordem: 6 },
  { categoria: 'merito', nome: "Medalha Pavel Chekov de Excelencia N2", imagem: BASE + "MD_PC_EM_II.png", descricao: "Segundo nivel da serie de excelencia Pavel Chekov.", ordem: 7 },
  { categoria: 'merito', nome: "Medalha Pavel Chekov de Excelencia N3", imagem: BASE + "MD_PC_EM_III.png", descricao: "Terceiro nivel da serie de excelencia Pavel Chekov.", ordem: 8 },
  { categoria: 'merito', nome: "Medalha Pavel Chekov de Excelencia N4", imagem: BASE + "MD_PC_EM_IV.png", descricao: "Quarto nivel da serie de excelencia Pavel Chekov.", ordem: 9 },
  { categoria: 'merito', nome: "Medalha Pavel Chekov de Excelencia N5", imagem: BASE + "MD_PC_EM_V.png", descricao: "Nivel maximo da serie de excelencia Pavel Chekov. Mais alta honraria de excelencia.", ordem: 10 },
  { categoria: 'merito', nome: "Medalha James T. Kirk de Valor e Lideranca N1", imagem: BASE + "MD_JTK_VL_I.png", descricao: "Primeiro nivel da medalha de valor e lideranca. Reconhece capacidade de lideranca em missoes.", ordem: 11 },
  { categoria: 'merito', nome: "Medalha James T. Kirk de Valor e Lideranca N2", imagem: BASE + "MD_JTK_VL_II.png", descricao: "Segundo nivel da medalha James T. Kirk de valor e lideranca.", ordem: 12 },
  { categoria: 'merito', nome: "Medalha James T. Kirk de Valor e Lideranca N3", imagem: BASE + "MD_JTK_VL_III.png", descricao: "Terceiro nivel da medalha James T. Kirk de valor e lideranca.", ordem: 13 },
  { categoria: 'merito', nome: "Medalha James T. Kirk de Valor e Lideranca N4", imagem: BASE + "MD_JTK_VL_IV.png", descricao: "Quarto nivel da medalha James T. Kirk de valor e lideranca.", ordem: 14 },
  { categoria: 'merito', nome: "Medalha James T. Kirk de Valor e Lideranca N5", imagem: BASE + "MD_JTK_VL_V.png", descricao: "Nivel maximo da medalha James T. Kirk. Mais alta honraria de valor e lideranca.", ordem: 15 },
  { categoria: 'merito', nome: "Medalha Niota Uhura de Comunicacao N1", imagem: BASE + "MD_NU_BS_I.png", descricao: "Primeiro nivel da medalha de comunicacao. Reconhece contribuicoes em comunicacoes da Frota.", ordem: 16 },
  { categoria: 'merito', nome: "Medalha Niota Uhura de Comunicacao N2", imagem: BASE + "MD_NU_BS_II.png", descricao: "Segundo nivel da medalha Niota Uhura de comunicacao.", ordem: 17 },
  { categoria: 'merito', nome: "Medalha Niota Uhura de Comunicacao N3", imagem: BASE + "MD_NU_BS_III.png", descricao: "Terceiro nivel da medalha Niota Uhura de comunicacao.", ordem: 18 },
  { categoria: 'merito', nome: "Medalha Niota Uhura de Comunicacao N4", imagem: BASE + "MD_NU_BS_IV.png", descricao: "Quarto nivel da medalha Niota Uhura de comunicacao.", ordem: 19 },
  { categoria: 'merito', nome: "Medalha Niota Uhura de Comunicacao N5", imagem: BASE + "MD_NU_BS_V.png", descricao: "Nivel maximo da medalha Niota Uhura. Mais alta honraria de comunicacao.", ordem: 20 },
  { categoria: 'merito', nome: "Medalha Spock de Logica e Ciencia N1", imagem: BASE + "MD_SP_DT_I.png", descricao: "Primeiro nivel da medalha Spock. Reconhece contribuicoes cientificas e logica exemplar.", ordem: 21 },
  { categoria: 'merito', nome: "Medalha Spock de Logica e Ciencia N2", imagem: BASE + "MD_SP_DT_II.png", descricao: "Segundo nivel da medalha Spock de logica e ciencia.", ordem: 22 },
  { categoria: 'merito', nome: "Medalha Spock de Logica e Ciencia N3", imagem: BASE + "MD_SP_DT_III.png", descricao: "Terceiro nivel da medalha Spock de logica e ciencia.", ordem: 23 },
  { categoria: 'merito', nome: "Medalha Spock de Logica e Ciencia N4", imagem: BASE + "MD_SP_DT_IV.png", descricao: "Quarto nivel da medalha Spock de logica e ciencia.", ordem: 24 },
  { categoria: 'merito', nome: "Medalha Spock de Logica e Ciencia N5", imagem: BASE + "MD_SP_DT_V.png", descricao: "Nivel maximo da medalha Spock. Mais alta honraria de logica e ciencia. Vida longa e prospera.", ordem: 25 },

  // Tecnicas e Desenvolvimento
  { categoria: 'tecnicas', nome: "Condecoração Data - Script Junior", imagem: BASE + "SC_Data_NJ.jpg", descricao: "Destinada aos tripulantes que desenvolvem scripts para a Frota Venture - Nivel Junior.", ordem: 1 },
  { categoria: 'tecnicas', nome: "Condecoração Data - Script Senior", imagem: BASE + "SC_Data_NS.jpg", descricao: "Destinada aos tripulantes que desenvolvem scripts para a Frota Venture - Nivel Senior.", ordem: 2 },
  { categoria: 'tecnicas', nome: "Condecoração Data - Script Advanced", imagem: BASE + "SC_Data_NA.jpg", descricao: "Destinada aos tripulantes que desenvolvem scripts para a Frota Venture - Nivel Advanced.", ordem: 3 },
  { categoria: 'tecnicas', nome: "Construtor Junior", imagem: BASE + "ConstJ.jpg", descricao: "Reconhece tripulantes que contribuem com construcoes para o Grupo - Nivel Junior.", ordem: 4 },
  { categoria: 'tecnicas', nome: "Construtor Senior", imagem: BASE + "ConstS.jpg", descricao: "Reconhece tripulantes que contribuem com construcoes para o Grupo - Nivel Senior.", ordem: 5 },
  { categoria: 'tecnicas', nome: "Construtor Advanced", imagem: BASE + "ConstA.jpg", descricao: "Reconhece tripulantes que contribuem com construcoes para o Grupo - Nivel Advanced.", ordem: 6 },

  // Tempo de Servico
  { categoria: 'tempo_servico', nome: "1 Ano de Servico", imagem: BASE + "barrete_1_ano.jpg", descricao: "Barra comemorativa de 1 ano de servico ativo na Frota Venture.", ordem: 1 },
  { categoria: 'tempo_servico', nome: "2 Anos de Servico", imagem: BASE + "barrete_2_anos.jpg", descricao: "Barra comemorativa de 2 anos de servico ativo na Frota Venture.", ordem: 2 },
  { categoria: 'tempo_servico', nome: "3 Anos de Servico", imagem: BASE + "barrete_3_anos.jpg", descricao: "Barra comemorativa de 3 anos de servico ativo na Frota Venture.", ordem: 3 },
  { categoria: 'tempo_servico', nome: "4 Anos de Servico", imagem: BASE + "BAR_ano_04.jpg", descricao: "Barra comemorativa de 4 anos de servico ativo na Frota Venture.", ordem: 4 },
  { categoria: 'tempo_servico', nome: "5 Anos de Servico", imagem: BASE + "barrete%20de%205%20anos.jpg", descricao: "Barra comemorativa de 5 anos de servico ativo na Frota Venture.", ordem: 5 },
  { categoria: 'tempo_servico', nome: "6 Anos de Servico", imagem: BASE + "barrete%20de%206%20anos.jpg", descricao: "Barra comemorativa de 6 anos de servico ativo na Frota Venture.", ordem: 6 },
  { categoria: 'tempo_servico', nome: "7 Anos de Servico", imagem: BASE + "barrete%20de%207%20anos.jpg", descricao: "Barra comemorativa de 7 anos de servico ativo na Frota Venture.", ordem: 7 },
  { categoria: 'tempo_servico', nome: "8 Anos de Servico", imagem: BASE + "barrete%20de%208%20anos.jpg", descricao: "Barra comemorativa de 8 anos de servico ativo na Frota Venture.", ordem: 8 },
  { categoria: 'tempo_servico', nome: "9 Anos de Servico", imagem: BASE + "barrete%20de%209%20anos.jpg", descricao: "Barra comemorativa de 9 anos de servico ativo na Frota Venture.", ordem: 9 },
  { categoria: 'tempo_servico', nome: "10 Anos de Servico", imagem: BASE + "barrete%20de%2010%20anos.jpg", descricao: "Barra comemorativa de 10 anos de servico ativo na Frota Venture.", ordem: 10 },
];

async function migrate() {
  console.log('Criando tabela honrarias...');
  await sql`
    CREATE TABLE IF NOT EXISTS honrarias (
      id TEXT PRIMARY KEY,
      categoria TEXT NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT DEFAULT '',
      imagem TEXT DEFAULT '',
      ordem INT DEFAULT 0,
      criado_em TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_honrarias_categoria ON honrarias (categoria)`;

  // Check if already migrated
  const existing = await sql`SELECT COUNT(*)::int as count FROM honrarias`;
  if (existing[0].count > 0) {
    console.log(`Tabela ja contem ${existing[0].count} honrarias. Pulando migracao.`);
    console.log('Para re-migrar, limpe a tabela primeiro: DELETE FROM honrarias;');
    return;
  }

  console.log(`Inserindo ${honrarias.length} honrarias...`);
  for (let i = 0; i < honrarias.length; i++) {
    const h = honrarias[i];
    const id = `mig_${i.toString().padStart(3, '0')}`;
    await sql`
      INSERT INTO honrarias (id, categoria, nome, descricao, imagem, ordem)
      VALUES (${id}, ${h.categoria}, ${h.nome}, ${h.descricao}, ${h.imagem}, ${h.ordem})
    `;
  }

  console.log(`✅ ${honrarias.length} honrarias migradas com sucesso!`);
  const stats = await sql`SELECT categoria, COUNT(*)::int as count FROM honrarias GROUP BY categoria ORDER BY categoria`;
  stats.forEach(s => console.log(`  - ${s.categoria}: ${s.count}`));
}

migrate().catch(err => {
  console.error('Erro na migracao:', err);
  process.exit(1);
});
