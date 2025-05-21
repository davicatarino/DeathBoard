import { NextResponse } from 'next/server';
import { query } from '@/config/db';

// GET – lista de vendedores (filtra ?ativo=true/false opcional)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ativo = searchParams.get('ativo');

    let sql = 'SELECT * FROM Vendedores';
    const params = [];
    if (ativo !== null) { sql += ' WHERE ativo = ?'; params.push(ativo === 'true'); }
    sql += ' ORDER BY nome ASC';

    return NextResponse.json(await query(sql, params));
  } catch (err) {
    console.error('Erro ao buscar vendedores:', err.message);
    return NextResponse.json({ message: 'Erro no servidor', error: err.message }, { status: 500 });
  }
}

// POST – cria vendedor
export async function POST(request) {
  try {
    const { nome, email, foto_url } = await request.json();
    if (!nome || !email)
      return NextResponse.json({ message: 'Nome e e-mail obrigatórios' }, { status: 400 });

    const dup = await query('SELECT 1 FROM Vendedores WHERE email = ?', [email]);
    if (dup.length)
      return NextResponse.json({ message: 'Email já cadastrado.' }, { status: 409 });

    const { insertId } = await query('INSERT INTO Vendedores SET ?', {
      nome, email, foto_url: foto_url ?? null, ativo: true,
    });

    return NextResponse.json({ id: insertId, nome, email, foto_url: foto_url ?? null, ativo: true });
  } catch (err) {
    console.error('Erro ao criar vendedor:', err.message);
    return NextResponse.json({ message: 'Erro no servidor', error: err.message }, { status: 500 });
  }
}
