import { NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET: Listar todos os SDRs
export async function GET(request) {
  try {
    const [results] = await pool.query(
      "SELECT * FROM SDRs WHERE ativo = TRUE ORDER BY nome ASC"
    );
    
    // Converter para objetos JavaScript simples para evitar problemas de serialização
    const serializedResults = results.map(row => ({
      id: Number(row.id),
      nome: String(row.nome),
      email: String(row.email),
      foto_url: row.foto_url ? String(row.foto_url) : null,
      data_contratacao: row.data_contratacao ? row.data_contratacao.toISOString().split('T')[0] : null,
      ativo: Boolean(row.ativo),
      createdAt: row.createdAt ? row.createdAt.toISOString() : null
    }));

    return NextResponse.json(serializedResults);
  } catch (error) {
    console.error("Erro ao listar SDRs:", error.message);
    return NextResponse.json(
      { message: "Erro ao listar SDRs", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Criar um novo SDR
export async function POST(request) {
  try {
    const { nome, email, foto_url, data_contratacao } = await request.json();

    // Validação básica
    if (!nome || !email) {
      return NextResponse.json(
        { message: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO SDRs (nome, email, foto_url, data_contratacao, ativo) VALUES (?, ?, ?, ?, TRUE)",
      [nome, email, foto_url, data_contratacao]
    );

    return NextResponse.json({
      id: result[0].insertId,
      nome,
      email,
      foto_url,
      data_contratacao,
      ativo: true
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar SDR:", error.message);
    return NextResponse.json(
      { message: "Erro ao criar SDR", error: error.message },
      { status: 500 }
    );
  }
}
