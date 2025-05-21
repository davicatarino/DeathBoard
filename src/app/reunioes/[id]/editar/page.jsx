"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarReuniaoPage() {
  const router = useRouter();
  const { id } = useParams();
  const [sdrs, setSdrs] = useState([]);
  const [form, setForm] = useState({
    sdr_id: "",
    titulo: "",
    data_agendamento: "",
    status: "agendada",
    cliente_nome: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/sdrs?ativo=true").then(r => r.json()).then(setSdrs);
    fetch(`/api/reunioes/${id}`)
      .then(r => r.json())
      .then(d => {
        setForm({
          sdr_id: d.sdr_id,
          titulo: d.titulo,
          data_agendamento: d.data_agendamento.slice(0, 16),
          status: d.status,
          cliente_nome: d.cliente_nome ?? ""
        });
        setLoading(false);
      })
      .catch(() => setError("Não encontrado"));
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/reunioes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) router.push("/reunioes");
    else setError((await res.json()).message || "Erro");
    setSaving(false);
  }

  if (loading) return <p className="p-4">Carregando…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Reunião</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="sdr_id" value={form.sdr_id} onChange={handleChange} required className="w-full border p-2 rounded">
          {sdrs.map(s => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>
        <input type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="datetime-local" name="data_agendamento" value={form.data_agendamento} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="cliente_nome" placeholder="Nome do cliente" value={form.cliente_nome} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="agendada">agendada</option>
          <option value="realizada">realizada</option>
          <option value="cancelada">cancelada</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
