// src/app/vendas/page.jsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

async function fetchVendas() {
  const res = await fetch('/api/vendas', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao buscar dados das vendas');
  }
  return res.json();
}

export default function VendasPage() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchVendas();
        setVendas(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja remover esta venda? Esta ação não pode ser desfeita.")) {
      try {
        const res = await fetch(`/api/vendas/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Falha ao remover a venda');
        }
        // Atualiza a lista de vendas removendo a deletada
        setVendas(vendas.filter(v => v.id !== id));
        toast.success("Venda removida com sucesso!");
      } catch (err) {
        console.error(err);
        toast.error(`Erro ao remover venda: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-300">Carregando vendas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-400 text-lg">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Gerenciar Vendas</h1>
        <Link 
          href="/vendas/nova" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Adicionar Nova Venda
        </Link>
      </div>

      {vendas.length === 0 ? (
        <p className="text-center text-gray-400">Nenhuma venda registrada.</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">ID Venda</th>
                <th scope="col" className="px-6 py-3">Vendedor</th>
                <th scope="col" className="px-6 py-3 text-right">Valor (R$)</th>
                <th scope="col" className="px-6 py-3">Data da Venda</th>
                <th scope="col" className="px-6 py-3">Descrição</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id} className="bg-gray-900 border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-100">
                    {venda.id}
                  </td>
                  <td className="px-6 py-4">
                    {venda.nome_vendedor || 'N/A'} (ID: {venda.vendedor_id})
                  </td>
                  <td className="px-6 py-4 text-right">
                    {parseFloat(venda.valor_venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(venda.data_venda).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                  </td>
                  <td className="px-6 py-4">
                    {venda.descricao || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link 
                      href={`/vendas/${venda.id}/editar`} 
                      className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDelete(venda.id)} 
                      className="font-medium text-red-400 hover:text-red-300 hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8">
        <Link 
          href="/" 
          className="text-blue-400 hover:text-blue-300 hover:underline"
        >
          &larr; Voltar para Home
        </Link>
      </div>
    </div>
  );
}

