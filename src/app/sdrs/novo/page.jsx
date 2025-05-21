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
      <h1 className="text-2xl font-bold mb-4">Adicionar novo SDR</h1>
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
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

// -----------------------