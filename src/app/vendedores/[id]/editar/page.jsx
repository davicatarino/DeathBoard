// src/app/vendedores/[id]/editar/page.jsx
"use client";

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation'; // Corrected import for App Router
import { useState, useEffect } from 'react';

export default function EditarVendedorPage() {
  const router = useRouter();
  const params = useParams(); // Hook to get route parameters
  const { id } = params;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataContratacao, setDataContratacao] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      async function fetchVendedor() {
        try {
          setLoading(true);
          const res = await fetch(`/api/vendedores/${id}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Falha ao buscar dados do vendedor');
          }
          const data = await res.json();
          setNome(data.nome);
          setEmail(data.email);
          setDataContratacao(data.data_contratacao ? new Date(data.data_contratacao).toISOString().split('T')[0] : '');
          setAtivo(data.ativo);
          setError(null);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchVendedor();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/vendedores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          data_contratacao: dataContratacao || null,
          ativo,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao atualizar vendedor');
      }
      alert('Vendedor atualizado com sucesso!');
      router.push('/vendedores'); // Redireciona para a lista de vendedores
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && id) {
    return <div className="container mx-auto p-4"><p className="text-center text-lg">Carregando dados do vendedor...</p></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500 text-lg">Erro: {error}</p>
        <Link href="/vendedores" legacyBehavior><a className="text-blue-500 hover:underline">Voltar para lista</a></Link>
      </div>
    );
  }
  
  if (!id) { // Should not happen if routed correctly
      return <div className="container mx-auto p-4"><p className="text-center text-red-500 text-lg">ID do vendedor não fornecido.</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Editar Vendedor (ID: {id})</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">Erro ao salvar: {error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-black bg-white p-8 shadow-md rounded-lg">
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dataContratacao" className="block text-sm font-medium text-gray-700">Data de Contratação</label>
          <input
            type="date"
            id="dataContratacao"
            value={dataContratacao}
            onChange={(e) => setDataContratacao(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="ativo" className="block text-sm font-medium text-gray-700">Status</label>
          <select 
            id="ativo" 
            value={ativo} 
            onChange={(e) => setAtivo(e.target.value === 'true')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {submitting ? 'Salvando Alterações...' : 'Salvar Alterações'}
          </button>
          <Link href="/vendedores" legacyBehavior>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Cancelar</a>
          </Link>
        </div>
      </form>
    </div>
  );
}

