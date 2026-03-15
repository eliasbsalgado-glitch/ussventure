import { neon } from '@neondatabase/serverless';

// Usa a variável POSTGRES_URL que a Vercel injeta automaticamente
const sql = neon(process.env.POSTGRES_URL);

export default sql;
