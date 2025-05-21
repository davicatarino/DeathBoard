// src/app/api/reunioes/route.js
import { NextResponse } from "next/server";
import { query } from "@/config/db";

export async function GET() {
  const rows = await query(
    `SELECT r.id,r.sdr_id,s.nome AS nome_sdr,r.cliente,r.data_reuniao,r.status FROM Reunioes r JOIN SDRs s ON s.id=r.sdr_id ORDER BY r.data_reuniao DESC LIMIT 200`
  );
  return NextResponse.json(rows);
}

export async function POST(request) {
  const { sdr_id, cliente, data_reuniao, status } = await request.json();
  if (!sdr_id || !cliente || !data_reuniao) return NextResponse.json({ message: "Campos obrigatorios" }, { status: 400 });
  const { insertId } = await query(`INSERT INTO Reunioes SET ?`, { sdr_id, cliente, data_reuniao, status: status || "AGENDADA" });
  return NextResponse.json({ id: insertId, sdr_id, cliente, data_reuniao, status: status || "AGENDADA" });
}
