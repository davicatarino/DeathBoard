import { NextResponse } from "next/server";
import { pool, query } from "@/config/db";

// GET: Buscar todas as vendas (pode adicionar filtros por query params, ex: ?vendedor_id=1&mes=5&ano=2024)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendedorId = searchParams.get('vendedor_id');
    // Adicionar mais filtros conforme necessário (mês, ano, etc.)

    let queryString = `
      SELECT 
        ve.*, 
        v.nome AS nome_vendedor,
        v.email AS email_vendedor
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
    console.error("Erro ao buscar vendas:", error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao buscar vendas." },
      { status: 500 }
    );
  }
}

// POST: Criar uma nova venda
export async function POST(request) {
  try {
    const data = await request.json();
    const { vendedor_id, valor_venda, data_venda, descricao } = data;

    if (!vendedor_id || typeof valor_venda === 'undefined' || !data_venda) {
      return NextResponse.json(
        { message: "ID do vendedor, valor da venda e data da venda são obrigatórios." },
        { status: 400 }
      );
    }
    
    // Validar se o vendedor existe
    const vendedorExistente = await pool.query("SELECT id FROM Vendedores WHERE id = ? AND ativo = TRUE", [vendedor_id]);
    if (vendedorExistente.length === 0) {
        return NextResponse.json({ message: "Vendedor não encontrado ou inativo." }, { status: 404 });
    }

    const result = await pool.query("INSERT INTO Vendas SET ?", data);
    
    return NextResponse.json({
      id: result.insertId,
      ...data,
    });
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao criar venda." },
      { status: 500 }
    );
  }
}

