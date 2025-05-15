// src/app/vendas/nova/page.jsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NovaVendaPage() {
  const router = useRouter();
  const [vendedorId, setVendedorId] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [dataVenda, setDataVenda] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [descricao, setDescricao] = useState('');
  const [vendedores, setVendedores] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch active vendedores to populate dropdown
    async function fetchVendedoresAtivos() {
      try {
        const res = await fetch('/api/vendedores?ativo=true'); // Assuming API supports filtering active
        if (!res.ok) {
          throw new Error('Falha ao buscar vendedores');
        }
        const data = await res.json();
        setVendedores(data);
        if (data.length > 0) {
          setVendedorId(data[0].id); // Default to first vendedor
        }
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar a lista de vendedores.');
      }
    }
    fetchVendedoresAtivos();
  }, []);

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
      const res = await fetch('/api/vendas', {
        method: 'POST',
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
        throw new Error(errorData.message || 'Falha ao registrar venda');
      }
      alert('Venda registrada com sucesso!');
      router.push('/vendas'); // Redireciona para a lista de vendas
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Registrar Nova Venda</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">Erro: {error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white text-black p-8 shadow-md rounded-lg">
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
            {submitting ? 'Salvando...' : 'Salvar Venda'}
          </button>
          <Link href="/vendas" legacyBehavior>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Cancelar</a>
          </Link>
        </div>
      </form>
    </div>
  );
}

