import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function GET() {
  const sql = `
    SELECT
      r.id,
      r.titulo,
      r.descricao,
      r.data_agendamento,
      r.data_realizacao,
      r.status,
      r.cliente_nome,
      r.cliente_empresa,
      r.cliente_email,
      r.cliente_telefone,
      s.id AS sdr_id,
      s.nome AS nome_sdr,
      v.id AS vendedor_id,
      v.nome AS nome_vendedor
    FROM Reunioes r
    LEFT JOIN SDRs s ON s.id=r.sdr_id
    LEFT JOIN Vendedores v ON v.id=r.vendedor_id
    ORDER BY r.data_agendamento DESC
    LIMIT 200
  `;
  try {
    return NextResponse.json(await query(sql));
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { sdr_id, titulo, data_agendamento } = body;
  if (!sdr_id || !titulo || !data_agendamento)
    return NextResponse.json({ message: 'Campos obrigatórios: sdr_id, titulo, data_agendamento' }, { status: 400 });
  const payload = {
    sdr_id,
    vendedor_id: body.vendedor_id ?? null,
    titulo,
    descricao: body.descricao ?? null,
    data_agendamento,
    status: body.status ?? 'agendada',
    cliente_nome: body.cliente_nome ?? null,
    cliente_empresa: body.cliente_empresa ?? null,
    cliente_email: body.cliente_email ?? null,
    cliente_telefone: body.cliente_telefone ?? null
  };
  try {
    const { insertId } = await query('INSERT INTO Reunioes SET ?', payload);
    return NextResponse.json({ id: insertId, ...payload });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
