// src/app/vendedores/page.jsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

async function fetchVendedores() {
  const res = await fetch('/api/vendedores', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao buscar dados dos vendedores');
  }
  return res.json();
}

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchVendedores();
        setVendedores(data);
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
    if (confirm("Tem certeza que deseja desativar este vendedor? As vendas associadas não serão removidas.")) {
      try {
        const res = await fetch(`/api/vendedores/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Falha ao desativar o vendedor');
        }
        // Atualiza a lista de vendedores removendo o desativado
        setVendedores(vendedores.filter(v => v.id !== id));
        alert("Vendedor desativado com sucesso!");
      } catch (err) {
        console.error(err);
        alert(`Erro ao desativar vendedor: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4"><p className="text-center text-lg">Carregando vendedores...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-center text-red-500 text-lg">Erro: {error}</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Vendedores</h1>
        <Link href="/vendedores/novo" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Adicionar Novo Vendedor
          </a>
        </Link>
      </div>

      {vendedores.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum vendedor cadastrado.</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nome</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Data de Contratação</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((vendedor) => (
                <tr key={vendedor.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {vendedor.nome}
                  </td>
                  <td className="px-6 py-4">
                    {vendedor.email}
                  </td>
                  <td className="px-6 py-4">
                    {vendedor.data_contratacao ? new Date(vendedor.data_contratacao).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {vendedor.ativo ? <span className="text-green-500">Ativo</span> : <span className="text-red-500">Inativo</span>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/vendedores/${vendedor.id}/editar`} legacyBehavior>
                      <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</a>
                    </Link>
                    <button 
                      onClick={() => handleDelete(vendedor.id)} 
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      disabled={!vendedor.ativo} // Desabilita se já estiver inativo
                    >
                      Desativar
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

