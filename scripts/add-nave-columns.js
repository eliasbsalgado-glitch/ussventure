import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL);

async function run() {
  await sql`ALTER TABLE naves_crew ADD COLUMN IF NOT EXISTS classe TEXT DEFAULT ''`;
  await sql`ALTER TABLE naves_crew ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT ''`;
  await sql`ALTER TABLE naves_crew ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativa'`;
  console.log('Columns classe, tipo, status added to naves_crew!');
}

run().catch(e => { console.error(e); process.exit(1); });
