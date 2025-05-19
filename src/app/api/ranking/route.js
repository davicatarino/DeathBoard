import { NextResponse } from "next/server";
import { pool, query } from "@/config/db";

// GET: Buscar o ranking de vendas
export async function GET(request) {
  try {
    const queryString = `
      SELECT 
        v.id AS vendedor_id,
        v.nome AS nome_vendedor,
        v.email AS email_vendedor,
        v.foto_url,
        COALESCE(SUM(ve.valor_venda), 0) AS faturamento_total,
        COUNT(ve.id) AS numero_de_vendas
      FROM Vendedores v
      LEFT JOIN Vendas ve ON v.id = ve.vendedor_id
      WHERE v.ativo = TRUE
      GROUP BY v.id, v.nome, v.email, v.foto_url
      ORDER BY faturamento_total DESC, numero_de_vendas DESC, nome_vendedor ASC;
    `;

    const results = await pool.query(queryString);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro ao buscar ranking de vendas:", error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao buscar ranking de vendas." },
      { status: 500 }
    );
  }
}


