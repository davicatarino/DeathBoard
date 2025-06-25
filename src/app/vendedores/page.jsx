// src/app/vendedores/page.jsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
    if (confirm("Tem certeza que deseja desativar este vendedor? Esta ação pode ser revertida editando o vendedor.")) {
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
        toast.success("Vendedor desativado com sucesso!");
      } catch (err) {
        console.error(err);
        toast.error(`Erro ao desativar vendedor: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-300">Carregando vendedores...</span>
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
        <h1 className="text-3xl font-bold text-gray-100">Gerenciar Vendedores</h1>
        <Link 
          href="/vendedores/novo" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Adicionar Novo Vendedor
        </Link>
      </div>

      {vendedores.length === 0 ? (
        <p className="text-center text-gray-400">Nenhum vendedor registrado.</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Nome</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Data de Contratação</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((vendedor) => (
                <tr key={vendedor.id} className="bg-gray-900 border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-100">
                    {vendedor.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {vendedor.foto_url ? (
                        <img 
                          src={vendedor.foto_url} 
                          alt={vendedor.nome} 
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                          <span className="text-gray-300 font-bold">
                            {vendedor.nome.charAt(0)}
                          </span>
                        </div>
                      )}
                      {vendedor.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {vendedor.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      vendedor.ativo 
                        ? 'bg-green-700 text-green-200' 
                        : 'bg-red-700 text-red-200'
                    }`}>
                      {vendedor.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {vendedor.data_contratacao 
                      ? new Date(vendedor.data_contratacao).toLocaleDateString('pt-BR') 
                      : 'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link 
                      href={`/vendedores/${vendedor.id}/editar`} 
                      className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDelete(vendedor.id)} 
                      className="font-medium text-red-400 hover:text-red-300 hover:underline"
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

