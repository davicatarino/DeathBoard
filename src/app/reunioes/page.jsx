"use client";
import { useEffect, useState } from "react";

export default function ReunioesPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch("/api/reunioes")
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
  if (!dados.length) return <p className="p-4">Nenhuma reunião encontrada.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reuniões</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-2">Data</th>
            <th className="p-2">SDR</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {dados.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.data_reuniao).toLocaleString()}</td>
              <td className="p-2">{r.nome_sdr}</td>
              <td className="p-2">{r.cliente}</td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
