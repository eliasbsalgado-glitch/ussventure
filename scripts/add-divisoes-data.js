import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL);

async function run() {
  await sql`CREATE TABLE IF NOT EXISTS divisoes_data (
    divisao_slug TEXT PRIMARY KEY,
    descricao TEXT DEFAULT '',
    departamentos JSONB DEFAULT '[]'
  )`;
  console.log('Table divisoes_data created!');
}

run().catch(e => { console.error(e); process.exit(1); });
