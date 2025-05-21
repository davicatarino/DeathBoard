"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReunioesPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch("/api/reunioes") // Corrigido para 'reunioes'
      .then(res => {
        if (!res.ok) throw new Error("Falha ao buscar reuniões");
        return res.json();
      })
      .then(setDados)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Carregando…</p>;
  if (erro) return <p className="p-4 text-red-500">{erro}</p>;
  if (!dados.length) return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reuniões</h1>
        <Link href="/reunioes/novo" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nova Reunião
        </Link>
      </div>
      <p>Nenhuma reunião encontrada.</p>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reuniões</h1>
        <Link href="/reunioes/novo" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nova Reunião
        </Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-2">Data</th>
            <th className="p-2">SDR</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Status</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.data_reuniao).toLocaleString()}</td>
              <td className="p-2">{r.nome_sdr}</td>
              <td className="p-2">{r.cliente}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">
                <Link
                  href={`/reunioes/${r.id}/editar`}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
