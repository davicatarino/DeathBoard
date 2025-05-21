import { NextResponse } from "next/server";
import { query } from "@/config/db";

export async function GET(_req, { params }) {
  const rows = await query(`SELECT r.id,r.sdr_id,s.nome AS nome_sdr,r.cliente,r.data_reuniao,r.status FROM Reunioes r JOIN SDRs s ON s.id=r.sdr_id WHERE r.id=?`, [params.id]);
  if (!rows.length) return NextResponse.json({ message: "Nao encontrado" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const updates = [];
  const values = [];
  ["sdr_id", "cliente", "data_reuniao", "status"].forEach((k) => {
    if (data[k] !== undefined) {
      updates.push(`${k}=?`);
      values.push(data[k]);
    }
  });
  if (!updates.length) return NextResponse.json({ message: "Nada a atualizar" }, { status: 400 });
  values.push(params.id);
  await query(`UPDATE Reunioes SET ${updates.join(",")} WHERE id=?`, values);
  return NextResponse.json({ message: "Atualizado" });
}

export async function DELETE(_req, { params }) {
  await query(`DELETE FROM Reunioes WHERE id=?`, [params.id]);
  return new NextResponse(null, { status: 204 });
}
