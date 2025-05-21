import { NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET: Buscar o ranking de SDRs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const data_inicio = searchParams.get("data_inicio");
    const data_fim = searchParams.get("data_fim");

    const queryString = `
      SELECT 
        s.id AS sdr_id,
        s.nome AS nome_sdr,
        s.email AS email_sdr,
        s.foto_url,
        COUNT(r.id) AS total_reunioes_agendadas,
        SUM(CASE WHEN r.status = 'realizada' THEN 1 ELSE 0 END) AS total_reunioes_realizadas,
        ROUND((SUM(CASE WHEN r.status = 'realizada' THEN 1 ELSE 0 END) / COUNT(r.id)) * 100, 2) AS taxa_conversao
      FROM SDRs s
      LEFT JOIN Reunioes r ON s.id = r.sdr_id
      WHERE s.ativo = TRUE
      ${data_inicio && data_fim ? `AND r.data_agendamento BETWEEN ? AND ?` : 
        data_inicio ? `AND r.data_agendamento >= ?` : 
        data_fim ? `AND r.data_agendamento <= ?` : ''}
      GROUP BY s.id, s.nome, s.email, s.foto_url
      ORDER BY total_reunioes_agendadas DESC, total_reunioes_realizadas DESC, nome_sdr ASC;
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
      sdr_id: Number(row.sdr_id),
      nome_sdr: String(row.nome_sdr),
      email_sdr: String(row.email_sdr),
      foto_url: row.foto_url ? String(row.foto_url) : null,
      total_reunioes_agendadas: Number(row.total_reunioes_agendadas),
      total_reunioes_realizadas: Number(row.total_reunioes_realizadas),
      taxa_conversao: Number(row.taxa_conversao)
    }));

    return NextResponse.json(serializedResults);
  } catch (error) {
    console.error("Erro ao buscar ranking de SDRs:", error.message);
    return NextResponse.json(
      { message: "Erro no servidor ao buscar ranking de SDRs.", error: error.message },
      { status: 500 }
    );
  }
}
