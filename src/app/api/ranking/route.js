import { NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET: Buscar o ranking de vendas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const data_inicio = searchParams.get("data_inicio");
    const data_fim = searchParams.get("data_fim");

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
      ${data_inicio && data_fim ? `AND ve.data_venda BETWEEN ? AND ?` : 
        data_inicio ? `AND ve.data_venda >= ?` : 
        data_fim ? `AND ve.data_venda <= ?` : ''}
      GROUP BY v.id, v.nome, v.email, v.foto_url
      ORDER BY faturamento_total DESC, numero_de_vendas DESC, nome_vendedor ASC;
    `;

    const queryParams = [];
    if (data_inicio && data_fim) {
      queryParams.push(data_inicio, data_fim);
    } else if (data_inicio) {
      queryParams.push(data_inicio);
    } else if (data_fim) {
      queryParams.push(data_fim);
    }

    const [results] = await pool.query(queryString, queryParams);
    
    // Converter os resultados para objetos JavaScript simples
    // para evitar problemas de serialização JSON
    const serializedResults = results.map(row => ({
      vendedor_id: Number(row.vendedor_id),
      nome_vendedor: String(row.nome_vendedor),
      email_vendedor: String(row.email_vendedor),
      foto_url: row.foto_url ? String(row.foto_url) : null,
      faturamento_total: Number(row.faturamento_total),
      numero_de_vendas: Number(row.numero_de_vendas)
    }));

    return NextResponse.json(serializedResults);
  } catch (error) {
    console.error("Erro ao buscar ranking de vendas:", error.message);
    return NextResponse.json(
      { message: "Erro no servidor ao buscar ranking de vendas.", error: error.message },
      { status: 500 }
    );
  }
}
