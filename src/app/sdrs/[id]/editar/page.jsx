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

  if (loading) return <p className="p-4">Carregando…</p>;
  if (error)   return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar SDR</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E‑mail"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="url"
          name="foto_url"
          placeholder="URL da foto (opcional)"
          value={form.foto_url}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
          />
          Ativo
        </label>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
