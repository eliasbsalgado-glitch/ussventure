// ============================================
// MIGRATION: Convert legacy file-based condecoracoes
// to database honraria IDs in all fichas
// Executar: node --env-file=.env.local scripts/migrate-fichas-condecoracoes.js
// ============================================

import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL);

// Old MEDALS_LIST filenames → we map them by matching against honrarias.imagem
const OLD_FILE_TO_IMAGEM = {
  'Miles.jpg': '/img/condecoracoes/Miles.jpg',
  'ac_professor.jpg': '/img/condecoracoes/ac_professor.jpg',
  'ac_mestre.jpg': '/img/condecoracoes/ac_mestre.jpg',
  'ac_doutor.jpg': '/img/condecoracoes/ac_doutor.jpg',
  'barrete Malcon Reff.png': '/img/condecoracoes/barrete%20Malcon%20Reff.png',
  'md_jonathan_archer.jpg': '/img/condecoracoes/md_jonathan_archer.jpg',
  'md_montgomery_scott.jpg': '/img/condecoracoes/md_montgomery_scott.jpg',
  'md_zeffran_cochrane.png': '/img/condecoracoes/md_zeffran_cochrane.png',
  'md_Jean_Luc.jpg': '/img/condecoracoes/md_Jean_Luc.jpg',
  'MD_PC_EM_I.png': '/img/condecoracoes/MD_PC_EM_I.png',
  'MD_PC_EM_II.png': '/img/condecoracoes/MD_PC_EM_II.png',
  'MD_PC_EM_III.png': '/img/condecoracoes/MD_PC_EM_III.png',
  'MD_PC_EM_IV.png': '/img/condecoracoes/MD_PC_EM_IV.png',
  'MD_PC_EM_V.png': '/img/condecoracoes/MD_PC_EM_V.png',
  'MD_JTK_VL_I.png': '/img/condecoracoes/MD_JTK_VL_I.png',
  'MD_JTK_VL_II.png': '/img/condecoracoes/MD_JTK_VL_II.png',
  'MD_JTK_VL_III.png': '/img/condecoracoes/MD_JTK_VL_III.png',
  'MD_JTK_VL_IV.png': '/img/condecoracoes/MD_JTK_VL_IV.png',
  'MD_JTK_VL_V.png': '/img/condecoracoes/MD_JTK_VL_V.png',
  'MD_NU_BS_I.png': '/img/condecoracoes/MD_NU_BS_I.png',
  'MD_NU_BS_II.png': '/img/condecoracoes/MD_NU_BS_II.png',
  'MD_NU_BS_III.png': '/img/condecoracoes/MD_NU_BS_III.png',
  'MD_NU_BS_IV.png': '/img/condecoracoes/MD_NU_BS_IV.png',
  'MD_NU_BS_V.png': '/img/condecoracoes/MD_NU_BS_V.png',
  'MD_SP_DT_I.png': '/img/condecoracoes/MD_SP_DT_I.png',
  'MD_SP_DT_II.png': '/img/condecoracoes/MD_SP_DT_II.png',
  'MD_SP_DT_III.png': '/img/condecoracoes/MD_SP_DT_III.png',
  'MD_SP_DT_IV.png': '/img/condecoracoes/MD_SP_DT_IV.png',
  'MD_SP_DT_V.png': '/img/condecoracoes/MD_SP_DT_V.png',
  'SC_Data_NJ.jpg': '/img/condecoracoes/SC_Data_NJ.jpg',
  'SC_Data_NS.jpg': '/img/condecoracoes/SC_Data_NS.jpg',
  'SC_Data_NA.jpg': '/img/condecoracoes/SC_Data_NA.jpg',
  'ConstJ.jpg': '/img/condecoracoes/ConstJ.jpg',
  'ConstS.jpg': '/img/condecoracoes/ConstS.jpg',
  'ConstA.jpg': '/img/condecoracoes/ConstA.jpg',
  'barrete_1_ano.jpg': '/img/condecoracoes/barrete_1_ano.jpg',
  'barrete_2_anos.jpg': '/img/condecoracoes/barrete_2_anos.jpg',
  'barrete_3_anos.jpg': '/img/condecoracoes/barrete_3_anos.jpg',
  'BAR_ano_04.jpg': '/img/condecoracoes/BAR_ano_04.jpg',
  'barrete de 5 anos.jpg': '/img/condecoracoes/barrete%20de%205%20anos.jpg',
  'barrete de 6 anos.jpg': '/img/condecoracoes/barrete%20de%206%20anos.jpg',
  'barrete de 7 anos.jpg': '/img/condecoracoes/barrete%20de%207%20anos.jpg',
  'barrete de 8 anos.jpg': '/img/condecoracoes/barrete%20de%208%20anos.jpg',
  'barrete de 9 anos.jpg': '/img/condecoracoes/barrete%20de%209%20anos.jpg',
  'barrete de 10 anos.jpg': '/img/condecoracoes/barrete%20de%2010%20anos.jpg',
};

async function migrate() {
  // 1. Fetch all honrarias from DB to build imagem → id map
  const honrarias = await sql`SELECT id, imagem FROM honrarias`;
  const imagemToId = {};
  honrarias.forEach(h => {
    if (h.imagem) imagemToId[h.imagem] = h.id;
  });

  // 2. Build filename → honraria ID map
  const fileToId = {};
  for (const [file, imagem] of Object.entries(OLD_FILE_TO_IMAGEM)) {
    if (imagemToId[imagem]) {
      fileToId[file] = imagemToId[imagem];
    } else {
      console.warn(`⚠ No honraria found for imagem: ${imagem} (file: ${file})`);
    }
  }

  console.log(`Mapeamento construido: ${Object.keys(fileToId).length} filenames -> IDs`);

  // 3. Fetch all fichas with condecoracoes
  const fichas = await sql`SELECT slug, condecoracoes FROM fichas WHERE condecoracoes IS NOT NULL AND condecoracoes != '[]'::jsonb`;
  console.log(`Fichas com condecoracoes: ${fichas.length}`);

  let updated = 0;
  let skipped = 0;
  let unmapped = [];

  for (const ficha of fichas) {
    const condecoracoes = ficha.condecoracoes || [];
    if (condecoracoes.length === 0) continue;

    let changed = false;
    const newCondecoracoes = condecoracoes.map(entry => {
      // Already an ID (not a filename)? Keep as-is
      if (entry.startsWith('mig_') || !entry.includes('.')) {
        return entry;
      }
      // Try to map filename → ID
      const id = fileToId[entry];
      if (id) {
        changed = true;
        return id;
      } else {
        unmapped.push({ ficha: ficha.slug, file: entry });
        return entry; // Keep legacy if no match
      }
    });

    if (changed) {
      await sql`UPDATE fichas SET condecoracoes = ${JSON.stringify(newCondecoracoes)}::jsonb WHERE slug = ${ficha.slug}`;
      console.log(`  ✅ ${ficha.slug}: ${condecoracoes.length} condecoracoes → migradas`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`Fichas atualizadas: ${updated}`);
  console.log(`Fichas sem alteracao: ${skipped}`);
  if (unmapped.length > 0) {
    console.log(`\n⚠ Entradas sem mapeamento:`);
    unmapped.forEach(u => console.log(`  - ${u.ficha}: ${u.file}`));
  }
  console.log('\n✅ Migracao concluida!');
}

migrate().catch(err => {
  console.error('Erro na migracao:', err);
  process.exit(1);
});
