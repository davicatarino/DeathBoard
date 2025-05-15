import { NextResponse } from "next/server";
import { pool, query } from "@/config/db"; // Ajuste o caminho se o db.js estiver em outro local

// GET: Buscar todos os vendedores ativos
export async function GET(request) {
  try {
    const results = await pool.query("SELECT * FROM Vendedores WHERE ativo = TRUE ORDER BY nome ASC");
    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro ao buscar vendedores:", error);
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao buscar vendedores." },
      { status: 500 }
    );
  }
}

// POST: Criar um novo vendedor
export async function POST(request) {
  try {
    const data = await request.json();
    const { nome, email, data_contratacao } = data;

    // Validação básica dos dados (pode ser mais robusta)
    if (!nome || !email) {
      return NextResponse.json(
        { message: "Nome e email do vendedor são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await pool.query("INSERT INTO Vendedores SET ?", data);
    
    return NextResponse.json({
      id: result.insertId,
      ...data,
    });
  } catch (error) {
    console.error("Erro ao criar vendedor:", error);
    // Verificar erro de entrada duplicada para o email
    if (error.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
            { message: "Email já cadastrado." },
            { status: 409 } // 409 Conflict
        );
    }
    return NextResponse.json(
      { message: error.message || "Erro no servidor ao criar vendedor." },
      { status: 500 }
    );
  }
}

