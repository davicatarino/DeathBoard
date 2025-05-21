import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('data_inicio');
  const end = searchParams.get('data_fim');
  let joinDate = '';
  const params = [];
  if (start && end) {
    joinDate = ' AND r.data_reuniao BETWEEN ? AND ?';
    params.push(start, end);
  } else if (start) {
    joinDate = ' AND r.data_reuniao >= ?';
    params.push(start);
  } else if (end) {
    joinDate = ' AND r.data_reuniao <= ?';
    params.push(end);
  }
  const sql = `
    SELECT
      s.id AS sdr_id,
      s.nome AS nome_sdr,
      s.email AS email_sdr,
      s.foto_url,
      COUNT(r.id) AS total_reunioes_agendadas,
      SUM(r.status = 'REALIZADA') AS total_reunioes_realizadas,
      ROUND(100 * SUM(r.status = 'REALIZADA') / NULLIF(COUNT(r.id),0), 2) AS taxa_conversao
    FROM SDRs s
    LEFT JOIN Reunioes r
      ON s.id = r.sdr_id
      ${joinDate}
    WHERE s.ativo = TRUE
    GROUP BY s.id
    ORDER BY taxa_conversao DESC, total_reunioes_agendadas DESC, s.nome ASC
  `;
  try {
    const rows = await query(sql, params);
    return NextResponse.json(rows.map(r => ({
      sdr_id: Number(r.sdr_id),
      nome_sdr: String(r.nome_sdr),
      email_sdr: String(r.email_sdr),
      foto_url: r.foto_url ?? null,
      total_reunioes_agendadas: Number(r.total_reunioes_agendadas),
      total_reunioes_realizadas: Number(r.total_reunioes_realizadas),
      taxa_conversao: Number(r.taxa_conversao)
    })));
  } catch (err) {
    return NextResponse.json({ message: 'Erro no servidor', error: err.message }, { status: 500 });
  }
}
