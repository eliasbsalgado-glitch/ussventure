// ============================================
// MIGRATION: Add missing legacy medals to honrarias
// and re-map their entries in fichas
// Executar: node --env-file=.env.local scripts/migrate-fichas-remaining.js
// ============================================

import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL);

const BASE = '/img/condecoracoes/';

// The unmapped legacy medals found in fichas
const missingHonrarias = [
  { file: 'Bar1nav.jpg', categoria: 'outros', nome: 'Barra de Navegacao N1', imagem: BASE + 'Bar1nav.jpg', descricao: 'Barra de navegacao nivel 1.', ordem: 1 },
  { file: 'Bar2nav.jpg', categoria: 'outros', nome: 'Barra de Navegacao N2', imagem: BASE + 'Bar2nav.jpg', descricao: 'Barra de navegacao nivel 2.', ordem: 2 },
  { file: 'Bar3nav.jpg', categoria: 'outros', nome: 'Barra de Navegacao N3', imagem: BASE + 'Bar3nav.jpg', descricao: 'Barra de navegacao nivel 3.', ordem: 3 },
  { file: 'Bar4nav.jpg', categoria: 'outros', nome: 'Barra de Navegacao N4', imagem: BASE + 'Bar4nav.jpg', descricao: 'Barra de navegacao nivel 4.', ordem: 4 },
  { file: 'esquadra.jpg', categoria: 'outros', nome: 'Medalha de Esquadra', imagem: BASE + 'esquadra.jpg', descricao: 'Reconhecimento por participacao em esquadra.', ordem: 5 },
  { file: 'sh_explorador1.jpg', categoria: 'outros', nome: 'Explorador N1', imagem: BASE + 'sh_explorador1.jpg', descricao: 'Medalha de explorador nivel 1.', ordem: 6 },
  { file: 'sh_explorador2.jpg', categoria: 'outros', nome: 'Explorador N2', imagem: BASE + 'sh_explorador2.jpg', descricao: 'Medalha de explorador nivel 2.', ordem: 7 },
  { file: 'sh_explorador3.jpg', categoria: 'outros', nome: 'Explorador N3', imagem: BASE + 'sh_explorador3.jpg', descricao: 'Medalha de explorador nivel 3.', ordem: 8 },
];

async function migrate() {
  // 1. Add the missing honrarias to the DB
  console.log(`Adicionando ${missingHonrarias.length} honrarias faltantes...`);
  const fileToId = {};

  for (let i = 0; i < missingHonrarias.length; i++) {
    const h = missingHonrarias[i];
    const id = `mig_legacy_${i.toString().padStart(2, '0')}`;

    // Check if already exists
    const existing = await sql`SELECT id FROM honrarias WHERE nome = ${h.nome}`;
    if (existing.length > 0) {
      console.log(`  Ja existe: ${h.nome} (${existing[0].id})`);
      fileToId[h.file] = existing[0].id;
      continue;
    }

    await sql`
      INSERT INTO honrarias (id, categoria, nome, descricao, imagem, ordem)
      VALUES (${id}, ${h.categoria}, ${h.nome}, ${h.descricao}, ${h.imagem}, ${h.ordem})
    `;
    console.log(`  ✅ Criada: ${h.nome} (${id})`);
    fileToId[h.file] = id;
  }

  // 2. Update fichas that still have these file entries
  const fichas = await sql`SELECT slug, condecoracoes FROM fichas WHERE condecoracoes IS NOT NULL AND condecoracoes != '[]'::jsonb`;
  console.log(`\nVerificando ${fichas.length} fichas...`);

  let updated = 0;
  for (const ficha of fichas) {
    const condecoracoes = ficha.condecoracoes || [];
    let changed = false;

    const newCondecoracoes = condecoracoes.map(entry => {
      // If it's a filename and we have a mapping
      if (entry.includes('.') && fileToId[entry]) {
        changed = true;
        return fileToId[entry];
      }
      return entry;
    });

    if (changed) {
      await sql`UPDATE fichas SET condecoracoes = ${JSON.stringify(newCondecoracoes)}::jsonb WHERE slug = ${ficha.slug}`;
      console.log(`  ✅ ${ficha.slug}: migrada`);
      updated++;
    }
  }

  // 3. Final check: any remaining file-based entries?
  const check = await sql`SELECT slug, condecoracoes FROM fichas WHERE condecoracoes IS NOT NULL AND condecoracoes != '[]'::jsonb`;
  const remaining = [];
  for (const f of check) {
    for (const c of (f.condecoracoes || [])) {
      if (c.includes('.')) remaining.push({ slug: f.slug, entry: c });
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`Fichas atualizadas: ${updated}`);
  if (remaining.length > 0) {
    console.log(`⚠ Entradas legadas restantes:`);
    remaining.forEach(r => console.log(`  - ${r.slug}: ${r.entry}`));
  } else {
    console.log('✅ ZERO entradas legadas restantes! Todas migradas para IDs do banco.');
  }
}

migrate().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
