"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarSDRPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ nome: "", email: "", foto_url: "", ativo: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/sdrs/${id}`);
        if (!res.ok) throw new Error("SDR não encontrado");
        const data = await res.json();
        setForm({
          nome: data.nome || "",
          email: data.email || "",
          foto_url: data.foto_url || "",
          ativo: data.ativo,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/sdrs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Erro ao salvar");
      router.push("/sdrs");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-lg text-gray-300">Carregando…</span>
    </div>
  );
  if (error)   return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">Editar SDR</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Nome</label>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-gray-900 text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">E‑mail</label>
          <input
            type="email"
            name="email"
            placeholder="E‑mail"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-gray-900 text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">URL da foto (opcional)</label>
          <input
            type="url"
            name="foto_url"
            placeholder="URL da foto"
            value={form.foto_url}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-gray-900 text-gray-100"
          />
        </div>
        <label className="flex items-center gap-2 text-gray-200">
          <input
            type="checkbox"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
            className="accent-blue-600"
          />
          Ativo
        </label>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 font-semibold transition-all"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
