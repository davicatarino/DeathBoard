// Path: /home/ubuntu/projects/nextjs-mysql-crud/src/app/api/vendedores/route.js
import { NextResponse } from "next/server";
import { pool } from "@/config/db"; // Ajuste o caminho se o db.js estiver em outro local

export async function GET() {
  try {
    const results = await pool.query("SELECT * FROM Vendedores WHERE ativo = TRUE ORDER BY nome ASC");
    return NextResponse.json(results);
  } catch (error) {
    console.error(error); // Log do erro no servidor
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    // Validação básica dos dados (pode ser mais robusta)
    if (!data.nome) {
      return NextResponse.json(
        { message: "O nome do vendedor é obrigatório." },
        { status: 400 }
      );
    }

    const result = await pool.query("INSERT INTO Vendedores SET ?", data);
    
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

