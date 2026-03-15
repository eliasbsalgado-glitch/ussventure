// Script de migracao: JSON → Vercel Postgres (Neon)
// Executar uma unica vez apos criar o banco:
//   node scripts/migrate.js
//
// Requer POSTGRES_URL no ambiente (setar via .env.local ou Vercel CLI)

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL nao definida. Rode: vercel env pull .env.local');
  process.exit(1);
}

const sql = neon(POSTGRES_URL);
const DATA_DIR = path.join(__dirname, '..', 'data');

function loadJSON(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

async function createSchema() {
  console.log('📦 Criando schema...');
  const schemaSQL = fs.readFileSync(path.join(__dirname, '..', 'lib', 'schema.sql'), 'utf-8');
  // Strip comments and split into statements
  const cleaned = schemaSQL.replace(/--.*$/gm, '');
  const statements = cleaned.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    console.log('  ▸ Executando:', stmt.substring(0, 60) + '...');
    await sql.query(stmt);
  }
  console.log('✅ Schema criado!');
}

async function migrateFichas() {
  const fichas = loadJSON('fichas.json');
  if (!fichas) { console.log('⚠️ fichas.json nao encontrado, pulando...'); return; }

  console.log(`📋 Migrando ${fichas.length} fichas...`);
  let count = 0;

  for (const f of fichas) {
    await sql`
      INSERT INTO fichas (slug, nome, nascimento_sl, cidade, raca, admissao, patente, divisao, departamento, foto, historia, timeline, condecoracoes, cursos, diarios, created_at)
      VALUES (
        ${f.slug},
        ${f.nome || ''},
        ${f.nascimentoSL || ''},
        ${f.cidade || ''},
        ${f.raca || ''},
        ${f.admissao || ''},
        ${f.patente || ''},
        ${f.divisao || ''},
        ${f.departamento || ''},
        ${f.foto || ''},
        ${f.historia || ''},
        ${JSON.stringify(f.timeline || [])},
        ${JSON.stringify(f.condecoracoes || [])},
        ${JSON.stringify(f.cursos || [])},
        ${JSON.stringify(f.diarios || [])},
        ${f.createdAt || new Date().toISOString()}
      )
      ON CONFLICT (slug) DO UPDATE SET
        nome = EXCLUDED.nome,
        patente = EXCLUDED.patente,
        divisao = EXCLUDED.divisao,
        timeline = EXCLUDED.timeline,
        condecoracoes = EXCLUDED.condecoracoes,
        diarios = EXCLUDED.diarios
    `;
    count++;
    if (count % 50 === 0) console.log(`  ... ${count}/${fichas.length}`);
  }
  console.log(`✅ ${count} fichas migradas!`);
}

async function migrateUsers() {
  const users = loadJSON('users.json');
  if (!users) { console.log('⚠️ users.json nao encontrado, pulando...'); return; }

  const entries = Object.entries(users);
  console.log(`👤 Migrando ${entries.length} usuarios...`);

  for (const [login, u] of entries) {
    await sql`
      INSERT INTO users (login, senha, role, ficha_slug)
      VALUES (${login}, ${u.senha}, ${u.role}, ${u.fichaSlug || null})
      ON CONFLICT (login) DO UPDATE SET
        senha = EXCLUDED.senha,
        role = EXCLUDED.role,
        ficha_slug = EXCLUDED.ficha_slug
    `;
  }
  console.log(`✅ ${entries.length} usuarios migrados!`);
}

async function migrateAgenda() {
  const agenda = loadJSON('agenda.json');
  if (!agenda || !agenda.eventos) { console.log('⚠️ agenda.json nao encontrado, pulando...'); return; }

  console.log(`📅 Migrando ${agenda.eventos.length} eventos...`);

  for (const e of agenda.eventos) {
    await sql`
      INSERT INTO agenda_eventos (id, divisao, divisao_nome, divisao_cor, titulo, data, texto, autor_slug, criado_em)
      VALUES (${e.id}, ${e.divisao}, ${e.divisaoNome || ''}, ${e.divisaoCor || '#888'}, ${e.titulo}, ${e.data}, ${e.texto || ''}, ${e.autorSlug || ''}, ${e.criadoEm || new Date().toISOString()})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`✅ ${agenda.eventos.length} eventos migrados!`);
}

async function migrateNavesCrew() {
  const crew = loadJSON('naves_crew.json');
  if (!crew) { console.log('⚠️ naves_crew.json nao encontrado, pulando...'); return; }

  const entries = Object.entries(crew);
  console.log(`🚀 Migrando ${entries.length} naves...`);

  for (const [slug, data] of entries) {
    await sql`
      INSERT INTO naves_crew (nave_slug, capitao_slug, tripulantes, missoes, fotos)
      VALUES (${slug}, ${data.capitaoSlug || null}, ${JSON.stringify(data.tripulantes || [])}, ${JSON.stringify(data.missoes || [])}, ${JSON.stringify(data.fotos || [])})
      ON CONFLICT (nave_slug) DO UPDATE SET
        capitao_slug = EXCLUDED.capitao_slug,
        tripulantes = EXCLUDED.tripulantes,
        missoes = EXCLUDED.missoes,
        fotos = EXCLUDED.fotos
    `;
  }
  console.log(`✅ ${entries.length} naves migradas!`);
}

async function main() {
  console.log('🔄 Iniciando migracao JSON → Postgres...\n');

  await createSchema();
  await migrateFichas();
  await migrateUsers();
  await migrateAgenda();
  await migrateNavesCrew();

  console.log('\n🎉 Migracao concluida com sucesso!');
}

main().catch(err => {
  console.error('❌ Erro na migracao:', err);
  process.exit(1);
});
