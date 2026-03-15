// migrate-missoes.js — Cria tabela missoes e migra dados de naves_crew
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL);

async function main() {
  console.log('🔄 Criando tabela missoes...');
  await sql.query(`CREATE TABLE IF NOT EXISTS missoes (
    id TEXT PRIMARY KEY,
    nave_slug TEXT NOT NULL,
    titulo TEXT NOT NULL,
    data TEXT NOT NULL,
    texto TEXT DEFAULT '',
    autor_slug TEXT DEFAULT '',
    tripulantes JSONB DEFAULT '[]',
    diarios JSONB DEFAULT '[]',
    fotos JSONB DEFAULT '[]',
    criado_em TIMESTAMPTZ DEFAULT NOW()
  )`);
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_missoes_nave ON missoes (nave_slug)`);
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_missoes_data ON missoes (data DESC)`);
  console.log('✅ Tabela criada!');

  console.log('📦 Migrando missoes de naves_crew...');
  const rows = await sql`SELECT nave_slug, missoes FROM naves_crew`;
  let total = 0;
  for (const r of rows) {
    const missoes = r.missoes || [];
    for (const m of missoes) {
      const id = m.id || 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      await sql`
        INSERT INTO missoes (id, nave_slug, titulo, data, texto, autor_slug, tripulantes, diarios, fotos)
        VALUES (
          ${id}, ${r.nave_slug}, ${m.titulo || 'Missao'}, ${m.data || ''},
          ${m.texto || ''}, ${m.autorSlug || ''},
          ${JSON.stringify(m.tripulantes || [])}::jsonb,
          ${JSON.stringify(m.diarios || [])}::jsonb,
          ${JSON.stringify(m.fotos || [])}::jsonb
        )
        ON CONFLICT (id) DO NOTHING
      `;
      total++;
      console.log('  ✓', m.titulo || id);
    }
  }
  console.log(`🎉 ${total} missoes migradas!`);
}

main().catch(e => console.error('❌ Erro:', e));
