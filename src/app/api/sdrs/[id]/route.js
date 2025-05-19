import { NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET: Obter detalhes de um SDR específico
export async function GET(request, { params }) {
  try {
    const [results] = await pool.query(
      "SELECT * FROM SDRs WHERE id = ?",
      [params.id]
    );

    if (results.length === 0) {
      return NextResponse.json(
        { message: "SDR não encontrado" },
        { status: 404 }
      );
    }

    // Converter para objeto JavaScript simples para evitar problemas de serialização
    const sdr = results[0];
    const serializedSdr = {
      id: Number(sdr.id),
      nome: String(sdr.nome),
      email: String(sdr.email),
      foto_url: sdr.foto_url ? String(sdr.foto_url) : null,
      data_contratacao: sdr.data_contratacao ? sdr.data_contratacao.toISOString().split('T')[0] : null,
      ativo: Boolean(sdr.ativo),
      createdAt: sdr.createdAt ? sdr.createdAt.toISOString() : null
    };

    return NextResponse.json(serializedSdr);
  } catch (error) {
    console.error(`Erro ao buscar SDR ${params.id}:`, error.message);
    return NextResponse.json(
      { message: "Erro ao buscar SDR", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Atualizar um SDR existente
export async function PUT(request, { params }) {
  try {
    const { nome, email, foto_url, data_contratacao, ativo } = await request.json();

    // Validação básica
    if (!nome || !email) {
      return NextResponse.json(
        { message: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE SDRs SET nome = ?, email = ?, foto_url = ?, data_contratacao = ?, ativo = ? WHERE id = ?",
      [nome, email, foto_url, data_contratacao, ativo, params.id]
    );

    return NextResponse.json({
      id: Number(params.id),
      nome,
      email,
      foto_url,
      data_contratacao,
      ativo
    });
  } catch (error) {
    console.error(`Erro ao atualizar SDR ${params.id}:`, error.message);
    return NextResponse.json(
      { message: "Erro ao atualizar SDR", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Desativar um SDR (soft delete)
export async function DELETE(request, { params }) {
  try {
    await pool.query(
      "UPDATE SDRs SET ativo = FALSE WHERE id = ?",
      [params.id]
    );

    return NextResponse.json({ message: "SDR desativado com sucesso" });
  } catch (error) {
    console.error(`Erro ao desativar SDR ${params.id}:`, error.message);
    return NextResponse.json(
      { message: "Erro ao desativar SDR", error: error.message },
      { status: 500 }
    );
  }
}
