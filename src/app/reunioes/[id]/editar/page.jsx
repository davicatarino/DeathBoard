"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

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
    if (res.ok) {
      toast.success("Reunião atualizada!");
      router.push("/reunioes");
    } else {
      setError((await res.json()).message || "Erro");
      toast.error((await res.json()).message || "Erro ao atualizar reunião");
    }
    setSaving(false);
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-lg text-gray-300">Carregando…</span>
    </div>
  );
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">Editar Reunião</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">SDR</label>
          <select name="sdr_id" value={form.sdr_id} onChange={handleChange} required className="w-full border p-2 rounded bg-gray-900 text-gray-100">
            {sdrs.map(s => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Título</label>
          <input type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required className="w-full border p-2 rounded bg-gray-900 text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Data e Hora</label>
          <input type="datetime-local" name="data_agendamento" value={form.data_agendamento} onChange={handleChange} required className="w-full border p-2 rounded bg-gray-900 text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Nome do cliente</label>
          <input type="text" name="cliente_nome" placeholder="Nome do cliente" value={form.cliente_nome} onChange={handleChange} className="w-full border p-2 rounded bg-gray-900 text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded bg-gray-900 text-gray-100">
            <option value="agendada">agendada</option>
            <option value="realizada">realizada</option>
            <option value="cancelada">cancelada</option>
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 font-semibold transition-all">
          {saving ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
              Salvando…
            </span>
          ) : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
