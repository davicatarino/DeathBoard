// src/app/api/reunioes/route.js
import { NextResponse } from "next/server";
import { query } from "@/config/db";

export async function GET() {
  const rows = await query(
    `SELECT r.id,r.sdr_id,s.nome AS nome_sdr,r.cliente,r.data_reuniao,r.status FROM Reunioes r JOIN SDRs s ON s.id=r.sdr_id ORDER BY r.data_reuniao DESC LIMIT 200`
  );
  return NextResponse.json(rows);
}
