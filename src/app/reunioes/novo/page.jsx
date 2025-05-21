"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NovoReuniaoPage() {
  const router = useRouter();
  const [sdrs, setSdrs] = useState([]);
  const [form, setForm] = useState({ sdr_id: "", cliente: "", data_reuniao: "", status: "AGENDADA" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/sdrs?ativo=true").then((r) => r.json()).then(setSdrs);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/reunioes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/reunioes");
    else setError((await res.json()).message || "Erro");
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nova Reunião</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="sdr_id" value={form.sdr_id} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="" hidden>Selecione SDR</option>
          {sdrs.map((s) => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>
        <input type="text" name="cliente" placeholder="Cliente" value={form.cliente} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="datetime-local" name="data_reuniao" value={form.data_reuniao} onChange={handleChange} required className="w-full border p-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="AGENDADA">AGENDADA</option>
          <option value="REALIZADA">REALIZADA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">{loading ? "Salvando…" : "Salvar"}</button>
      </form>
    </div>
  );
}
