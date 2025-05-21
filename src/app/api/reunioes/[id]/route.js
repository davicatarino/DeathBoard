import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function GET(_req, { params }) {
  const rows = await query(
    `SELECT r.id,r.titulo,r.descricao,r.data_agendamento,r.data_realizacao,r.status,
            r.cliente_nome,r.cliente_empresa,r.cliente_email,r.cliente_telefone,
            r.sdr_id,r.vendedor_id
     FROM Reunioes r WHERE r.id=?`,
    [params.id]
  );
  if (!rows.length) return NextResponse.json({ message: 'Não encontrado' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const updates = [];
  const values = [];
  [
    'sdr_id',
    'vendedor_id',
    'titulo',
    'descricao',
    'data_agendamento',
    'data_realizacao',
    'status',
    'cliente_nome',
    'cliente_empresa',
    'cliente_email',
    'cliente_telefone'
  ].forEach(k => {
    if (data[k] !== undefined) {
      updates.push(`${k}=?`);
      values.push(data[k]);
    }
  });
  if (!updates.length) return NextResponse.json({ message: 'Nada para atualizar' }, { status: 400 });
  values.push(params.id);
  await query(`UPDATE Reunioes SET ${updates.join(',')} WHERE id=?`, values);
  return NextResponse.json({ message: 'Atualizado' });
}

export async function DELETE(_req, { params }) {
  await query('DELETE FROM Reunioes WHERE id=?', [params.id]);
  return new NextResponse(null, { status: 204 });
}
