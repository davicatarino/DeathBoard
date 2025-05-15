import mysql from "serverless-mysql";

// Certifique-se de que as variáveis de ambiente sejam configuradas
// ou substitua os valores diretamente aqui para teste.
// Em um ambiente de produção, use variáveis de ambiente.
export const pool = mysql({
  config: {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root", // Substitua pelo seu usuário do MySQL
    password: process.env.MYSQL_PASSWORD || "catarino", // Substitua pela sua senha
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    database: process.env.MYSQL_DATABASE || "deathboard", // Substitua pelo nome do seu banco
  },
});

// Função auxiliar para executar queries, opcional mas útil para logging ou tratamento centralizado
export async function query(sql, values) {
  try {
    const results = await pool.query(sql, values);
    await pool.end(); // Fecha a conexão após a query. Importante para serverless-mysql.
    return results;
  } catch (error) {
    // Adicione um log mais detalhado do erro no servidor
    console.error("Erro na query SQL:", { 
      sql: sql, 
      values: values, 
      errorMessage: error.message, 
      // stack: error.stack // Descomente para stack trace completo no log
    });
    // Retorne um erro ou lance-o para ser tratado pelo chamador
    // É importante não expor detalhes do erro SQL diretamente para o cliente em produção
    throw new Error("Erro ao executar a operação no banco de dados.");
  }
}

