import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function GET(req, { params }) {
  try {
    const rows = await query('SELECT * FROM Vendedores WHERE id = ?', [params.id]);
    return rows.length
      ? NextResponse.json(rows[0])
      : NextResponse.json({ message: 'Vendedor não encontrado' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ message: 'Erro no servidor', error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const data = await req.json();
    const updates = []; const values = [];
    ['nome','email','foto_url','ativo'].forEach(k => {
      if (data[k] !== undefined) { updates.push(`${k} = ?`); values.push(data[k]); }
    });
    if (!updates.length)
      return NextResponse.json({ message: 'Nada para atualizar' }, { status: 400 });

    values.push(params.id);
    await query(`UPDATE Vendedores SET ${updates.join(', ')} WHERE id = ?`, values);
    return NextResponse.json({ message: 'Atualizado com sucesso' });
  } catch (err) {
    return NextResponse.json({ message: 'Erro no servidor', error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await query('UPDATE Vendedores SET ativo = FALSE WHERE id = ?', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ message: 'Erro no servidor', error: err.message }, { status: 500 });
  }
}
