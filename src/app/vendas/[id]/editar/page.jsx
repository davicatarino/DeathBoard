// src/app/vendas/[id]/editar/page.jsx
"use client";

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditarVendaPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [vendedorId, setVendedorId] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [dataVenda, setDataVenda] = useState('');
  const [descricao, setDescricao] = useState('');
  const [vendedores, setVendedores] = useState([]); // For dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchVendedoresAtivos() {
      try {
        const res = await fetch('/api/vendedores?ativo=true');
        if (!res.ok) throw new Error('Falha ao buscar vendedores');
        const data = await res.json();
        setVendedores(data);
      } catch (err) {
        console.error("Erro carregando vendedores:", err);
        // Non-critical error for this form, but good to log
      }
    }
    fetchVendedoresAtivos();
  }, []);

  useEffect(() => {
    if (id) {
      async function fetchVenda() {
        try {
          setLoading(true);
          const res = await fetch(`/api/vendas/${id}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Falha ao buscar dados da venda');
          }
          const data = await res.json();
          setVendedorId(data.vendedor_id.toString());
          setValorVenda(data.valor_venda.toString());
          setDataVenda(data.data_venda ? new Date(data.data_venda).toISOString().split('T')[0] : '');
          setDescricao(data.descricao || '');
          setError(null);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchVenda();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!vendedorId || !valorVenda || !dataVenda) {
        setError("ID do Vendedor, Valor da Venda e Data da Venda são obrigatórios.");
        setSubmitting(false);
        return;
    }

    try {
      const res = await fetch(`/api/vendas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendedor_id: parseInt(vendedorId),
          valor_venda: parseFloat(valorVenda),
          data_venda: dataVenda,
          descricao,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao atualizar venda');
      }
      alert('Venda atualizada com sucesso!');
      router.push('/vendas');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading && id) {
    return <div className="container mx-auto p-4"><p className="text-center text-lg">Carregando dados da venda...</p></div>;
  }

  if (error && !submitting) { // Don't show main error if a submit error is shown
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500 text-lg">Erro: {error}</p>
        <Link href="/vendas" legacyBehavior><a className="text-blue-500 hover:underline">Voltar para lista de vendas</a></Link>
      </div>
    );
  }

  if (!id) {
      return <div className="container mx-auto p-4"><p className="text-center text-red-500 text-lg">ID da venda não fornecido.</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Editar Venda (ID: {id})</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">Erro ao salvar: {error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-black bg-white p-8 shadow-md rounded-lg">
        <div className="mb-4">
          <label htmlFor="vendedorId" className="block text-sm font-medium text-gray-700">Vendedor</label>
          <select
            id="vendedorId"
            value={vendedorId}
            onChange={(e) => setVendedorId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Selecione um vendedor</option>
            {vendedores.map(v => (
              <option key={v.id} value={v.id}>{v.nome}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="valorVenda" className="block text-sm font-medium text-gray-700">Valor da Venda (R$)</label>
          <input
            type="number"
            id="valorVenda"
            value={valorVenda}
            onChange={(e) => setValorVenda(e.target.value)}
            required
            step="0.01"
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dataVenda" className="block text-sm font-medium text-gray-700">Data da Venda</label>
          <input
            type="date"
            id="dataVenda"
            value={dataVenda}
            onChange={(e) => setDataVenda(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            disabled={submitting || vendedores.length === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {submitting ? 'Salvando Alterações...' : 'Salvar Alterações'}
          </button>
          <Link href="/vendas" legacyBehavior>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Cancelar</a>
          </Link>
        </div>
      </form>
    </div>
  );
}

