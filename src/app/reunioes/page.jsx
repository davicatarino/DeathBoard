"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (erro) toast.error(erro);
  }, [erro]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-lg text-gray-300">Carregando…</span>
    </div>
  );
  if (erro) return <p className="p-4 text-red-500">{erro}</p>;
  if (!dados.length) return <p className="p-4">Nenhuma reunião encontrada.</p>;

  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-100">Reuniões</h1>
        <Link href="/reunioes/novo" legacyBehavior>
          <a
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition-all"
            title="Agendar nova reunião"
          >
            Nova Reunião
          </a>
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="sticky top-0 z-10 bg-slate-800 text-white">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">SDR</th>
              <th className="p-3">Título</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((r, idx) => (
              <tr
                key={r.id}
                className={`border-t transition-colors ${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700`}
              >
                <td className="p-3">{new Date(r.data_agendamento).toLocaleString()}</td>
                <td className="p-3">{r.nome_sdr ?? "-"}</td>
                <td className="p-3">{r.titulo}</td>
                <td className="p-3">{r.cliente_nome ?? "-"}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${r.status === "realizada" ? "bg-green-700 text-green-200"
                      : r.status === "cancelada" ? "bg-red-700 text-red-200"
                      : "bg-yellow-700 text-yellow-200"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/reunioes/${r.id}/editar`} legacyBehavior>
                    <a
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm shadow transition-all"
                      title="Editar reunião"
                    >
                      Editar
                    </a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
