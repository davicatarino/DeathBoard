// src/app/vendas/page.jsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
        alert("Venda removida com sucesso!");
      } catch (err) {
        console.error(err);
        alert(`Erro ao remover venda: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4"><p className="text-center text-lg">Carregando vendas...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-center text-red-500 text-lg">Erro: {error}</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Vendas</h1>
        <Link href="/vendas/nova" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Adicionar Nova Venda
          </a>
        </Link>
      </div>

      {vendas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma venda registrada.</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                <tr key={venda.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                    <Link href={`/vendas/${venda.id}/editar`} legacyBehavior>
                      <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</a>
                    </Link>
                    <button 
                      onClick={() => handleDelete(venda.id)} 
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
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
        <Link href="/" legacyBehavior>
            <a className="text-blue-500 hover:underline">&larr; Voltar para Home</a>
        </Link>
      </div>
    </div>
  );
}

