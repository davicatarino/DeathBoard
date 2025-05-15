import { NextResponse } from "next/server";
import { pool, query } from "@/config/db";

// GET: Buscar uma venda por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const results = await pool.query(
      `SELECT ve.*, v.nome AS nome_vendedor, v.email AS email_vendedor 
       FROM Vendas ve 
       JOIN Vendedores v ON ve.vendedor_id = v.id 
       WHERE ve.id = ?`,
      [id]
    );

    if (results.length === 0) {
      return NextResponse.json(
        { message: "Venda não encontrada." },
        { status: 404 }
      );
    }
    return NextResponse.json(results[0]);
  } catch (error) {
    console.error(`Erro ao buscar venda ${params.id}:`, error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao buscar venda." },
      { status: 500 }
    );
  }
}

// PUT: Atualizar uma venda por ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { vendedor_id, valor_venda, data_venda, descricao } = data;

    // Validação básica
    if (typeof valor_venda === "undefined" && !data_venda && !descricao && typeof vendedor_id === "undefined") {
      return NextResponse.json(
        { message: "Nenhum dado fornecido para atualização." },
        { status: 400 }
      );
    }

    // Validar se a venda existe
    const vendaExistente = await pool.query("SELECT id FROM Vendas WHERE id = ?", [id]);
    if (vendaExistente.length === 0) {
        return NextResponse.json({ message: "Venda não encontrada." }, { status: 404 });
    }

    // Validar se o vendedor_id (se fornecido) existe e está ativo
    if (vendedor_id) {
        const vendedorExistente = await pool.query("SELECT id FROM Vendedores WHERE id = ? AND ativo = TRUE", [vendedor_id]);
        if (vendedorExistente.length === 0) {
            return NextResponse.json({ message: "Vendedor não encontrado ou inativo." }, { status: 404 });
        }
    }

    const result = await pool.query("UPDATE Vendas SET ? WHERE id = ?", [data, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Venda não encontrada ou nenhum dado alterado." },
        { status: 404 }
      );
    }
    
    const vendaAtualizada = await pool.query(
        `SELECT ve.*, v.nome AS nome_vendedor, v.email AS email_vendedor 
         FROM Vendas ve 
         JOIN Vendedores v ON ve.vendedor_id = v.id 
         WHERE ve.id = ?`,
        [id]
      );
    return NextResponse.json(vendaAtualizada[0]);

  } catch (error) {
    console.error(`Erro ao atualizar venda ${params.id}:`, error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao atualizar venda." },
      { status: 500 }
    );
  }
}

// DELETE: Remover uma venda por ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await pool.query("DELETE FROM Vendas WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Venda não encontrada." },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 }); // HTTP 204 No Content

  } catch (error) {
    console.error(`Erro ao deletar venda ${params.id}:`, error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao deletar venda." },
      { status: 500 }
    );
  }
}

