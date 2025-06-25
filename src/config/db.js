import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE || 'deathboard',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
});

// Função para testar a conexão
export async function testConnection() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Conexão com banco de dados estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error.message);
    return false;
  }
}

// Função principal para executar queries
export async function query(sql, values = []) {
  try {
    const results = await db.query(sql, values);
    return results;
  } catch (error) {
    console.error('Erro na query:', error);
    throw new Error(`Erro no banco de dados: ${error.message}`);
  }
}

// Função para fechar a conexão (útil para testes)
export async function end() {
  await db.end();
}

export default db;

