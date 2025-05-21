import mysql from 'serverless-mysql';

// ---------- Pool global e reutilizável -----------
const config = {
  host:     process.env.MYSQL_HOST     || 'localhost',
  user:     process.env.MYSQL_USER     || 'root',
  password: process.env.MYSQL_PASSWORD || 'catarino',
  port:     Number(process.env.MYSQL_PORT || '3306'),
  database: process.env.MYSQL_DATABASE || 'deathboard',
};

const pool = globalThis._mysqlPool ?? mysql({ config });
if (!globalThis._mysqlPool) globalThis._mysqlPool = pool;

// ---------- Helper de query seguro -----------
export async function query(sql, values = []) {
  try {
    return await pool.query(sql, values);
  } catch (err) {
    console.error('MySQL error:', { sql, values, message: err.message });
    throw err;
  }
}

export { pool };        // acesso opcional baixo-nível
