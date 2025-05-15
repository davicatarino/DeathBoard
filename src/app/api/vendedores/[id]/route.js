// Path: /home/ubuntu/projects/nextjs-mysql-crud/src/app/api/vendedores/[id]/route.js
import { NextResponse } from "next/server";
import { pool } from "@/config/db";

export async function GET(request, { params }) {
  try {
    const result = await pool.query("SELECT * FROM Vendedores WHERE id = ?", [
      params.id,
    ]);
    if (result.length === 0) {
      return NextResponse.json(
        { message: "Vendedor não encontrado." },
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
    // Validação básica (pode ser mais robusta)
    if (!data.nome && !data.email && typeof data.ativo === 'undefined' && !data.data_contratacao) {
        return NextResponse.json(
            { message: "Nenhum dado fornecido para atualização." },
            { status: 400 }
        );
    }

    const result = await pool.query("UPDATE Vendedores SET ? WHERE id = ?", [
      data,
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Vendedor não encontrado para atualização." },
        { status: 404 }
      );
    }

    const updatedVendedor = await pool.query("SELECT * FROM Vendedores WHERE id = ?", [params.id]);
    return NextResponse.json(updatedVendedor[0]);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// Para "deletar" (desativar) um vendedor
export async function DELETE(request, { params }) {
  try {
    const result = await pool.query("UPDATE Vendedores SET ativo = FALSE WHERE id = ?", [
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Vendedor não encontrado para desativar." },
        { status: 404 }
      );
    }
    // Retorna 204 No Content, prática comum para DELETE bem-sucedido
    return new NextResponse(null, { status: 204 }); 

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

