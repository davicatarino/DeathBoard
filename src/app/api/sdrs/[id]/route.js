import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function GET(_req, { params }) {
  const rows = await query('SELECT * FROM SDRs WHERE id = ?', [params.id]);
  return rows.length
    ? NextResponse.json(rows[0])
    : NextResponse.json({ message: 'SDR não encontrado' }, { status: 404 });
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const updates = []; const values = [];
  ['nome','email','foto_url','ativo'].forEach(k => {
    if (data[k] !== undefined) { updates.push(`${k} = ?`); values.push(data[k]); }
  });
  if (!updates.length)
    return NextResponse.json({ message: 'Nada para atualizar' }, { status: 400 });

  values.push(params.id);
  await query(`UPDATE SDRs SET ${updates.join(', ')} WHERE id = ?`, values);
  return NextResponse.json({ message: 'Atualizado com sucesso' });
}

export async function DELETE(_req, { params }) {
  await query('UPDATE SDRs SET ativo = FALSE WHERE id = ?', [params.id]);
  return new NextResponse(null, { status: 204 });
}
