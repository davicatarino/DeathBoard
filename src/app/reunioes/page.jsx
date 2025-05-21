"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReunioesPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch("/api/reunioes")
      .then(r => {
        if (!r.ok) throw new Error("Falha ao buscar reuniões");
        return r.json();
      })
      .then(setDados)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Carregando…</p>;
  if (erro) return <p className="p-4 text-red-500">{erro}</p>;
  if (!dados.length) return <p className="p-4">Nenhuma reunião encontrada.</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reuniões</h1>
        <Link href="/reunioes/novo" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Nova Reunião
          </a>
        </Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-2">Data</th>
            <th className="p-2">SDR</th>
            <th className="p-2">Título</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Status</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.data_agendamento).toLocaleString()}</td>
              <td className="p-2">{r.nome_sdr ?? "-"}</td>
              <td className="p-2">{r.titulo}</td>
              <td className="p-2">{r.cliente_nome ?? "-"}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">
                <Link href={`/reunioes/${r.id}/editar`} legacyBehavior>
                  <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                    Editar
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
