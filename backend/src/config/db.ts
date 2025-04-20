import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:150702leoo@db.pbkkmegehdjarewwsaji.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões com Supabase
  },
});

export default pool;