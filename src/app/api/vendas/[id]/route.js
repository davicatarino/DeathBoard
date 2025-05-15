// Path: /home/ubuntu/projects/nextjs-mysql-crud/src/app/api/vendas/[id]/route.js
import { NextResponse } from "next/server";
import { pool } from "@/config/db";

export async function GET(request, { params }) {
  try {
    const result = await pool.query("SELECT ve.*, v.nome as nome_vendedor FROM Vendas ve JOIN Vendedores v ON ve.vendedor_id = v.id WHERE ve.id = ?", [params.id]);
    if (result.length === 0) {
      return NextResponse.json(
        { message: "Venda não encontrada." },
        { status: 404 }
      );
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    // Validação básica
    if (!data.vendedor_id && !data.valor_venda && !data.data_venda && !data.descricao) {
        return NextResponse.json(
            { message: "Nenhum dado fornecido para atualização." },
            { status: 400 }
        );
    }

    // Opcional: Verificar se o vendedor existe e está ativo antes de atualizar a venda
    if (data.vendedor_id) {
        const [vendedor] = await pool.query("SELECT ativo FROM Vendedores WHERE id = ?", [data.vendedor_id]);
        if (!vendedor || !vendedor.ativo) {
            return NextResponse.json(
                { message: "Vendedor associado à venda não encontrado ou inativo." },
                { status: 404 }
            );
        }
    }

    const result = await pool.query("UPDATE Vendas SET ? WHERE id = ?", [
      data,
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Venda não encontrada para atualização." },
        { status: 404 }
      );
    }
    const updatedVenda = await pool.query("SELECT ve.*, v.nome as nome_vendedor FROM Vendas ve JOIN Vendedores v ON ve.vendedor_id = v.id WHERE ve.id = ?", [params.id]);
    return NextResponse.json(updatedVenda[0]);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const result = await pool.query("DELETE FROM Vendas WHERE id = ?", [params.id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Venda não encontrada para deletar." },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 }); 

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

