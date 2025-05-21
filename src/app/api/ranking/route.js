import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('data_inicio');   // yyyy-mm-dd
    const end   = searchParams.get('data_fim');

    let joinDate = '';
    const params = [];
    if (start && end) { joinDate = ' AND ve.data_venda BETWEEN ? AND ?'; params.push(start, end); }
    else if (start)   { joinDate = ' AND ve.data_venda >= ?';            params.push(start);       }
    else if (end)     { joinDate = ' AND ve.data_venda <= ?';            params.push(end);         }

    const sql = `
      SELECT 
        v.id                    AS vendedor_id,
        v.nome                  AS nome_vendedor,
        v.email                 AS email_vendedor,
        v.foto_url,
        COALESCE(SUM(ve.valor_venda),0) AS faturamento_total,
        COUNT(ve.id)                   AS numero_de_vendas
      FROM Vendedores v
      LEFT JOIN Vendas ve
             ON v.id = ve.vendedor_id
            ${joinDate}
      WHERE v.ativo = TRUE
      GROUP BY v.id
      ORDER BY faturamento_total DESC,
               numero_de_vendas DESC,
               v.nome ASC;
    `;

    const rows = await query(sql, params);

    return NextResponse.json(rows.map(r => ({
      vendedor_id: Number(r.vendedor_id),
      nome_vendedor: String(r.nome_vendedor),
      email_vendedor: String(r.email_vendedor),
      foto_url: r.foto_url ?? null,
      faturamento_total: Number(r.faturamento_total),
      numero_de_vendas: Number(r.numero_de_vendas)
    })));
  } catch (err) {
    console.error('Erro ao buscar ranking de vendas:', err.message);
    return NextResponse.json({ message: 'Erro no servidor', error: err.message }, { status: 500 });
  }
}
