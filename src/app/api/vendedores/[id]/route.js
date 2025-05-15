import { NextResponse } from "next/server";
import { pool, query } from "@/config/db"; // Ajuste o caminho se o db.js estiver em outro local

// GET: Buscar um vendedor por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const results = await pool.query("SELECT * FROM Vendedores WHERE id = ? AND ativo = TRUE", [id]);

    if (results.length === 0) {
      return NextResponse.json(
        { message: "Vendedor não encontrado ou inativo." },
        { status: 404 }
      );
    }
    return NextResponse.json(results[0]);
  } catch (error) {
    console.error(`Erro ao buscar vendedor ${params.id}:`, error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao buscar vendedor." },
      { status: 500 }
    );
  }
}

// PUT: Atualizar um vendedor por ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { nome, email, data_contratacao, ativo } = data;

    // Validação básica (pode ser mais robusta)
    if (!nome && !email && typeof data_contratacao === "undefined" && typeof ativo === "undefined") {
      return NextResponse.json(
        { message: "Nenhum dado fornecido para atualização." },
        { status: 400 }
      );
    }

    // Verifica se o vendedor existe antes de tentar atualizar
    const vendedorExistente = await pool.query("SELECT * FROM Vendedores WHERE id = ?", [id]);
    if (vendedorExistente.length === 0) {
        return NextResponse.json({ message: "Vendedor não encontrado." }, { status: 404 });
    }

    const result = await pool.query("UPDATE Vendedores SET ? WHERE id = ?", [data, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Vendedor não encontrado ou nenhum dado alterado." }, // Pode ser que o ID não exista
        { status: 404 } // Ou 304 Not Modified se os dados forem os mesmos, mas 404 é mais simples aqui
      );
    }

    const vendedorAtualizado = await pool.query("SELECT * FROM Vendedores WHERE id = ?", [id]);
    return NextResponse.json(vendedorAtualizado[0]);

  } catch (error) {
    console.error(`Erro ao atualizar vendedor ${params.id}:`, error);
    if (error.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
            { message: "Email já cadastrado por outro vendedor." },
            { status: 409 } // 409 Conflict
        );
    }
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao atualizar vendedor." },
      { status: 500 }
    );
  }
}

// DELETE: Remover (desativar) um vendedor por ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Em vez de deletar, vamos marcar como inativo
    // const result = await pool.query("DELETE FROM Vendedores WHERE id = ?", [id]); 
    const result = await pool.query("UPDATE Vendedores SET ativo = FALSE WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Vendedor não encontrado." },
        { status: 404 }
      );
    }
    // HTTP 204 No Content é apropriado para DELETE bem-sucedido sem corpo de resposta
    return new NextResponse(null, { status: 204 }); 

  } catch (error) {
    console.error(`Erro ao deletar vendedor ${params.id}:`, error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao deletar vendedor." },
      { status: 500 }
    );
  }
}

