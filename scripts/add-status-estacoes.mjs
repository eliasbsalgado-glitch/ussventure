import {neon} from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL);
await sql`ALTER TABLE estacoes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativa'`;
console.log('OK - coluna status adicionada');
