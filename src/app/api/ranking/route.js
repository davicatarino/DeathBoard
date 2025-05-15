// Path: /home/ubuntu/projects/nextjs-mysql-crud/src/app/api/ranking/route.js
import { NextResponse } from "next/server";
import { pool } from "@/config/db";

export async function GET() {
  try {
    const query = `
      SELECT
        v.id AS vendedor_id,
        v.nome AS nome_vendedor,
        v.email AS email_vendedor,
        COALESCE(SUM(ve.valor_venda), 0) AS faturamento_total,
        COUNT(ve.id) AS numero_de_vendas
      FROM
        Vendedores v
      LEFT JOIN
        Vendas ve ON v.id = ve.vendedor_id
      WHERE
        v.ativo = TRUE
      GROUP BY
        v.id, v.nome, v.email
      ORDER BY
        faturamento_total DESC, numero_de_vendas DESC, nome_vendedor ASC;
    `;
    const results = await pool.query(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

