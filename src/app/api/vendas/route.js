// Path: /home/ubuntu/projects/nextjs-mysql-crud/src/app/api/vendas/route.js
import { NextResponse } from "next/server";
import { pool } from "@/config/db";

export async function GET(request) {
  try {
    // Exemplo: buscar todas as vendas, talvez com join para nome do vendedor
    // Você pode adicionar filtros por query params, ex: ?vendedor_id=1&mes=5&ano=2024
    const { searchParams } = new URL(request.url);
    const vendedorId = searchParams.get('vendedor_id');

    let queryString = `
      SELECT 
        ve.*, 
        v.nome as nome_vendedor 
      FROM Vendas ve
      JOIN Vendedores v ON ve.vendedor_id = v.id
    `;
    const queryParams = [];

    if (vendedorId) {
      queryString += " WHERE ve.vendedor_id = ?";
      queryParams.push(vendedorId);
    }

    queryString += " ORDER BY ve.data_venda DESC";

    const results = await pool.query(queryString, queryParams);
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    // Validação básica
    if (!data.vendedor_id || !data.valor_venda || !data.data_venda) {
      return NextResponse.json(
        { message: "Campos vendedor_id, valor_venda e data_venda são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificar se o vendedor existe e está ativo
    const [vendedor] = await pool.query("SELECT ativo FROM Vendedores WHERE id = ?", [data.vendedor_id]);
    if (!vendedor || !vendedor.ativo) {
        return NextResponse.json(
            { message: "Vendedor não encontrado ou inativo." },
            { status: 404 }
        );
    }

    const result = await pool.query("INSERT INTO Vendas SET ?", data);
    
    return NextResponse.json({
      ...data,
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

