// src/app/sdrs/novo/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoSDRPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", foto_url: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sdrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Erro desconhecido");
      router.push("/sdrs");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">Adicionar novo SDR</h1>
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
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 font-semibold transition-all"
        >
          {loading ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

// -----------------------